import React from 'react';

/**
 * Ocean — Multi-layered SVG wave scene
 * Subtle drift animation when timer is running.
 * Occupies the lower portion of the viewport.
 */
export default function Ocean({ isRunning }) {
  return (
    <div className={`nami-ocean-scene ${isRunning ? 'ocean-alive' : ''}`} aria-hidden="true">
      {/* Background gradient */}
      <div className="nami-wave-bg"></div>

      {/* Wave Layer 1 — furthest, most transparent */}
      <div className="nami-wave-layer nami-wave-1">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
            fill="rgba(99, 169, 211, 0.3)"
          />
        </svg>
      </div>

      {/* Wave Layer 2 */}
      <div className="nami-wave-layer nami-wave-2">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,50 C180,80 360,20 540,50 C720,80 900,25 1080,50 C1260,75 1350,30 1440,50 L1440,100 L0,100 Z"
            fill="rgba(40, 125, 181, 0.25)"
          />
        </svg>
      </div>

      {/* Wave Layer 3 */}
      <div className="nami-wave-layer nami-wave-3">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C200,70 400,15 600,40 C800,65 1000,20 1200,40 C1320,55 1380,30 1440,40 L1440,90 L0,90 Z"
            fill="rgba(22, 59, 92, 0.5)"
          />
        </svg>
      </div>

      {/* Wave Layer 4 — foreground, most opaque */}
      <div className="nami-wave-layer nami-wave-4">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,35 C160,55 320,15 480,35 C640,55 800,18 960,35 C1120,52 1280,20 1440,35 L1440,80 L0,80 Z"
            fill="rgba(11, 33, 54, 0.7)"
          />
        </svg>
      </div>

      {/* Foam highlights on foreground wave */}
      <div className="nami-wave-layer nami-wave-4" style={{ opacity: 0.15 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,36 C160,54 320,16 480,36 C640,54 800,19 960,36 C1120,51 1280,21 1440,36 L1440,38 L1300,36 C1120,50 960,38 800,21 C640,52 480,38 320,18 C160,52 0,38 0,36 Z"
            fill="rgba(234, 247, 250, 0.6)"
          />
        </svg>
      </div>
    </div>
  );
}
