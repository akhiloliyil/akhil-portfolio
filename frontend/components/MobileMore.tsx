"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Progressive disclosure for phones: shows the first `initial` items below
 * `lg`, with a "Show all" button for the rest. From `lg` up everything is
 * visible and the button is hidden. Pure CSS for the initial state, so the
 * server render is already correct (no layout jump on hydrate).
 */
export default function MobileMore({
  items,
  initial = 3,
  listClassName = "",
  itemClassName = "",
  noun = "items",
  ordered = false,
}: {
  items: ReactNode[];
  initial?: number;
  listClassName?: string;
  itemClassName?: string;
  noun?: string;
  ordered?: boolean;
}) {
  const [all, setAll] = useState(false);
  const id = useId();
  const List = ordered ? "ol" : "ul";
  const extra = items.length - initial;

  return (
    <>
      <List id={id} className={listClassName}>
        {items.map((item, i) => (
          <li key={i} className={`${itemClassName} ${!all && i >= initial ? "max-lg:hidden" : ""}`}>
            {item}
          </li>
        ))}
      </List>
      {extra > 0 && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          aria-controls={id}
          className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 font-mono text-xs uppercase tracking-wider text-ink active:bg-panel lg:hidden"
        >
          {all ? "Show less" : `Show all ${items.length} ${noun}`}
          <span aria-hidden="true" className={`transition-transform ${all ? "rotate-180" : ""}`}>↓</span>
        </button>
      )}
    </>
  );
}
