import { useEffect, useMemo, useRef, useState } from "react";
import { apiRequest, roomSocketUrl, storage } from "./api.js";
import { useNavigate } from "react-router-dom";

const emptyAuthForm = {
  email: "",
  username: "",
  password: "",
  display_name: "",
};

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ProfileBadge({ profile }) {
  if (!profile) {
    return null;
  }

  return (
    <div className="profile-badge">
      <div className="avatar">{profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : profile.display_name?.[0] || "P"}</div>
      <div>
        <strong>{profile.display_name}</strong>
        <span>{profile.bio || "No bio yet"}</span>
      </div>
    </div>
  );
}

function JsonBlock({ value }) {
  if (!value) {
    return null;
  }

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

function App() {
  const [auth, setAuth] = useState(() => storage.get());
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ display_name: "", bio: "" });
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [friendUserId, setFriendUserId] = useState("");
  const [publicUserId, setPublicUserId] = useState("");
  const [publicProfile, setPublicProfile] = useState(null);
  const [socketStatus, setSocketStatus] = useState("Disconnected");
  const [socketEvents, setSocketEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const token = auth?.access;
  const currentRoomId = selectedRoom?.id || myRoom?.id;

  const sessionRows = useMemo(() => {
    if (!selectedRoom && !myRoom) {
      return [];
    }
    return (selectedRoom || myRoom).sessions || [];
  }, [myRoom, selectedRoom]);

  function saveAuth(nextAuth) {
    setAuth(nextAuth);
    storage.set(nextAuth);
  }

  async function run(action) {
    setError("");
    setLoading(true);
    try {
      return await action();
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard() {
    if (!token) {
      return;
    }

    await run(async () => {
      const [nextProfile, nextFriends, nextIncoming, nextRooms, nextMyRoom] = await Promise.all([
        apiRequest("/api/profile/me/", {}, token),
        apiRequest("/api/friends/", {}, token),
        apiRequest("/api/friends/requests/incoming/", {}, token),
        apiRequest("/api/rooms/", {}, token),
        apiRequest("/api/rooms/me/", {}, token),
      ]);

      setProfile(nextProfile);
      setProfileForm({ display_name: nextProfile.display_name || "", bio: nextProfile.bio || "" });
      setFriends(nextFriends);
      setIncomingRequests(nextIncoming);
      setRooms(nextRooms);
      setMyRoom(nextMyRoom);
      setSelectedRoom(nextMyRoom);
    });
  }

  useEffect(() => {
    loadDashboard();
  }, [token]);

  useEffect(() => {
    return () => {
      socketRef.current?.close();
    };
  }, []);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    await run(async () => {
      const path = authMode === "register" ? "/api/auth/register/" : "/api/auth/login/";
      const payload =
        authMode === "register"
          ? {
              email: authForm.email,
              password: authForm.password,
              display_name: authForm.display_name,
            }
          : {
              email: authForm.email,
              password: authForm.password,
            };
      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      saveAuth(data);
      setAuthForm(emptyAuthForm);
    });
  }

  async function refreshAccessToken() {
    if (!auth?.refresh) {
      return;
    }
    await run(async () => {
      const data = await apiRequest("/api/auth/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: auth.refresh }),
      });
      saveAuth({ ...auth, ...data });
    });
  }

  async function logout() {
    await run(async () => {
      if (auth?.refresh) {
        await apiRequest(
          "/api/auth/logout/",
          {
            method: "POST",
            body: JSON.stringify({ refresh: auth.refresh }),
          },
          token,
        );
      }
      socketRef.current?.close();
      storage.clear();
      setAuth(null);
      setProfile(null);
      setFriends([]);
      setIncomingRequests([]);
      setRooms([]);
      setMyRoom(null);
      setSelectedRoom(null);
      navigate("/");
    });
  }

  async function updateProfile(event) {
    event.preventDefault();
    await run(async () => {
      const data = await apiRequest(
        "/api/profile/me/",
        {
          method: "PATCH",
          body: JSON.stringify(profileForm),
        },
        token,
      );
      setProfile(data);
    });
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await run(async () => {
      const formData = new FormData();
      formData.append("avatar", file);
      await apiRequest(
        "/api/profile/me/avatar/",
        {
          method: "POST",
          body: formData,
        },
        token,
      );
      await loadDashboard();
    });
    event.target.value = "";
  }

  async function lookupPublicProfile(event) {
    event.preventDefault();
    if (!publicUserId.trim()) {
      return;
    }
    await run(async () => {
      const data = await apiRequest(`/api/profile/${publicUserId.trim()}/`, {}, token);
      setPublicProfile(data);
    });
  }

  async function sendFriendRequest(event) {
    event.preventDefault();
    if (!friendUserId.trim()) {
      return;
    }
    await run(async () => {
      await apiRequest(
        "/api/friends/requests/",
        {
          method: "POST",
          body: JSON.stringify({ receiver_id: friendUserId.trim() }),
        },
        token,
      );
      setFriendUserId("");
      await loadDashboard();
    });
  }

  async function respondToRequest(requestId, status) {
    await run(async () => {
      await apiRequest(
        `/api/friends/requests/${requestId}/`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
        token,
      );
      await loadDashboard();
    });
  }

  async function removeFriend(friendshipId) {
    await run(async () => {
      await apiRequest(
        `/api/friends/${friendshipId}/`,
        {
          method: "DELETE",
        },
        token,
      );
      await loadDashboard();
    });
  }

  async function openRoom(roomId) {
    if (!roomId) {
      return;
    }

    if (roomId === myRoom?.id) {
      setSelectedRoom(myRoom);
      return;
    }

    await run(async () => {
      const room = await apiRequest(`/api/rooms/${roomId}/`, {}, token);
      setSelectedRoom(room);
    });
  }

  function connectRoomSocket() {
    if (!currentRoomId || !token) {
      return;
    }

    socketRef.current?.close();
    const socket = new WebSocket(roomSocketUrl(currentRoomId, token));
    socketRef.current = socket;
    setSocketEvents([]);
    setSocketStatus("Connecting");

    socket.addEventListener("open", () => setSocketStatus("Connected"));
    socket.addEventListener("close", (event) => setSocketStatus(`Closed ${event.code || ""}`.trim()));
    socket.addEventListener("error", () => setSocketStatus("Error"));
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      setSocketEvents((items) => [data, ...items].slice(0, 12));
    });
  }

  function sendTimerEvent(type) {
    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      setError("Connect to the room WebSocket first");
      return;
    }
    socketRef.current.send(JSON.stringify({ type }));
  }

  if (!auth) {
    return (
      <main className="auth-shell">
        <section className="auth-panel">
          <div>
            <p className="eyebrow">Pomodoro Rooms</p>
            <h1>Sign in to your focus room</h1>
            <p className="lede">Use the Django REST API contract for registration, login, profiles, friends, rooms, and live timer events.</p>
          </div>

          <div className="segmented">
            <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
              Login
            </button>
            <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="stack">
            <label>
              Email
              <input
                type="email"
                value={authMode === "login" ? authForm.username || authForm.email : authForm.email}
                onChange={(event) =>
                  setAuthForm((form) => ({
                    ...form,
                    email: event.target.value,
                    username: event.target.value,
                  }))
                }
                required
              />
            </label>
            {authMode === "register" && (
              <label>
                Display name
                <input value={authForm.display_name} onChange={(event) => setAuthForm((form) => ({ ...form, display_name: event.target.value }))} required />
              </label>
            )}
            <label>
              Password
              <input type="password" value={authForm.password} onChange={(event) => setAuthForm((form) => ({ ...form, password: event.target.value }))} required minLength={8} />
            </label>
            <button className="primary" disabled={loading}>
              {loading ? "Working..." : authMode === "register" ? "Create account" : "Login"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Pomodoro Rooms</p>
          <h1>Focus dashboard</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" onClick={loadDashboard} disabled={loading}>
            Refresh
          </button>
          <button type="button" onClick={refreshAccessToken} disabled={loading}>
            Refresh token
          </button>
          <button type="button" onClick={logout} disabled={loading}>
            Logout
          </button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="grid">
        <article className="panel span-4">
          <h2>Profile</h2>
          <ProfileBadge profile={profile} />
          <form onSubmit={updateProfile} className="stack">
            <label>
              Display name
              <input value={profileForm.display_name} onChange={(event) => setProfileForm((form) => ({ ...form, display_name: event.target.value }))} />
            </label>
            <label>
              Bio
              <textarea value={profileForm.bio} onChange={(event) => setProfileForm((form) => ({ ...form, bio: event.target.value }))} />
            </label>
            <div className="button-row">
              <button className="primary" disabled={loading}>
                Save profile
              </button>
              <label className="file-button">
                Upload avatar
                <input type="file" accept="image/*" onChange={uploadAvatar} />
              </label>
            </div>
          </form>
        </article>

        <article className="panel span-4">
          <h2>Find profile</h2>
          <form onSubmit={lookupPublicProfile} className="stack">
            <label>
              User ID
              <input value={publicUserId} onChange={(event) => setPublicUserId(event.target.value)} placeholder="UUID from a user record" />
            </label>
            <button className="primary" disabled={loading}>
              Lookup
            </button>
          </form>
          <ProfileBadge profile={publicProfile} />
        </article>

        <article className="panel span-4">
          <h2>Friend request</h2>
          <form onSubmit={sendFriendRequest} className="stack">
            <label>
              Receiver user ID
              <input value={friendUserId} onChange={(event) => setFriendUserId(event.target.value)} placeholder="UUID" />
            </label>
            <button className="primary" disabled={loading}>
              Send request
            </button>
          </form>
        </article>

        <article className="panel span-6">
          <h2>Incoming requests</h2>
          <div className="list">
            {incomingRequests.length === 0 && <p className="muted">No incoming requests.</p>}
            {incomingRequests.map((request) => (
              <div className="list-item" key={request.id}>
                <ProfileBadge profile={request.sender_profile} />
                <span className="pill">{request.status}</span>
                <button type="button" onClick={() => respondToRequest(request.id, "accepted")}>Accept</button>
                <button type="button" onClick={() => respondToRequest(request.id, "rejected")}>Reject</button>
              </div>
            ))}
          </div>
        </article>

        <article className="panel span-6">
          <h2>Friends</h2>
          <div className="list">
            {friends.length === 0 && <p className="muted">No friends yet.</p>}
            {friends.map((friendship) => (
              <div className="list-item" key={friendship.id}>
                <ProfileBadge profile={friendship.friend_profile} />
                <span>{formatDate(friendship.created_at)}</span>
                <button type="button" onClick={() => removeFriend(friendship.id)}>Remove</button>
              </div>
            ))}
          </div>
        </article>

        <article className="panel span-4">
          <h2>My room</h2>
          {myRoom && (
            <div className="room-card selected">
              <h3>{myRoom.name}</h3>
              <ProfileBadge profile={myRoom.owner_profile} />
              <button type="button" onClick={(event) => { event.stopPropagation(); openRoom(myRoom.id); }}>
                Open
              </button>
            </div>
          )}
        </article>

        <article className="panel span-8">
          <h2>Friend rooms</h2>
          <div className="room-grid">
            {rooms.length === 0 && <p className="muted">Friend rooms appear here after requests are accepted.</p>}
            {rooms.map((room) => (
              <button type="button" className="room-card" key={room.id} onClick={() => openRoom(room.id)}>
                <h3>{room.name}</h3>
                <ProfileBadge profile={room.owner_profile} />
              </button>
            ))}
          </div>
        </article>

        <article className="panel span-7">
          <h2>Room sessions</h2>
          {selectedRoom && (
            <div className="selected-room">
              <h3>{selectedRoom.name}</h3>
              <span className="muted">Created {formatDate(selectedRoom.created_at)}</span>
            </div>
          )}
          <div className="list">
            {sessionRows.length === 0 && <p className="muted">No active sessions in this room.</p>}
            {sessionRows.map((session) => (
              <div className="list-item" key={session.id}>
                <ProfileBadge profile={session.user_profile} />
                <span className="pill">{session.status}</span>
                <span>{session.session_count} sessions</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel span-5">
          <h2>Live timer</h2>
          <div className="socket-state">
            <span className="dot" />
            {socketStatus}
          </div>
          <div className="button-row">
            <button type="button" className="primary" onClick={connectRoomSocket} disabled={!currentRoomId}>
              Connect
            </button>
            <button type="button" onClick={() => socketRef.current?.close()}>
              Disconnect
            </button>
          </div>
          <div className="timer-controls">
            <button type="button" onClick={() => sendTimerEvent("timer.start")}>Start</button>
            <button type="button" onClick={() => sendTimerEvent("timer.pause")}>Pause</button>
            <button type="button" onClick={() => sendTimerEvent("timer.break")}>Break</button>
            <button type="button" onClick={() => sendTimerEvent("timer.reset")}>Reset</button>
            <button type="button" onClick={() => sendTimerEvent("timer.complete")}>Complete</button>
          </div>
          <JsonBlock value={socketEvents} />
        </article>
      </section>
    </main>
  );
}

export default App;
