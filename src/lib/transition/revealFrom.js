const REVEAL_CLASS = "reveal-transition";
const COLLAPSE_CLASS = "collapse-transition";
const RENDER_TIMEOUT_MS = 600;

function canAnimate() {
  return Boolean(document.startViewTransition) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setOrigin(element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  const root = document.documentElement;

  root.style.setProperty("--reveal-x", `${left + width / 2}px`);
  root.style.setProperty("--reveal-y", `${top + height / 2}px`);
}

function waitForElement(selector) {
  return new Promise((resolve) => {
    const found = document.querySelector(selector);
    if (found) {
      resolve(found);
      return;
    }

    const finish = (element) => {
      observer.disconnect();
      clearTimeout(timer);
      resolve(element);
    };
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) finish(element);
    });
    const timer = setTimeout(() => finish(null), RENDER_TIMEOUT_MS);

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function run(className, update) {
  const root = document.documentElement;
  root.classList.add(className);

  const transition = document.startViewTransition(update);
  transition.finished.finally(() => root.classList.remove(className));
}

export function revealFrom(element, update, readySelector) {
  if (!canAnimate() || !element) {
    update();
    return;
  }

  setOrigin(element);
  run(REVEAL_CLASS, async () => {
    update();
    await waitForElement(readySelector);
  });
}

export function collapseTo(selector, update) {
  if (!canAnimate()) {
    update();
    return;
  }

  run(COLLAPSE_CLASS, async () => {
    update();
    const target = await waitForElement(selector);
    if (target) setOrigin(target);
    else document.documentElement.classList.remove(COLLAPSE_CLASS);
  });
}
