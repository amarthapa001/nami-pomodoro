import React, { useState, useMemo } from 'react';
import { QUOTES } from '../../data/mockData';

/**
 * Quote — Motivational quote in handwritten style
 * Changes randomly on mount.
 */
export default function Quote() {
  const [index] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const quote = useMemo(() => QUOTES[index], [index]);

  return (
    <div className="nami-quote">
      <p className="nami-quote-text">{quote.text}</p>
      <p className="nami-quote-author">— {quote.author}</p>
    </div>
  );
}
