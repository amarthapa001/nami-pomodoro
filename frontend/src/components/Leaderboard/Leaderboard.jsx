import React from 'react';
import { MOCK_LEADERBOARD } from '../../data/mockData';

/**
 * Leaderboard — Weekly voyage rankings
 */
export default function Leaderboard({ onClose }) {
  return (
    <>
      <div className="nami-panel-overlay" onClick={onClose}></div>
      <div className="nami-panel" role="dialog" aria-label="Leaderboard">
        <div className="nami-panel-header">
          <span className="nami-panel-title">Weekly Voyage</span>
          <button className="nami-panel-close" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="nami-panel-body">
          <div className="nami-leaderboard-list">
            {MOCK_LEADERBOARD.map((entry, index) => (
              <div
                key={entry.id}
                className={`nami-leaderboard-item ${entry.isYou ? 'is-you' : ''}`}
              >
                <span className="nami-leaderboard-rank">{index + 1}</span>
                <div className="nami-leaderboard-avatar">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                <span className="nami-leaderboard-name">
                  {entry.username}
                  {entry.isYou && <span style={{ color: 'var(--ocean-light)', marginLeft: 4, fontSize: '0.72rem' }}>(you)</span>}
                </span>
                <span className="nami-leaderboard-sessions">
                  {entry.sessions} sessions
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
