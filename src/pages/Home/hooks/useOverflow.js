import { useEffect, useRef, useState } from "react";

export function useOverflow() {
  const ref = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => setIsOverflowing(element.scrollHeight > element.clientHeight + 1);
    const observer = new ResizeObserver(measure);

    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    measure();

    return () => observer.disconnect();
  });

  return [ref, isOverflowing];
}
