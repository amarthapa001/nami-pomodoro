import React, { useMemo } from 'react';

/**
 * Boat — Simple 2D sailing boat SVG
 * Position is controlled by timer progress (0 to 1).
 * Moves from left (8%) to right (88%) of the viewport.
 * Has a subtle bob animation only when sailing (timer running).
 */
export default function Boat({ progress, isRunning }) {
  const leftPercent = useMemo(() => {
    return 8 + progress * 80;
  }, [progress]);

  return (
    <div className="nami-boat-container" aria-hidden="true">
      <div
        className={`nami-boat ${isRunning ? 'sailing' : ''}`}
        style={{ left: `${leftPercent}%` }}
      >
        <svg
          viewBox="0 0 120 100"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Sailing boat"
        >
          {/* Mast */}
          <line x1="55" y1="10" x2="55" y2="70" stroke="#8B6C4F" strokeWidth="2.5" />

          {/* Main sail */}
          <path d="M57,14 L95,55 L57,65 Z" fill="#F0F7FA" opacity="0.92" />
          {/* Sail accent stripe */}
          <path d="M57,30 L82,50 L57,56 Z" fill="#9DD5E8" opacity="0.35" />

          {/* Jib sail (front) */}
          <path d="M53,18 L25,55 L53,60 Z" fill="#EAF7FA" opacity="0.85" />

          {/* Hull */}
          <path d="M20,70 L100,70 L90,88 L30,88 Z" fill="#287DB5" />
          {/* Hull highlight */}
          <path d="M25,70 L95,70 L90,78 L30,78 Z" fill="#3A8FC4" opacity="0.6" />
          {/* Hull bottom trim */}
          <path d="M30,82 L90,82 L88,88 L32,88 Z" fill="#1A5F8A" />

          {/* Small flag */}
          <path d="M55,10 L55,5 L65,7.5 L55,10 Z" fill="#E85D5D" />

          {/* Window dots on hull */}
          <circle cx="45" cy="76" r="2" fill="rgba(234, 247, 250, 0.4)" />
          <circle cx="55" cy="76" r="2" fill="rgba(234, 247, 250, 0.4)" />
          <circle cx="65" cy="76" r="2" fill="rgba(234, 247, 250, 0.4)" />
          <circle cx="75" cy="76" r="2" fill="rgba(234, 247, 250, 0.4)" />
        </svg>
      </div>
    </div>
  );
}
