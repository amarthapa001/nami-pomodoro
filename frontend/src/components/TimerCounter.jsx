import React, { useState, useEffect, useRef } from "react";

const MODES = {
  focus: { label: "Focus", seconds: 25 * 60 },
  shortBreak: { label: "Short Break", seconds: 5 * 60 },
  longBreak: { label: "Long Break", seconds: 15 * 60 },
};

export function TimerCounter({ onSendTimerEvent, isConnected }) {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const totalSeconds = MODES[mode].seconds;

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle local ticking countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            onSendTimerEvent?.("timer.complete");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onSendTimerEvent]);

  function changeMode(newMode) {
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    setSecondsLeft(MODES[newMode].seconds);
    setIsRunning(false);
    if (newMode === "shortBreak" || newMode === "longBreak") {
      onSendTimerEvent?.("timer.break");
    } else {
      onSendTimerEvent?.("timer.reset");
    }
  }

  function handleStart() {
    setIsRunning(true);
    onSendTimerEvent?.("timer.start");
  }

  function handlePause() {
    setIsRunning(false);
    onSendTimerEvent?.("timer.pause");
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    onSendTimerEvent?.("timer.reset");
  }

  function handleComplete() {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    onSendTimerEvent?.("timer.complete");
  }

  // Format MM:SS
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  // SVG Progress calculation
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="timer-container">
      <div className="timer-modes">
        {Object.entries(MODES).map(([key, item]) => (
          <button
            key={key}
            type="button"
            className={`mode-btn ${mode === key ? "active" : ""}`}
            onClick={() => changeMode(key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="timer-display">
        <svg className="timer-svg" viewBox="0 0 260 260">
          <circle className="timer-bg-circle" cx="130" cy="130" r={radius} />
          <circle
            className="timer-progress-circle"
            cx="130"
            cy="130"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="timer-digits">
          <span className="time-text">{mins}:{secs}</span>
          <span className="timer-status-label">
            {isRunning ? "Running" : secondsLeft === totalSeconds ? "Ready" : "Paused"}
          </span>
        </div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button type="button" className="btn-primary" onClick={handleStart} disabled={!isConnected}>
            ▶ Start Timer
          </button>
        ) : (
          <button type="button" className="btn-outline-yellow" onClick={handlePause} disabled={!isConnected}>
            ⏸ Pause
          </button>
        )}
        <button type="button" onClick={handleReset} disabled={!isConnected}>
          🔄 Reset
        </button>
        <button type="button" onClick={handleComplete} disabled={!isConnected}>
          ✅ Complete Session
        </button>
      </div>
    </div>
  );
}

export default TimerCounter;
