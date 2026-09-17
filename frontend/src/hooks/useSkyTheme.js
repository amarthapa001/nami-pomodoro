import { useState, useEffect, useMemo } from 'react';

/**
 * useSkyTheme — Time-of-day dynamic sky gradient
 * 
 * Returns a CSS gradient string that changes based on the current hour:
 *   Night  (8pm – 5am):  Deep navy / current default
 *   Dawn   (5am – 8am):  Warm horizon with pink/orange
 *   Day    (8am – 5pm):  Lighter ocean blues
 *   Dusk   (5pm – 8pm):  Purple/orange sunset
 * 
 * Updates every 60 seconds.
 */

const SKY_THEMES = {
  night: {
    gradient: `linear-gradient(
      180deg,
      #060f1a 0%,
      #0B2136 25%,
      #102F4D 50%,
      #1a4a6e 75%,
      #1f5a80 100%
    )`,
    label: 'night',
  },
  dawn: {
    gradient: `linear-gradient(
      180deg,
      #1a1a2e 0%,
      #2d1b3d 15%,
      #4a2040 28%,
      #8b4060 40%,
      #c76a50 52%,
      #d4956a 62%,
      #1a4a6e 80%,
      #1f5a80 100%
    )`,
    label: 'dawn',
  },
  day: {
    gradient: `linear-gradient(
      180deg,
      #0e2a42 0%,
      #133654 20%,
      #184868 40%,
      #1d5a80 55%,
      #2570a0 70%,
      #1a4a6e 85%,
      #1f5a80 100%
    )`,
    label: 'day',
  },
  dusk: {
    gradient: `linear-gradient(
      180deg,
      #0f1b2e 0%,
      #1a2744 15%,
      #2d2b50 30%,
      #5c3a5e 44%,
      #9c5050 56%,
      #c47040 66%,
      #1a4a6e 80%,
      #1f5a80 100%
    )`,
    label: 'dusk',
  },
};

function getThemeForHour(hour) {
  if (hour >= 5 && hour < 8) return SKY_THEMES.dawn;
  if (hour >= 8 && hour < 17) return SKY_THEMES.day;
  if (hour >= 17 && hour < 20) return SKY_THEMES.dusk;
  return SKY_THEMES.night;
}

export function useSkyTheme() {
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const interval = setInterval(() => {
      setHour(new Date().getHours());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const theme = useMemo(() => getThemeForHour(hour), [hour]);

  return theme;
}
