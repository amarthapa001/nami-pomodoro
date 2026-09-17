import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../api.js";
import ProfileBadge from "../components/ProfileBadge.jsx";

export function FriendsPage() {
  const { token, friends, sendFriendRequest, removeFriend, loading, error, setError } = useAuth();
  const [friendUserId, setFriendUserId] = useState("");
  const [publicUserId, setPublicUserId] = useState("");
  const [publicProfile, setPublicProfile] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSendRequest(e) {
    e.preventDefault();
    if (!friendUserId.trim()) return;
    setSuccessMsg("");
    const res = await sendFriendRequest(friendUserId.trim());
    if (res !== null) {
      setSuccessMsg("Friend request sent successfully!");
      setFriendUserId("");
    }
  }

  async function handleLookupProfile(e) {
    e.preventDefault();
    if (!publicUserId.trim()) return;
    setError("");
    try {
      const data = await apiRequest(`/api/profile/${publicUserId.trim()}/`, {}, token);
      setPublicProfile(data);
    } catch (err) {
      setError(err.message || "User profile not found");
      setPublicProfile(null);
    }
  }

  function formatDate(value) {
    if (!value) return "Unknown";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: 28 }}>
        <h1>Friends & Connections</h1>
        <p style={{ color: "var(--text-muted)" }}>
          Manage your friend list, send new friend requests, or search for other users.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {successMsg && (
        <div style={{ padding: "12px 16px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#4ade80", borderRadius: "var(--radius-md)", marginBottom: 20 }}>
          {successMsg}
        </div>
      )}

      <div className="grid">
        {/* Send Friend Request Panel */}
        <section className="panel span-6">
          <div className="panel-header">
            <h2>➕ Add Friend</h2>
          </div>
          <form onSubmit={handleSendRequest} className="stack">
            <label>
              Receiver User ID
              <input
                type="text"
                placeholder="Enter User UUID (e.g. 550e8400-e29b-41d4-a716-446655440000)"
                value={friendUserId}
                onChange={(e) => setFriendUserId(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn-primary" disabled={loading}>
              Send Friend Request
            </button>
          </form>
        </section>

        {/* Lookup Profile Panel */}
        <section className="panel span-6">
          <div className="panel-header">
            <h2>🔍 Search Profile</h2>
          </div>
          <form onSubmit={handleLookupProfile} className="stack" style={{ marginBottom: 16 }}>
            <label>
              User ID
              <input
                type="text"
                placeholder="User UUID"
                value={publicUserId}
                onChange={(e) => setPublicUserId(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn-outline-yellow" disabled={loading}>
              Lookup Profile
            </button>
          </form>
          {publicProfile && (
            <div style={{ padding: 14, background: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <ProfileBadge profile={publicProfile} />
            </div>
          )}
        </section>

        {/* Friends List Panel */}
        <section className="panel span-12">
          <div className="panel-header">
            <h2>👥 Your Friends ({friends.length})</h2>
          </div>
          <div className="list">
            {friends.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No friends added yet.</p>
            ) : (
              friends.map((friendship) => (
                <div className="list-item" key={friendship.id}>
                  <ProfileBadge profile={friendship.friend_profile} />
                  <span style={{ color: "var(--text-subtle)", fontSize: "0.84rem" }}>
                    Connected: {formatDate(friendship.created_at)}
                  </span>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => removeFriend(friendship.id)}
                    disabled={loading}
                  >
                    Remove Friend
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default FriendsPage;
