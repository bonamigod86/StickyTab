"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import type { Customer } from "@/lib/types";

interface Props {
  customers: Customer[];
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function NewTabModal({
  customers,
  onClose,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useT();

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, []);

  const suggestions = customers
    .filter((c) => c.name.toLowerCase().includes(name.toLowerCase()))
    .slice(0, 5);

  const submit = (value: string) => {
    if (!value.trim()) return;
    onCreate(value.trim());
  };

  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("newtab.dialogAria")}
        className="pop-in relative w-full max-w-md rounded-sm bg-yellow-200 px-6 pb-6 pt-8 shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-[2px] bg-amber-300/80 shadow-sm"
        />
        <h2 className="font-hand text-3xl font-bold text-yellow-950">
          {t("newtab.title")}
        </h2>
        <p className="mt-0.5 text-sm text-yellow-900/70">
          {t("newtab.subtitle")}
        </p>

        <label className="mt-4 block text-sm font-semibold text-yellow-950">
          {t("newtab.customerLabel")}
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(name);
              if (e.key === "Escape") onClose();
            }}
            placeholder={t("newtab.placeholder")}
            className="h-11 w-full rounded-sm border-2 border-yellow-900/20 bg-white/70 px-3 text-base text-stone-900 outline-none transition-colors placeholder:text-stone-500 focus:border-yellow-900/60"
          />
          <button
            type="button"
            onClick={() => submit(name)}
            disabled={!name.trim()}
            className="h-11 shrink-0 rounded-sm bg-yellow-500 px-4 text-sm font-bold text-yellow-950 shadow transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("newtab.stick")}
          </button>
        </div>

        {name.trim() && suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suggestions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => submit(c.name)}
                className="rounded-full border border-yellow-900/20 bg-white/60 px-3 py-1 text-sm text-yellow-950 transition-colors hover:bg-white"
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-yellow-900/60">
          {t("newtab.hint")}
        </p>
      </div>
    </div>
  );
}