import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileBadge from "../components/ProfileBadge.jsx";

export function DashboardPage() {
  const { profile, myRoom, rooms, loading, error } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <div style={{ marginBottom: 28 }}>
        <h1>Focus Dashboard</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Welcome back, <span style={{ color: "var(--accent-yellow)", fontWeight: 700 }}>{profile?.display_name || "User"}</span>! Select a room to enter and start live pomodoro timer.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid">
        {/* My Room Panel */}
        <section className="panel span-5">
          <div className="panel-header">
            <h2>🏠 My Focus Room</h2>
          </div>
          {myRoom ? (
            <div className="room-card" style={{ border: "1px solid var(--border-yellow)" }}>
              <div className="room-card-header">
                <h3>{myRoom.name}</h3>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Personal Focus Room</span>
              </div>
              <ProfileBadge profile={myRoom.owner_profile} />
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate(`/room/${myRoom.id}`)}
              >
                🚀 Enter My Room
              </button>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>{loading ? "Loading room..." : "No personal room found."}</p>
          )}
        </section>

        {/* Friend Rooms Panel */}
        <section className="panel span-7">
          <div className="panel-header">
            <h2>👥 Friend Rooms</h2>
          </div>
          <div className="room-grid">
            {rooms.length === 0 ? (
              <p style={{ color: "var(--text-muted)", gridColumn: "1 / -1" }}>
                No friend rooms available yet. Connect with friends in the <strong>Friends</strong> page!
              </p>
            ) : (
              rooms.map((room) => (
                <div className="room-card" key={room.id}>
                  <div className="room-card-header">
                    <h3>{room.name}</h3>
                  </div>
                  <ProfileBadge profile={room.owner_profile} />
                  <button
                    type="button"
                    className="btn-outline-yellow"
                    onClick={() => navigate(`/room/${room.id}`)}
                  >
                    🚪 Enter Room
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

export default DashboardPage;
