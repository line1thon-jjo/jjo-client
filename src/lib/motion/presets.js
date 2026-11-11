// Mirrors the CSS motion tokens in index.css so CSS transitions and motion feel the same.

export const DURATION = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
};

export const EASE = {
  standard: [0.2, 0, 0, 1],
  spring: [0.34, 1.56, 0.64, 1],
};

export const TRANSITION = {
  fast: { duration: DURATION.fast, ease: EASE.standard },
  base: { duration: DURATION.base, ease: EASE.standard },
  slow: { duration: DURATION.slow, ease: EASE.standard },
  spring: { type: "spring", stiffness: 260, damping: 18 },
};

// Variants use two states so any component can drive them with animate={active ? "on" : "off"}.

export const fadeUp = {
  off: { opacity: 0, y: 8, transition: TRANSITION.base },
  on: (delay = 0) => ({ opacity: 1, y: 0, transition: { ...TRANSITION.slow, duration: 0.48, delay } }),
};

export const drawX = {
  off: { scaleX: 0, transition: TRANSITION.base },
  on: (delay = 0) => ({ scaleX: 1, transition: { ...TRANSITION.slow, duration: 0.56, delay } }),
};

export const stretchX = (amount) => ({
  off: { scaleX: 1, transition: TRANSITION.base },
  on: (delay = 0) => ({ scaleX: amount, transition: { ...TRANSITION.spring, delay } }),
});

export const growWidth = (width) => ({
  off: { width: 0, transition: TRANSITION.base },
  on: (delay = 0) => ({ width, transition: { ...TRANSITION.slow, duration: 0.52, delay } }),
});

export const pop = {
  off: { scale: 0.92, transition: TRANSITION.slow },
  on: { scale: 1, transition: { ...TRANSITION.slow, duration: 0.64 } },
};

export function activeState(active) {
  return active ? "on" : "off";
}
