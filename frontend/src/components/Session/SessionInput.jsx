import React from 'react';

/**
 * SessionInput — "What are you focusing on?" input
 * Shown when the timer is idle. Hidden during active session.
 */
export default function SessionInput({ sessionName, onSessionNameChange, isIdle }) {
  if (!isIdle) return null;

  return (
    <div className="nami-session-input-wrap">
      <input
        id="session-name-input"
        type="text"
        className="nami-session-input"
        placeholder="What are you focusing on?"
        value={sessionName}
        onChange={(e) => onSessionNameChange(e.target.value)}
        maxLength={60}
        autoComplete="off"
      />
    </div>
  );
}
