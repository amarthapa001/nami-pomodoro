import React from 'react';

/**
 * Streak — Small streak badge for the main dashboard
 * Shows the current daily focus streak with a flame icon.
 * Only visible when streak > 0.
 */
export default function Streak({ streak }) {
  if (streak <= 0) return null;

  return (
    <div className="nami-streak-badge" title={`${streak} day streak`}>
      <i className="bi bi-fire"></i>
      <span className="nami-streak-count">{streak}</span>
    </div>
  );
}
