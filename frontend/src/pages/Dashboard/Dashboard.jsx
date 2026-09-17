import React, { useState, useCallback, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { useAudio } from '../../hooks/useAudio';
import { useSessionHistory } from '../../hooks/useSessionHistory';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useSkyTheme } from '../../hooks/useSkyTheme';
import { MOCK_TASKS } from '../../data/mockData';

// Components
import Navbar from '../../components/Navbar/Navbar';
import TimerMode from '../../components/TimerMode/TimerMode';
import Timer from '../../components/Timer/Timer';
import SessionInput from '../../components/Session/SessionInput';
import SessionComplete from '../../components/Session/SessionComplete';
import Controls from '../../components/Controls/Controls';
import Quote from '../../components/Quote/Quote';
import Ocean from '../../components/Ocean/Ocean';
import Boat from '../../components/Boat/Boat';
import Streak from '../../components/Streak/Streak';
import Music from '../../components/Music/Music';
import Todo from '../../components/Todo/Todo';
import History from '../../components/History/History';
import Leaderboard from '../../components/Leaderboard/Leaderboard';
import Settings from '../../components/Settings/Settings';
import Profile from '../../components/Profile/Profile';

/**
 * Dashboard — Main logged-in experience
 * Full-viewport composition: Navbar → Mode → Timer → Quote → Controls → Ocean + Boat
 * Manages all top-level state coordination.
 */
export default function Dashboard() {
  // Panel state
  const [activePanel, setActivePanel] = useState(null);

  // Music state
  const [selectedMusic, setSelectedMusic] = useState('none');
  const [musicVolume, setMusicVolume] = useState(0.5);

  // Todo state
  const [tasks, setTasks] = useState(() => [...MOCK_TASKS]);

  // Settings state
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const [autoStartFocus, setAutoStartFocus] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Session completion state
  const [showComplete, setShowComplete] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState(null);

  // Hooks
  const audio = useAudio(soundEnabled);
  const sessionHistory = useSessionHistory();
  const skyTheme = useSkyTheme();

  // Timer hook
  const handleSessionComplete = useCallback((sessionData) => {
    setCompletedSessionData(sessionData);
    setShowComplete(true);

    // Play completion chime
    audio.playComplete();

    // Record session in history
    sessionHistory.addSession(sessionData);

    // Send browser notification
    if (Notification.permission === 'granted') {
      const isFocus = sessionData.mode === 'focus';
      new Notification(
        isFocus ? 'Voyage complete!' : 'Break over!',
        {
          body: sessionData.sessionName
            ? `${sessionData.sessionName} — ${Math.round(sessionData.duration / 60)} minutes`
            : `${Math.round(sessionData.duration / 60)} minutes ${isFocus ? 'focused' : 'rested'}`,
          icon: '/favicon.ico',
          silent: true, // We play our own sound
        }
      );
    }
  }, [audio, sessionHistory]);

  const timer = useTimer(handleSessionComplete);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      // Request after a slight delay so it doesn't feel intrusive
      const timeout = setTimeout(() => {
        Notification.requestPermission();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Panel toggle
  const togglePanel = useCallback((panelId) => {
    setActivePanel(prev => prev === panelId ? null : panelId);
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    isRunning: timer.isRunning,
    isPaused: timer.isPaused,
    isIdle: timer.isIdle,
    isComplete: timer.isComplete,
    onStart: timer.start,
    onPause: timer.pause,
    onResume: timer.resume,
    onReset: timer.reset,
    onSwitchMode: timer.switchMode,
    onClosePanel: closePanel,
  });

  // Todo handlers
  const handleAddTask = useCallback((title) => {
    setTasks(prev => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleToggleTask = useCallback((taskId) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    );
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  // Session completion handlers
  const handleStartBreak = useCallback(() => {
    setShowComplete(false);
    // Determine break type: long break every 4 focus sessions
    const breakMode = timer.completedSessions > 0 && timer.completedSessions % 4 === 0
      ? 'longBreak'
      : 'shortBreak';
    timer.switchMode(breakMode);

    if (autoStartBreak) {
      // Small delay to allow mode switch to render
      setTimeout(() => timer.start(), 100);
    }
  }, [timer, autoStartBreak]);

  const handleContinueFocus = useCallback(() => {
    setShowComplete(false);
    if (timer.mode !== 'focus') {
      timer.switchMode('focus');
    } else {
      timer.reset();
    }

    if (autoStartFocus) {
      setTimeout(() => timer.start(), 100);
    }
  }, [timer, autoStartFocus]);

  const handleDismissComplete = useCallback(() => {
    setShowComplete(false);
    timer.reset();
  }, [timer]);

  // Is music currently playing?
  const isMusicPlaying = selectedMusic !== 'none';

  return (
    <div
      className="nami-dashboard"
      style={{ background: skyTheme.gradient }}
    >
      {/* Top Navigation */}
      <Navbar
        activePanel={activePanel}
        onTogglePanel={togglePanel}
        isMusicPlaying={isMusicPlaying}
      />

      {/* Main Content */}
      <main className="nami-main">
        {/* Mode Switcher */}
        <TimerMode
          mode={timer.mode}
          sessionCounts={timer.sessionCounts}
          onSwitchMode={timer.switchMode}
          disabled={timer.isRunning}
        />

        {/* Timer Display */}
        <Timer
          formattedTime={timer.formattedTime}
          mode={timer.mode}
          sessionName={timer.sessionName}
          isRunning={timer.isRunning}
        />

        {/* Session Name Input (shown when idle) */}
        <SessionInput
          sessionName={timer.sessionName}
          onSessionNameChange={timer.setSessionName}
          isIdle={timer.isIdle}
        />

        {/* Motivational Quote */}
        <Quote />

        {/* Timer Controls + Streak Badge */}
        <div className="nami-controls-area">
          <Controls
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
            isIdle={timer.isIdle}
            isComplete={timer.isComplete}
            onStart={timer.start}
            onPause={timer.pause}
            onResume={timer.resume}
            onReset={timer.reset}
          />
          <Streak streak={sessionHistory.streak} />
        </div>
      </main>

      {/* Ocean Scene (absolute positioned at bottom) */}
      <Ocean isRunning={timer.isRunning} />

      {/* Boat (progress-driven position) */}
      <Boat progress={timer.progress} isRunning={timer.isRunning} />

      {/* Utility Panels */}
      {activePanel === 'music' && (
        <Music
          selectedMusic={selectedMusic}
          onSelectMusic={setSelectedMusic}
          volume={musicVolume}
          onVolumeChange={setMusicVolume}
          onClose={closePanel}
        />
      )}

      {activePanel === 'todo' && (
        <Todo
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onClose={closePanel}
        />
      )}

      {activePanel === 'history' && (
        <History
          groupedSessions={sessionHistory.groupedSessions}
          stats={sessionHistory.stats}
          onClearHistory={sessionHistory.clearHistory}
          onClose={closePanel}
        />
      )}

      {activePanel === 'leaderboard' && (
        <Leaderboard onClose={closePanel} />
      )}

      {activePanel === 'settings' && (
        <Settings
          durations={timer.durations}
          onUpdateDurations={timer.updateDurations}
          autoStartBreak={autoStartBreak}
          onToggleAutoStartBreak={() => setAutoStartBreak(p => !p)}
          autoStartFocus={autoStartFocus}
          onToggleAutoStartFocus={() => setAutoStartFocus(p => !p)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(p => !p)}
          onClose={closePanel}
        />
      )}

      {activePanel === 'profile' && (
        <Profile
          stats={sessionHistory.stats}
          streak={sessionHistory.streak}
          onClose={closePanel}
        />
      )}

      {/* Session Complete Overlay */}
      {showComplete && completedSessionData && (
        <SessionComplete
          mode={completedSessionData.mode}
          sessionName={completedSessionData.sessionName}
          duration={completedSessionData.duration}
          onStartBreak={handleStartBreak}
          onContinue={handleContinueFocus}
          onDismiss={handleDismissComplete}
        />
      )}
    </div>
  );
}
