import React from 'react';
import { MODE_LABELS } from '../../data/mockData';

/**
 * Timer — Clean numeric countdown display
 * No circular ring. Just typography on the ocean.
 */
export default function Timer({ formattedTime, mode, sessionName, isRunning }) {
  return (
    <div className="nami-timer-area">
      <div className="nami-timer-display" aria-live="polite" aria-atomic="true">
        {formattedTime}
      </div>
      <div className="nami-timer-label">
        <span className={`nami-timer-dot ${isRunning ? 'running' : ''}`}></span>
        <span>{sessionName || MODE_LABELS[mode] + ' session'}</span>
      </div>
    </div>
  );
}
