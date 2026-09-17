import { useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'nami.sessionHistory';

/**
 * useSessionHistory — Session history with localStorage persistence
 * 
 * Records completed study sessions, persists to localStorage,
 * calculates daily streak, and provides aggregated stats.
 * 
 * Designed to be swapped to Django API calls later:
 *   POST /api/sessions/
 *   GET  /api/sessions/
 *   GET  /api/sessions/stats/
 */

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.warn('[Nami] Could not save session history to localStorage');
  }
}

/**
 * Get the date string (YYYY-MM-DD) for a given timestamp
 */
function getDateKey(isoString) {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Calculate streak — consecutive days with at least 1 focus session
 */
function calculateStreak(sessions) {
  // Filter to focus sessions only
  const focusSessions = sessions.filter(s => s.mode === 'focus');
  if (focusSessions.length === 0) return 0;

  // Get unique dates with focus sessions (sorted descending)
  const dates = [...new Set(focusSessions.map(s => getDateKey(s.completedAt)))].sort().reverse();
  if (dates.length === 0) return 0;

  const today = getDateKey(new Date().toISOString());
  const yesterday = getDateKey(new Date(Date.now() - 86400000).toISOString());

  // Streak must include today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diffDays = Math.round((prevDate - currDate) / 86400000);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get relative day label
 */
function getDayLabel(dateKey) {
  const today = getDateKey(new Date().toISOString());
  const yesterday = getDateKey(new Date(Date.now() - 86400000).toISOString());

  if (dateKey === today) return 'Today';
  if (dateKey === yesterday) return 'Yesterday';

  const date = new Date(dateKey + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function useSessionHistory() {
  const [sessions, setSessions] = useState(loadHistory);

  /**
   * Add a completed session to history
   */
  const addSession = useCallback((sessionData) => {
    const session = {
      id: `s-${Date.now()}`,
      name: sessionData.sessionName || '',
      mode: sessionData.mode,
      duration: sessionData.duration,
      completedAt: sessionData.completedAt || new Date().toISOString(),
    };

    setSessions(prev => {
      const updated = [session, ...prev];
      // Keep max 200 sessions to avoid localStorage bloat
      const trimmed = updated.slice(0, 200);
      saveHistory(trimmed);
      return trimmed;
    });

    return session;
  }, []);

  /**
   * Clear all session history
   */
  const clearHistory = useCallback(() => {
    setSessions([]);
    saveHistory([]);
  }, []);

  /**
   * Sessions grouped by day for display
   */
  const groupedSessions = useMemo(() => {
    const groups = {};
    sessions.forEach(session => {
      const key = getDateKey(session.completedAt);
      if (!groups[key]) {
        groups[key] = { dateKey: key, label: getDayLabel(key), sessions: [] };
      }
      groups[key].sessions.push(session);
    });

    return Object.values(groups).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
  }, [sessions]);

  /**
   * Current daily streak
   */
  const streak = useMemo(() => calculateStreak(sessions), [sessions]);

  /**
   * Aggregate stats
   */
  const stats = useMemo(() => {
    const focusSessions = sessions.filter(s => s.mode === 'focus');
    const totalFocusMinutes = Math.round(
      focusSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60
    );

    return {
      totalSessions: focusSessions.length,
      totalFocusMinutes,
      streak,
    };
  }, [sessions, streak]);

  return {
    sessions,
    groupedSessions,
    streak,
    stats,
    addSession,
    clearHistory,
  };
}
