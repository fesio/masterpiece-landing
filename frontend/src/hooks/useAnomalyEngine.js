import { useEffect } from 'react';

/**
 * Fesiomatyzacja: Anomaly Engine Hook
 * Simulates high-frequency system tension using Poisson distribution (lambda = 0.05).
 */
export function useAnomalyEngine(lambda = 0.05) {
  useEffect(() => {
    const interval = setInterval(() => {
      // Probability of event in 1s window: 1 - e^-lambda
      if (Math.random() < (1 - Math.exp(-lambda))) {
        const modules = document.querySelectorAll('.dash-module');
        if (!modules.length) return;
        
        const target = modules[Math.floor(Math.random() * modules.length)];
        
        // Critical Anomaly Pulse
        target.classList.add('border-red-500/80', 'bg-red-900/10');
        
        setTimeout(() => {
          target.classList.remove('border-red-500/80', 'bg-red-900/10');
        }, 150);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lambda]);
}
