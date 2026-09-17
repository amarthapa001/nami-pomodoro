import React, { useRef, useEffect, useCallback } from 'react';
import { MUSIC_OPTIONS } from '../../data/mockData';

/**
 * Music — Audio player panel with radio-style track selection
 * Real audio playback via HTML5 Audio element.
 * Supports volume control, looping, and now-playing state.
 */
export default function Music({ selectedMusic, onSelectMusic, volume, onVolumeChange, onClose }) {
  const audioRef = useRef(null);
  const prevTrackRef = useRef(selectedMusic);

  // Get audio URL for current selection
  const currentOption = MUSIC_OPTIONS.find(o => o.id === selectedMusic);
  const audioUrl = currentOption?.audioUrl || null;

  // Handle track change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioUrl || selectedMusic === 'none') {
      audio.pause();
      audio.src = '';
      return;
    }

    // Only reload if track actually changed
    if (prevTrackRef.current !== selectedMusic) {
      audio.src = audioUrl;
      audio.loop = true;
      audio.volume = volume;
      audio.play().catch(() => {
        // Autoplay blocked — will play on next user interaction
      });
      prevTrackRef.current = selectedMusic;
    }
  }, [selectedMusic, audioUrl, volume]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handleSelect = useCallback((id) => {
    if (id === selectedMusic) {
      // Toggle off
      onSelectMusic('none');
    } else {
      onSelectMusic(id);
    }
  }, [selectedMusic, onSelectMusic]);

  const isPlaying = selectedMusic !== 'none' && audioUrl;

  return (
    <>
      <div className="nami-panel-overlay" onClick={onClose}></div>
      <div className="nami-panel" role="dialog" aria-label="Music selector">
        <div className="nami-panel-header">
          <span className="nami-panel-title">
            Music
            {isPlaying && (
              <span className="nami-music-playing-badge">
                <span className="nami-music-eq-bar"></span>
                <span className="nami-music-eq-bar"></span>
                <span className="nami-music-eq-bar"></span>
              </span>
            )}
          </span>
          <button className="nami-panel-close" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="nami-panel-body">
          {MUSIC_OPTIONS.map(option => (
            <label
              key={option.id}
              className={`nami-music-option ${selectedMusic === option.id ? 'selected' : ''}`}
              htmlFor={`music-${option.id}`}
            >
              <input
                type="radio"
                id={`music-${option.id}`}
                name="music"
                className="nami-music-radio"
                checked={selectedMusic === option.id}
                onChange={() => handleSelect(option.id)}
              />
              <span className="nami-music-label">
                {option.icon} {option.label}
              </span>
              {selectedMusic === option.id && option.id !== 'none' && (
                <span className="nami-music-now">Playing</span>
              )}
            </label>
          ))}

          {/* Volume Control */}
          <div className="nami-music-volume">
            <i className="bi bi-volume-down" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
            <input
              type="range"
              className="nami-volume-slider"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="Music volume"
            />
            <i className="bi bi-volume-up" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />
    </>
  );
}
