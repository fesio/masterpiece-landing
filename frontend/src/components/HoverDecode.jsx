import React, { useState, useEffect } from 'react';

/**
 * Fesiomatyzacja: HoverDecode
 * Micro-investment component for cognitively weighted UI.
 */
export const HoverDecode = ({ text }) => {
  const [display, setDisplay] = useState(text.replace(/[a-zA-Z0-9]/g, '█'));
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!hover) {
      setDisplay(text.replace(/[a-zA-Z0-9]/g, '█'));
      return;
    }

    let i = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
    const interval = setInterval(() => {
      setDisplay(prev => 
        text.split('').map((char, idx) => {
          if (idx < i) return text[idx];
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      
      if (i >= text.length) clearInterval(interval);
      i += 0.33;
    }, 30);

    return () => clearInterval(interval);
  }, [hover, text]);

  return (
    <span 
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)} 
      className="font-mono text-[11px] leading-relaxed text-[#FFFFFF]/70 cursor-crosshair tracking-tight break-words"
    >
      {display}
    </span>
  );
};
