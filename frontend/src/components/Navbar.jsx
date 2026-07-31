import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function Navbar() {
  const { profile, incomingRequests, logout, loading } = useAuth();
  const pendingRequestsCount = incomingRequests?.filter((r) => r.status === "pending").length || 0;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">⏱️</div>
          <span>Pomodoro Rooms</span>
        </NavLink>

        <nav className="navbar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            🏠 Dashboard
          </NavLink>
          <NavLink to="/friends" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            👥 Friends
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            📩 Requests
            {pendingRequestsCount > 0 && <span className="nav-badge">{pendingRequestsCount}</span>}
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            ⚙️ Settings
          </NavLink>
        </nav>

        <div className="navbar-actions">
          {profile && (
            <NavLink to="/settings" className="profile-badge" style={{ textDecoration: "none" }}>
              <div className="avatar" style={{ width: 34, height: 34, fontSize: "0.9rem" }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name} />
                ) : (
                  profile.display_name?.[0]?.toUpperCase() || "P"
                )}
              </div>
            </NavLink>
          )}
          <button type="button" className="btn-danger" onClick={logout} disabled={loading} style={{ minHeight: 36, padding: "0 14px", fontSize: "0.85rem" }}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
