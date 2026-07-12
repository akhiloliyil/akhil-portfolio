"use client";

import { ReactNode, useEffect, useState } from "react";

const inputCls =
  "w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-inkmuted/60 focus-ring";
const labelCls =
  "block font-mono text-[10px] uppercase tracking-wider text-inkmuted";

/**
 * A trigger button that asks for confirmation in a modal before firing
 * onConfirm. Used to guard every delete/remove action in the admin.
 */
export function ConfirmButton({
  onConfirm,
  className,
  ariaLabel,
  title = "Delete this item?",
  message,
  confirmLabel = "Delete",
  children,
}: {
  onConfirm: () => void;
  className?: string;
  ariaLabel?: string;
  title?: string;
  message?: string;
  confirmLabel?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <button
            aria-label="Cancel"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-sm rounded-md border border-line bg-panel p-6 shadow-2xl"
          >
            <h3 className="font-display text-lg font-semibold text-ink">
              {title}
            </h3>
            {message && (
              <p className="mt-2 text-sm leading-relaxed text-inkmuted">
                {message}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring rounded-sm border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-inkmuted hover:border-accent hover:text-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
                className="focus-ring rounded-sm bg-coral px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-white hover:opacity-90"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 ${inputCls}`}
      />
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`mt-1 resize-y ${inputCls}`}
      />
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 ${inputCls}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-accent"
      />
      <span className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">
        {label}
      </span>
    </label>
  );
}

/** Editable list of plain strings (bullets, tags, tools…). */
export function StringList({
  label,
  values,
  onChange,
  area = false,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  area?: boolean;
}) {
  const set = (i: number, v: string) =>
    onChange(values.map((x, idx) => (idx === i ? v : x)));
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="mt-1 space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            {area ? (
              <textarea
                value={v}
                onChange={(e) => set(i, e.target.value)}
                rows={2}
                className={`resize-y ${inputCls}`}
              />
            ) : (
              <input
                value={v}
                onChange={(e) => set(i, e.target.value)}
                className={inputCls}
              />
            )}
            <ConfirmButton
              onConfirm={() => onChange(values.filter((_, idx) => idx !== i))}
              className="shrink-0 rounded-sm border border-line px-2 font-mono text-xs text-inkmuted hover:border-coral hover:text-coral"
              ariaLabel="Remove"
              title="Remove this entry?"
              confirmLabel="Remove"
              message={v ? `“${v.slice(0, 80)}” will be removed.` : undefined}
            >
              ✕
            </ConfirmButton>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-inkmuted hover:border-accent hover:text-accent"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

/** Image field with upload + preview; also accepts a manual URL/path. */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.path);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="mt-1 flex items-start gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-16 w-16 shrink-0 rounded-sm border border-line object-cover"
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-sm border border-dashed border-line text-[10px] text-inkmuted">
            none
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... or https://..."
            className={inputCls}
          />
          <div className="flex items-center gap-2">
            <label className="cursor-pointer rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-inkmuted hover:border-accent hover:text-accent">
              {busy ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                  e.target.value = "";
                }}
              />
            </label>
            {err && <span className="text-xs text-coral">{err}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Generic editor for an array of records with add / remove / reorder. */
export function ArrayEditor<T>({
  items,
  onItems,
  blank,
  itemTitle,
  render,
}: {
  items: T[];
  onItems: (next: T[]) => void;
  blank: () => T;
  itemTitle: (item: T, i: number) => string;
  render: (item: T, set: (next: T) => void, i: number) => ReactNode;
}) {
  const update = (i: number, next: T) =>
    onItems(items.map((it, idx) => (idx === i ? next : it)));
  const remove = (i: number) => onItems(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onItems(copy);
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-md border border-line bg-paper p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
              {itemTitle(item, i)}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="rounded-sm border border-line px-2 py-0.5 text-xs text-inkmuted hover:border-accent hover:text-accent"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="rounded-sm border border-line px-2 py-0.5 text-xs text-inkmuted hover:border-accent hover:text-accent"
                aria-label="Move down"
              >
                ↓
              </button>
              <ConfirmButton
                onConfirm={() => remove(i)}
                className="rounded-sm border border-line px-2 py-0.5 text-xs text-inkmuted hover:border-coral hover:text-coral"
                ariaLabel="Delete item"
                title="Delete this item?"
                message={`“${itemTitle(item, i)}” will be permanently removed from this section.`}
              >
                ✕
              </ConfirmButton>
            </div>
          </div>
          <div className="space-y-3">{render(item, (next) => update(i, next), i)}</div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onItems([...items, blank()])}
        className="rounded-sm border border-accent px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-accent hover:bg-accent hover:text-white"
      >
        + Add item
      </button>
    </div>
  );
}

export const twoCol = "grid gap-3 sm:grid-cols-2";
