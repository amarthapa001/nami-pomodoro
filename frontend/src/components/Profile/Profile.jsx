import React from 'react';

/**
 * Profile — User profile panel
 * Shows avatar, name, email, real study stats, and logout.
 * Uses actual session history data for stats instead of mock values.
 */
export default function Profile({ stats, streak, onClose }) {
  // Display user info from mock for now (will be replaced with auth context)
  const username = 'Amar';
  const email = 'amar@example.com';

  return (
    <>
      <div className="nami-panel-overlay" onClick={onClose}></div>
      <div className="nami-panel" role="dialog" aria-label="Profile">
        <div className="nami-panel-header">
          <span className="nami-panel-title">Profile</span>
          <button className="nami-panel-close" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="nami-panel-body">
          <div className="nami-profile-info">
            <div className="nami-profile-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="nami-profile-name">{username}</span>
            <span className="nami-profile-email">{email}</span>
          </div>

          <div className="nami-profile-stats">
            <div className="nami-profile-stat">
              <div className="nami-profile-stat-value">
                {stats.totalFocusMinutes}
              </div>
              <div className="nami-profile-stat-label">Minutes</div>
            </div>
            <div className="nami-profile-stat">
              <div className="nami-profile-stat-value">
                {stats.totalSessions}
              </div>
              <div className="nami-profile-stat-label">Sessions</div>
            </div>
            <div className="nami-profile-stat">
              <div className="nami-profile-stat-value">
                {streak > 0 && <i className="bi bi-fire" style={{ fontSize: '0.85rem', marginRight: 2, color: 'var(--coral)' }}></i>}
                {streak}
              </div>
              <div className="nami-profile-stat-label">Day Streak</div>
            </div>
          </div>

          <button className="nami-profile-btn">
            <i className="bi bi-pencil" style={{ marginRight: 6 }}></i>
            Edit Profile
          </button>
          <button className="nami-profile-btn logout">
            <i className="bi bi-box-arrow-right" style={{ marginRight: 6 }}></i>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
