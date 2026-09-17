import React from 'react';
import { MODE_LABELS } from '../../data/mockData';

/**
 * TimerMode — Focus / Short Break / Long Break switcher
 * Shows session count badges next to each mode.
 */
export default function TimerMode({ mode, sessionCounts, onSwitchMode, disabled }) {
  const modes = [
    { id: 'focus', label: MODE_LABELS.focus },
    { id: 'shortBreak', label: MODE_LABELS.shortBreak },
    { id: 'longBreak', label: MODE_LABELS.longBreak },
  ];

  return (
    <div className="nami-mode-switcher">
      {modes.map(m => (
        <button
          key={m.id}
          id={`mode-${m.id}`}
          className={`nami-mode-btn ${mode === m.id ? 'active' : ''}`}
          onClick={() => onSwitchMode(m.id)}
          disabled={disabled}
          aria-label={`Switch to ${m.label}`}
        >
          {m.label}
          {sessionCounts[m.id] > 0 && (
            <span className="nami-mode-badge">{sessionCounts[m.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
