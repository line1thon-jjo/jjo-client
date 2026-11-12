import { flushSync } from "react-dom";

const REVEAL_CLASS = "reveal-transition";

export function revealFrom(element, update) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reduceMotion || !element) {
    update();
    return;
  }

  const { left, top, width, height } = element.getBoundingClientRect();
  const root = document.documentElement;

  root.style.setProperty("--reveal-x", `${left + width / 2}px`);
  root.style.setProperty("--reveal-y", `${top + height / 2}px`);
  root.classList.add(REVEAL_CLASS);

  const transition = document.startViewTransition(() => flushSync(update));
  transition.finished.finally(() => root.classList.remove(REVEAL_CLASS));
}
