import React from 'react';

/**
 * History — Session history panel
 * Shows completed sessions grouped by day.
 * Each entry displays mode, name, duration, and time.
 */

const MODE_ICONS = {
  focus: 'bi-bullseye',
  shortBreak: 'bi-cup-hot',
  longBreak: 'bi-cloud-sun',
};

const MODE_COLORS = {
  focus: 'var(--ocean-light)',
  shortBreak: 'var(--sky)',
  longBreak: 'var(--sky-pale)',
};

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  return `${mins}m`;
}

export default function History({ groupedSessions, stats, onClearHistory, onClose }) {
  const isEmpty = groupedSessions.length === 0;

  return (
    <>
      <div className="nami-panel-overlay" onClick={onClose}></div>
      <div className="nami-panel" role="dialog" aria-label="Session History">
        <div className="nami-panel-header">
          <span className="nami-panel-title">
            Session History
            {stats.totalSessions > 0 && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8, fontSize: '0.78rem' }}>
                {stats.totalSessions} sessions
              </span>
            )}
          </span>
          <button className="nami-panel-close" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="nami-panel-body">
          {/* Quick Stats Bar */}
          {stats.totalSessions > 0 && (
            <div className="nami-history-stats">
              <div className="nami-history-stat">
                <span className="nami-history-stat-value">{stats.totalFocusMinutes}</span>
                <span className="nami-history-stat-label">min</span>
              </div>
              <div className="nami-history-stat">
                <span className="nami-history-stat-value">{stats.totalSessions}</span>
                <span className="nami-history-stat-label">sessions</span>
              </div>
              <div className="nami-history-stat">
                <span className="nami-history-stat-value">{stats.streak}</span>
                <span className="nami-history-stat-label">day streak</span>
              </div>
            </div>
          )}

          {isEmpty ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
              No sessions yet. Complete a focus session to start tracking.
            </p>
          ) : (
            <div className="nami-history-groups">
              {groupedSessions.map(group => (
                <div key={group.dateKey} className="nami-history-group">
                  <div className="nami-history-day-label">{group.label}</div>
                  {group.sessions.map(session => (
                    <div key={session.id} className="nami-history-item">
                      <i
                        className={`bi ${MODE_ICONS[session.mode] || 'bi-circle'}`}
                        style={{ color: MODE_COLORS[session.mode], fontSize: '0.85rem', flexShrink: 0 }}
                      ></i>
                      <div className="nami-history-item-info">
                        <span className="nami-history-item-name">
                          {session.name || (session.mode === 'focus' ? 'Focus session' : session.mode === 'shortBreak' ? 'Short break' : 'Long break')}
                        </span>
                        <span className="nami-history-item-meta">
                          {formatDuration(session.duration)} · {formatTime(session.completedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Clear History */}
              <button
                className="nami-history-clear"
                onClick={onClearHistory}
                title="Clear all session history"
              >
                <i className="bi bi-trash3" style={{ marginRight: 4 }}></i>
                Clear History
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
