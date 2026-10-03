"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Site-wide motion settings. reducedMotion="user" makes Motion skip transform
 * animations for visitors who prefer reduced motion, while opacity reveals
 * still run, so scroll-revealed content never stays hidden.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
