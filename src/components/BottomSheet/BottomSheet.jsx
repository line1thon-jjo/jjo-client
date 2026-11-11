import { useEffect, useId, useRef, useState } from "react";

import "./BottomSheet.css";

export default function BottomSheet({ open, onClose, title, children, footer }) {
  const [isRendered, setIsRendered] = useState(open);
  const panel = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  if (open && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    panel.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [open]);

  const handleAnimationEnd = (event) => {
    if (!open && event.target === panel.current) {
      setIsRendered(false);
    }
  };

  if (!isRendered) return null;

  return (
    <div className="bottom-sheet" data-state={open ? "open" : "closed"}>
      <div className="bottom-sheet__overlay" onClick={onClose} aria-hidden="true" />

      <section
        ref={panel}
        className="bottom-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="bottom-sheet__handle" aria-hidden="true" />

        <h2 id={titleId} className="bottom-sheet__title font-18-semibold">
          {title}
        </h2>

        <div className="bottom-sheet__body">{children}</div>

        {footer && <div className="bottom-sheet__footer">{footer}</div>}
      </section>
    </div>
  );
}
