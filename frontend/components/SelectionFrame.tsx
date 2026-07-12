import { ReactNode } from "react";

export default function SelectionFrame({
  children,
  tag,
  className = "",
  active = false,
}: {
  children: ReactNode;
  tag?: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`handle-frame ${active ? "is-active" : ""} ${className}`}
    >
      {tag && (
        <span className="tag-label pointer-events-none absolute -top-6 left-0 font-mono text-[10px] uppercase tracking-wider text-accent">
          {tag}
        </span>
      )}
      <span className="h-tl" />
      <span className="h-tr" />
      <span className="h-bl" />
      <span className="h-br" />
      {children}
    </div>
  );
}
