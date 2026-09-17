import React from 'react';

/**
 * SessionComplete — Minimal completion overlay
 * Shows session summary and next action options.
 */
export default function SessionComplete({
  mode,
  sessionName,
  duration,
  onStartBreak,
  onContinue,
  onDismiss,
}) {
  const minutes = Math.round(duration / 60);
  const isFocusComplete = mode === 'focus';

  return (
    <div className="nami-session-complete" onClick={onDismiss}>
      <div className="nami-session-complete-card" onClick={e => e.stopPropagation()}>
        <h2 className="nami-session-complete-title">
          {isFocusComplete ? 'Voyage complete.' : 'Break over.'}
        </h2>

        {sessionName && (
          <p className="nami-session-complete-subject">{sessionName}</p>
        )}

        <p className="nami-session-complete-duration">
          {minutes} minutes {isFocusComplete ? 'focused' : 'rested'}.
        </p>

        <p className="nami-session-complete-message">
          {isFocusComplete
            ? 'Your voyage continues.'
            : 'Ready for another voyage?'}
        </p>

        <div className="nami-session-complete-actions">
          {isFocusComplete ? (
            <>
              <button className="nami-btn-start" onClick={onStartBreak}>
                Start Break
              </button>
              <button className="nami-btn-reset" onClick={onContinue} title="Continue focusing">
                <i className="bi bi-arrow-right"></i>
              </button>
            </>
          ) : (
            <button className="nami-btn-start" onClick={onContinue}>
              Start Focus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
