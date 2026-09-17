import React from 'react';

/**
 * Settings — Timer configuration, automation, and sound settings
 * Sound toggle now actually controls audio effects.
 */
export default function Settings({
  durations,
  onUpdateDurations,
  autoStartBreak,
  onToggleAutoStartBreak,
  autoStartFocus,
  onToggleAutoStartFocus,
  soundEnabled,
  onToggleSound,
  onClose,
}) {
  const handleDurationChange = (mode, delta) => {
    const currentSeconds = durations[mode];
    const currentMinutes = Math.round(currentSeconds / 60);
    const newMinutes = Math.max(1, Math.min(120, currentMinutes + delta));
    onUpdateDurations({ [mode]: newMinutes * 60 });
  };

  return (
    <>
      <div className="nami-panel-overlay" onClick={onClose}></div>
      <div className="nami-panel" role="dialog" aria-label="Settings">
        <div className="nami-panel-header">
          <span className="nami-panel-title">Settings</span>
          <button className="nami-panel-close" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="nami-panel-body">
          {/* Timer Section */}
          <div className="nami-settings-section">
            <div className="nami-settings-section-title">Timer</div>

            <div className="nami-settings-row">
              <span className="nami-settings-label">Focus</span>
              <div className="nami-settings-value">
                <button className="nami-settings-num-btn" onClick={() => handleDurationChange('focus', -5)} aria-label="Decrease focus duration">−</button>
                <span className="nami-settings-num">{Math.round(durations.focus / 60)}m</span>
                <button className="nami-settings-num-btn" onClick={() => handleDurationChange('focus', 5)} aria-label="Increase focus duration">+</button>
              </div>
            </div>

            <div className="nami-settings-row">
              <span className="nami-settings-label">Short Break</span>
              <div className="nami-settings-value">
                <button className="nami-settings-num-btn" onClick={() => handleDurationChange('shortBreak', -1)} aria-label="Decrease short break">−</button>
                <span className="nami-settings-num">{Math.round(durations.shortBreak / 60)}m</span>
                <button className="nami-settings-num-btn" onClick={() => handleDurationChange('shortBreak', 1)} aria-label="Increase short break">+</button>
              </div>
            </div>

            <div className="nami-settings-row">
              <span className="nami-settings-label">Long Break</span>
              <div className="nami-settings-value">
                <button className="nami-settings-num-btn" onClick={() => handleDurationChange('longBreak', -5)} aria-label="Decrease long break">−</button>
                <span className="nami-settings-num">{Math.round(durations.longBreak / 60)}m</span>
                <button className="nami-settings-num-btn" onClick={() => handleDurationChange('longBreak', 5)} aria-label="Increase long break">+</button>
              </div>
            </div>
          </div>

          {/* Automation Section */}
          <div className="nami-settings-section">
            <div className="nami-settings-section-title">Automation</div>

            <div className="nami-settings-row">
              <span className="nami-settings-label">Auto-start break</span>
              <button
                className={`nami-settings-toggle ${autoStartBreak ? 'on' : ''}`}
                onClick={onToggleAutoStartBreak}
                role="switch"
                aria-checked={autoStartBreak}
                aria-label="Auto-start break"
              ></button>
            </div>

            <div className="nami-settings-row">
              <span className="nami-settings-label">Auto-start focus</span>
              <button
                className={`nami-settings-toggle ${autoStartFocus ? 'on' : ''}`}
                onClick={onToggleAutoStartFocus}
                role="switch"
                aria-checked={autoStartFocus}
                aria-label="Auto-start focus"
              ></button>
            </div>
          </div>

          {/* Sound Section */}
          <div className="nami-settings-section">
            <div className="nami-settings-section-title">Sound</div>
            <div className="nami-settings-row">
              <span className="nami-settings-label">Sound effects</span>
              <button
                className={`nami-settings-toggle ${soundEnabled ? 'on' : ''}`}
                onClick={onToggleSound}
                role="switch"
                aria-checked={soundEnabled}
                aria-label="Sound effects"
              ></button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="nami-settings-section">
            <div className="nami-settings-section-title">Shortcuts</div>
            <div className="nami-settings-shortcuts">
              <div className="nami-shortcut-row">
                <kbd>Space</kbd>
                <span>Start / Pause</span>
              </div>
              <div className="nami-shortcut-row">
                <kbd>R</kbd>
                <span>Reset timer</span>
              </div>
              <div className="nami-shortcut-row">
                <kbd>Esc</kbd>
                <span>Close panel</span>
              </div>
              <div className="nami-shortcut-row">
                <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>
                <span>Switch mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
