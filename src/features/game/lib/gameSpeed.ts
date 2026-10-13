/**
 * Sunflower Land Offline - Game Speed & Task Cap Utilities
 * Allows accelerating wait times (5x, 10x) and capping max wait duration to 20 minutes.
 */

// Default speed multiplier: 10x (as requested)
export const DEFAULT_SPEED_MULTIPLIER = 10;

// Maximum wait time cap: 20 minutes (1200 seconds)
export const MAX_WAIT_SECONDS = 20 * 60; // 1200 seconds

/**
 * Get current speed multiplier from localStorage or default to 10.
 */
export function getSpeedMultiplier(): number {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_SPEED_MULTIPLIER;
  }
  try {
    const saved = localStorage.getItem("sfl_game_speed");
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_SPEED_MULTIPLIER;
}

/**
 * Set current speed multiplier (e.g. 1, 5, 10).
 */
export function setSpeedMultiplier(multiplier: number): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem("sfl_game_speed", multiplier.toString());
      window.dispatchEvent(new Event("sfl_speed_changed"));
    } catch {
      // ignore
    }
  }
}

/**
 * Adjust seconds based on the speed multiplier and cap at MAX_WAIT_SECONDS (20 minutes).
 * Preserves 0 seconds (instant tasks).
 * Minimum for timed tasks is 2 seconds so animations still play smoothly.
 */
export function adjustSeconds(
  originalSeconds: number,
  multiplier = getSpeedMultiplier(),
): number {
  if (originalSeconds <= 0) return 0;
  const accelerated = Math.max(Math.round(originalSeconds / multiplier), 2);
  return Math.min(accelerated, MAX_WAIT_SECONDS);
}

/**
 * Adjust milliseconds based on the speed multiplier and cap at 20 minutes.
 */
export function adjustMs(
  originalMs: number,
  multiplier = getSpeedMultiplier(),
): number {
  if (originalMs <= 0) return 0;
  return adjustSeconds(Math.round(originalMs / 1000), multiplier) * 1000;
}
