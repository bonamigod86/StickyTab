"use client";

import { useState } from "react";
import NewTabModal from "./NewTabModal";
import StickyNoteCard from "./StickyNoteCard";
import TicketDrawer from "./TicketDrawer";
import { useNow } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { TabStatus } from "@/lib/types";
import { cur, noteTotal, tiltFor, uid } from "@/lib/utils";

type Filter = TabStatus | "all";

const FILTERS: {
  value: Filter;
  dot: string;
  labelKey: "board.filter.all" | "board.filter.active" | "board.filter.ready" | "board.filter.attention";
}[] = [
  { value: "all", dot: "", labelKey: "board.filter.all" },
  { value: "active", dot: "🟡", labelKey: "board.filter.active" },
  { value: "ready", dot: "🟢", labelKey: "board.filter.ready" },
  { value: "attention", dot: "🔴", labelKey: "board.filter.attention" },
];

export default function Board() {
  const { state, openNote } = useStore();
  const { t } = useT();
  const now = useNow(30_000);

  const [filter, setFilter] = useState<Filter>("all");
  const [newOpen, setNewOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const shown = state.notes.filter((n) => filter === "all" || n.status === filter);

  const countBy = (s: TabStatus) =>
    state.notes.filter((n) => n.status === s).length;

  const handleCreate = (name: string) => {
    const id = uid();
    openNote(id, name);
    setNewOpen(false);
    setActiveId(id);
  };

  const handleClosed = (id: string) => {
    const total = noteTotal(state.notes.find((n) => n.id === id) ?? { items: [] });
    setActiveId(null);
    setToast(t("board.toast.closed", { total: cur(total) }));
    window.setTimeout(() => setToast(null), 3500);
  };

  const handlePended = () => {
    setActiveId(null);
    setToast(t("board.toast.pended"));
    window.setTimeout(() => setToast(null), 3500);
  };

  const activeNote = state.notes.find((n) => n.id === activeId);

  return (
    <div className="corkboard flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-hand text-5xl font-bold text-amber-50 drop-shadow-sm">
              {t("board.title")}
            </h1>
            <p className="mt-1 text-sm text-amber-100/80">
              {state.notes.length === 1
                ? t("board.subtitleOne", { count: state.notes.length })
                : t("board.subtitleMany", { count: state.notes.length })}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewOpen(true)}
            className="group relative inline-flex h-14 items-center gap-2 rounded-sm bg-yellow-300 px-6 py-3 text-lg font-bold text-yellow-950 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.6)] ring-1 ring-black/10 rotate-[-1deg] transition-all hover:rotate-0 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-8px_rgba(0,0,0,0.65)]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-yellow-500 text-white shadow-inner">
              +
            </span>
            {t("board.newTab")}
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            const count =
              f.value === "all" ? state.notes.length : countBy(f.value);
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-amber-50 text-amber-950 shadow"
                    : "bg-black/25 text-amber-50/80 hover:bg-black/30"
                }`}
              >
                {f.dot && <span aria-hidden>{f.dot}</span>}
                {t(f.labelKey)}
                <span
                  className={`rounded-full px-1.5 text-xs font-bold ${
                    active ? "bg-amber-200 text-amber-900" : "bg-black/30 text-white"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <div className="fade-in mx-auto mt-16 max-w-md rounded-sm border-2 border-dashed border-amber-100/40 px-8 py-12 text-center">
            <p className="text-5xl" aria-hidden>
              🗒️
            </p>
            <p className="font-hand mt-3 text-3xl font-bold text-amber-50">
              {t("board.empty.title")}
            </p>
            <p className="mt-1 text-sm text-amber-100/70">
              {filter === "all"
                ? t("board.empty.all")
                : t("board.empty.filtered", {
                    filter: t(
                      FILTERS.find((f) => f.value === filter)?.labelKey ?? "board.filter.all",
                    ),
                  })}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-7 sm:gap-8">
            {shown.map((note) => (
              <StickyNoteCard
                key={note.id}
                note={note}
                tilt={tiltFor(note.id)}
                now={now}
                onOpen={setActiveId}
              />
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="pop-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}

      {newOpen && (
        <NewTabModal
          customers={state.customers}
          onClose={() => setNewOpen(false)}
          onCreate={handleCreate}
        />
      )}

      <TicketDrawer
        note={activeNote}
        now={now}
        onClose={() => setActiveId(null)}
        onClosed={handleClosed}
        onPended={handlePended}
      />
    </div>
  );
}