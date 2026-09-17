import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { TIMER_DEFAULTS, MODE_LABELS } from '../data/mockData';

/**
 * useTimer — Core Pomodoro timer hook
 * 
 * Manages countdown, mode switching, progress calculation,
 * and session tracking. Uses a single interval via useRef
 * to prevent multiple-interval bugs.
 */
export function useTimer(onSessionComplete) {
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [durations, setDurations] = useState({ ...TIMER_DEFAULTS });
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DEFAULTS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessionCounts, setSessionCounts] = useState({ focus: 0, shortBreak: 0, longBreak: 0 });

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const initialDurationRef = useRef(TIMER_DEFAULTS.focus);

  // Clear interval safely
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Progress calculation (0 to 1)
  const progress = useMemo(() => {
    const initial = initialDurationRef.current;
    if (initial <= 0) return 0;
    return Math.max(0, Math.min(1, (initial - timeRemaining) / initial));
  }, [timeRemaining]);

  // Format time as MM:SS
  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [timeRemaining]);

  // Handle timer completion
  const handleComplete = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setTimeRemaining(0);

    if (mode === 'focus') {
      const newCount = completedSessions + 1;
      setCompletedSessions(newCount);
      setSessionCounts(prev => ({ ...prev, focus: prev.focus + 1 }));
    } else if (mode === 'shortBreak') {
      setSessionCounts(prev => ({ ...prev, shortBreak: prev.shortBreak + 1 }));
    } else {
      setSessionCounts(prev => ({ ...prev, longBreak: prev.longBreak + 1 }));
    }

    if (onSessionComplete) {
      onSessionComplete({
        mode,
        sessionName,
        duration: initialDurationRef.current,
        completedAt: new Date().toISOString(),
      });
    }
  }, [clearTimer, mode, completedSessions, sessionName, onSessionComplete]);

  // Tick function — runs every second
  const tick = useCallback(() => {
    setTimeRemaining(prev => {
      if (prev <= 1) {
        // Will complete on next render cycle
        return 0;
      }
      return prev - 1;
    });
  }, []);

  // Detect completion via effect (avoids stale closure in interval)
  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      handleComplete();
    }
  }, [timeRemaining, isRunning, handleComplete]);

  // Start timer
  const start = useCallback(() => {
    if (isRunning) return;

    // If timer was reset / never started, record the initial duration
    if (timeRemaining === durations[mode]) {
      initialDurationRef.current = durations[mode];
    }

    clearTimer();
    setIsRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(tick, 1000);
  }, [isRunning, timeRemaining, durations, mode, clearTimer, tick]);

  // Pause timer
  const pause = useCallback(() => {
    if (!isRunning) return;
    clearTimer();
    setIsRunning(false);
  }, [isRunning, clearTimer]);

  // Resume timer (alias for start when paused)
  const resume = useCallback(() => {
    if (isRunning || timeRemaining <= 0) return;
    clearTimer();
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [isRunning, timeRemaining, clearTimer, tick]);

  // Reset timer
  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setTimeRemaining(durations[mode]);
    initialDurationRef.current = durations[mode];
  }, [clearTimer, durations, mode]);

  // Switch mode
  const switchMode = useCallback((newMode) => {
    if (newMode === mode) return;
    clearTimer();
    setIsRunning(false);
    setMode(newMode);
    setTimeRemaining(durations[newMode]);
    initialDurationRef.current = durations[newMode];
  }, [mode, clearTimer, durations]);

  // Update durations (from settings)
  const updateDurations = useCallback((newDurations) => {
    setDurations(prev => {
      const updated = { ...prev, ...newDurations };
      // If not running, also update the current time
      if (!isRunning) {
        const newTime = updated[mode];
        setTimeRemaining(newTime);
        initialDurationRef.current = newTime;
      }
      return updated;
    });
  }, [isRunning, mode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Determine button state
  const isPaused = !isRunning && timeRemaining < durations[mode] && timeRemaining > 0;
  const isComplete = timeRemaining === 0 && !isRunning;
  const isIdle = !isRunning && timeRemaining === durations[mode];

  // Update document title with timer state
  useEffect(() => {
    const modeLabel = MODE_LABELS[mode] || 'Focus';
    if (isRunning || isPaused) {
      document.title = `${formattedTime} — ${modeLabel} | Nami`;
    } else {
      document.title = 'Nami — Study Dashboard';
    }
    // Reset on unmount
    return () => {
      document.title = 'Nami — Study Dashboard';
    };
  }, [formattedTime, mode, isRunning, isPaused]);

  return {
    // State
    mode,
    timeRemaining,
    isRunning,
    isPaused,
    isComplete,
    isIdle,
    sessionName,
    completedSessions,
    sessionCounts,
    durations,

    // Computed
    progress,
    formattedTime,

    // Actions
    start,
    pause,
    resume,
    reset,
    switchMode,
    setSessionName,
    updateDurations,
  };
}
