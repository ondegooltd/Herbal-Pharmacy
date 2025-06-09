import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function useScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip scroll on initial render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Add a small delay to ensure the page has loaded
    const timeoutId = setTimeout(() => {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        // Fallback to instant scroll if smooth scroll fails
        window.scrollTo(0, 0);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);
} 