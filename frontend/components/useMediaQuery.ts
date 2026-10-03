"use client";

import { useEffect, useState } from "react";

/**
 * True when the media query matches. Always false on the server and on the
 * first client render, so desktop-only components (heavy canvases, orbits)
 * never mount — or download their assets — on phones.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const DESKTOP = "(min-width: 1024px)";
