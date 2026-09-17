import React from 'react';

/**
 * Navbar — Top navigation bar
 * Left: NAMI brand
 * Right: Utility action buttons (Music, Todo, History, Leaderboard, Settings, Profile)
 * Shows active music indicator when music is playing.
 */
export default function Navbar({ activePanel, onTogglePanel, isMusicPlaying }) {
  const actions = [
    { id: 'music', icon: 'bi-music-note-beamed', label: 'Music', showDot: isMusicPlaying },
    { id: 'todo', icon: 'bi-check2-square', label: 'Tasks' },
    { id: 'history', icon: 'bi-clock-history', label: 'History' },
    { id: 'leaderboard', icon: 'bi-trophy', label: 'Leaderboard' },
    { id: 'settings', icon: 'bi-gear', label: 'Settings' },
    { id: 'profile', icon: 'bi-person', label: 'Profile' },
  ];

  return (
    <nav className="nami-navbar">
      <a href="/" className="nami-brand">NAMI</a>

      <div className="nami-nav-actions">
        {actions.map(action => (
          <button
            key={action.id}
            id={`nav-${action.id}`}
            className={`nami-nav-btn ${activePanel === action.id ? 'active' : ''}`}
            onClick={() => onTogglePanel(action.id)}
            aria-label={action.label}
            title={action.label}
          >
            <i className={`bi ${action.icon}`}></i>
            {action.showDot && <span className="nami-nav-indicator"></span>}
          </button>
        ))}
      </div>
    </nav>
  );
}
