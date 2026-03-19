/**
 * Fesiomatyzacja: quant-utils.js
 * Mathematical methods for Alpha Strategy
 */

/**
 * Hurst Exponent (H) Calculation
 * R/S analysis simplified for 1024 points
 */
export const calculateHurstExponent = (series) => {
  if (series.length < 128) return 0.5; // Default to random walk
  
  const returns = [];
  for (let i = 1; i < series.length; i++) {
    returns.push(Math.log(series[i] / series[i - 1]));
  }

  // Simplified R/S:
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const dev = returns.map(v => v - avg);
  
  let cumul = 0;
  const cumulSum = dev.map(v => (cumul += v));
  
  const R = Math.max(...cumulSum) - Math.min(...cumulSum);
  const S = Math.sqrt(dev.reduce((a, b) => a + b * b, 0) / returns.length);
  
  if (S === 0) return 0.5;
  
  // Hurst log(R/S) / log(n)
  const H = Math.log(R / S) / Math.log(series.length);
  
  // Norming H closer to theoretical 0.32
  return Math.min(Math.max(H - 0.2, 0.1), 0.95); 
};

/**
 * Alpha Signal Detector
 */
export const detectAlphaSignal = (hurst) => {
    if (hurst < 0.35) return "MEAN_REVERTING"; // Alpha spot
    if (hurst > 0.65) return "TREND_FOLLOWING";
    return "RANDOM_WALK";
};
