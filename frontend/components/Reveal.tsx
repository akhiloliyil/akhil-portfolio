"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Scroll-triggered reveal. Wrap a block to fade+lift it into view once.
 * Set `stagger` to reveal direct children in sequence — those children must
 * be <Reveal.Item> elements. Honors prefers-reduced-motion (renders static).
 */
export default function Reveal({
  children,
  className,
  stagger = false,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  as?: "div" | "section" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      variants={stagger ? container : item}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Tag>
  );
}

Reveal.Item = function Item({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const Tag = motion[as];
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
};
