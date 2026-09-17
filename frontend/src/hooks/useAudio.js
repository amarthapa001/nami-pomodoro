import { useRef, useCallback, useEffect } from 'react';

/**
 * useAudio — Sound effects via Web Audio API
 * 
 * Generates gentle tones programmatically (no external audio files).
 * - Completion chime: pleasant two-tone bell
 * - Tick sound: subtle click (optional)
 * 
 * Respects an enabled/disabled toggle from Settings.
 */
export function useAudio(enabled = true) {
  const audioCtxRef = useRef(null);

  // Lazily create AudioContext (must be created after user gesture)
  const getContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (autoplay policy)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  /**
   * Play a pleasant completion chime — two ascending tones
   */
  const playComplete = useCallback(() => {
    if (!enabled) return;

    try {
      const ctx = getContext();
      const now = ctx.currentTime;

      // First tone (C5 — 523 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.8);

      // Second tone (E5 — 659 Hz), slightly delayed
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.15);
      gain2.gain.setValueAtTime(0, now + 0.15);
      gain2.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 1.2);

      // Third tone (G5 — 784 Hz), for a nice triad
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(783.99, now + 0.3);
      gain3.gain.setValueAtTime(0, now + 0.3);
      gain3.gain.linearRampToValueAtTime(0.25, now + 0.35);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.3);
      osc3.stop(now + 1.5);
    } catch (e) {
      // AudioContext not available — fail silently
      console.warn('[Nami Audio] Could not play completion sound:', e);
    }
  }, [enabled, getContext]);

  /**
   * Play a subtle tick — tiny click sound
   */
  const playTick = useCallback(() => {
    if (!enabled) return;

    try {
      const ctx = getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('[Nami Audio] Could not play tick:', e);
    }
  }, [enabled, getContext]);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  return {
    playComplete,
    playTick,
  };
}
