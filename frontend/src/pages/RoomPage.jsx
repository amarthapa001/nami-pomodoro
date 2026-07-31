import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest, roomSocketUrl } from "../api.js";
import ProfileBadge from "../components/ProfileBadge.jsx";
import TimerCounter from "../components/TimerCounter.jsx";

export function RoomPage() {
  const { roomId } = useParams();
  const { token, myRoom } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [socketStatus, setSocketStatus] = useState("Connecting");
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // Fetch room metadata
  const fetchRoomDetails = useCallback(async () => {
    if (!roomId || !token) return;
    try {
      if (myRoom && myRoom.id === roomId) {
        setRoom(myRoom);
        setSessions(myRoom.sessions || []);
      } else {
        const data = await apiRequest(`/api/rooms/${roomId}/`, {}, token);
        setRoom(data);
        setSessions(data.sessions || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load room details");
    }
  }, [roomId, token, myRoom]);

  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  // Connect WebSocket ONLY when in this room
  useEffect(() => {
    if (!roomId || !token) return;

    setSocketStatus("Connecting");
    const socket = new WebSocket(roomSocketUrl(roomId, token));
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setSocketStatus("Connected");
    });

    socket.addEventListener("close", (event) => {
      setSocketStatus(`Closed ${event.code || ""}`.trim());
    });

    socket.addEventListener("error", () => {
      setSocketStatus("Error");
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "room.state" && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        } else if (data.type === "session.update") {
          setSessions((prevSessions) => {
            const index = prevSessions.findIndex((s) => String(s.user_id) === String(data.user_id));
            if (index !== -1) {
              const updated = [...prevSessions];
              updated[index] = {
                ...updated[index],
                status: data.status,
                session_count: data.session_count,
              };
              return updated;
            } else {
              return [
                ...prevSessions,
                {
                  user_id: data.user_id,
                  status: data.status,
                  session_count: data.session_count,
                },
              ];
            }
          });
        }
      } catch (err) {
        console.error("Failed to parse socket message", err);
      }
    });

    // Cleanup socket on unmount (leaving room)
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [roomId, token]);

  const sendTimerEvent = useCallback((type) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type }));
    } else {
      setError("WebSocket is not connected");
    }
  }, []);

  const isConnected = socketStatus === "Connected";

  return (
    <div className="main-content">
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
        <div>
          <button
            type="button"
            className="btn-outline-yellow"
            onClick={() => navigate("/")}
            style={{ marginBottom: 12 }}
          >
            ← Back to Dashboard
          </button>
          <h1>{room?.name || "Focus Room"}</h1>
          <div className="socket-badge">
            <span
              className={`status-dot ${
                socketStatus === "Connected"
                  ? "connected"
                  : socketStatus === "Connecting"
                  ? "connecting"
                  : ""
              }`}
            />
            <span>WebSocket: {socketStatus}</span>
          </div>
        </div>

        <button type="button" className="btn-danger" onClick={() => navigate("/")}>
          🚪 Leave Room
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid">
        {/* Live Timer Counter Section */}
        <section className="panel span-7">
          <div className="panel-header">
            <h2>⏱️ Live Room Counter</h2>
          </div>
          <TimerCounter onSendTimerEvent={sendTimerEvent} isConnected={isConnected} />
        </section>

        {/* Room Participants Status List */}
        <section className="panel span-5">
          <div className="panel-header">
            <h2>👥 Active Participants ({sessions.length})</h2>
          </div>
          <div className="list">
            {sessions.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No participants in room yet.</p>
            ) : (
              sessions.map((session) => (
                <div className="list-item" key={session.user_id || session.id}>
                  <ProfileBadge
                    profile={
                      session.user_profile || {
                        display_name: session.display_name || "Participant",
                        avatar_url: session.avatar_url,
                      }
                    }
                  />
                  <div style={{ textAlign: "right" }}>
                    <span className={`pill pill-${session.status || "idle"}`}>
                      {session.status || "idle"}
                    </span>
                    <span style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>
                      {session.session_count || 0} sessions
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default RoomPage;
