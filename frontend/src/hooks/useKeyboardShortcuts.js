import { useEffect } from 'react';

/**
 * useKeyboardShortcuts — Global keyboard shortcuts for Nami
 * 
 * Shortcuts:
 *   Space  — Start / Pause / Resume
 *   R      — Reset timer
 *   Escape — Close active panel
 *   1      — Switch to Focus mode
 *   2      — Switch to Short Break
 *   3      — Switch to Long Break
 * 
 * Disabled when user is typing in an input/textarea.
 */
export function useKeyboardShortcuts({
  isRunning,
  isPaused,
  isIdle,
  isComplete,
  onStart,
  onPause,
  onResume,
  onReset,
  onSwitchMode,
  onClosePanel,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      // Skip if user is typing in an input or textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      // Skip if modifier keys are held (allow browser shortcuts)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.code) {
        case 'Space': {
          e.preventDefault();
          if (isComplete) {
            onReset();
          } else if (isRunning) {
            onPause();
          } else if (isPaused) {
            onResume();
          } else if (isIdle) {
            onStart();
          }
          break;
        }

        case 'KeyR': {
          e.preventDefault();
          onReset();
          break;
        }

        case 'Escape': {
          e.preventDefault();
          onClosePanel();
          break;
        }

        case 'Digit1': {
          if (!isRunning) {
            e.preventDefault();
            onSwitchMode('focus');
          }
          break;
        }

        case 'Digit2': {
          if (!isRunning) {
            e.preventDefault();
            onSwitchMode('shortBreak');
          }
          break;
        }

        case 'Digit3': {
          if (!isRunning) {
            e.preventDefault();
            onSwitchMode('longBreak');
          }
          break;
        }

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isPaused, isIdle, isComplete, onStart, onPause, onResume, onReset, onSwitchMode, onClosePanel]);
}
