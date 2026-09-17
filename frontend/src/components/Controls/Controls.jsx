import React from 'react';

/**
 * Controls — Start/Pause/Resume + Reset buttons
 */
export default function Controls({
  isRunning,
  isPaused,
  isIdle,
  isComplete,
  onStart,
  onPause,
  onResume,
  onReset,
}) {
  let primaryLabel, primaryAction, primaryIcon;

  if (isComplete) {
    primaryLabel = 'RESTART';
    primaryAction = onReset;
    primaryIcon = 'bi-arrow-counterclockwise';
  } else if (isRunning) {
    primaryLabel = 'PAUSE';
    primaryAction = onPause;
    primaryIcon = 'bi-pause-fill';
  } else if (isPaused) {
    primaryLabel = 'RESUME';
    primaryAction = onResume;
    primaryIcon = 'bi-play-fill';
  } else {
    primaryLabel = 'START';
    primaryAction = onStart;
    primaryIcon = 'bi-play-fill';
  }

  const showReset = isPaused || isRunning;

  return (
    <div className="nami-controls">
      <button
        id="timer-primary-btn"
        className="nami-btn-start"
        onClick={primaryAction}
        aria-label={primaryLabel}
      >
        <i className={`bi ${primaryIcon}`}></i>
        {primaryLabel}
      </button>

      {showReset && (
        <button
          id="timer-reset-btn"
          className="nami-btn-reset"
          onClick={onReset}
          aria-label="Reset timer"
          title="Reset"
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      )}
    </div>
  );
}
