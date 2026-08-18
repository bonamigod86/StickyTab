"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { STATUS_INFO } from "@/lib/theme";
import type { StickyTabNote, TabStatus } from "@/lib/types";
import {
  cur,
  formatClock,
  formatElapsed,
  noteTotal,
  productById,
} from "@/lib/utils";

const STATUS_ORDER: TabStatus[] = ["active", "ready", "attention"];

interface Props {
  note: StickyTabNote | undefined;
  now: number;
  onClose: () => void;
  onClosed: (id: string) => void;
  onPended: (id: string) => void;
}

export default function TicketDrawer({ note, now, onClose, onClosed, onPended }: Props) {
  const { state, renameNote, setStatus, addItem, decrementItem, closeNote, pendTab, deleteNote } =
    useStore();
  const { t } = useT();
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [confirmCheckout, setConfirmCheckout] = useState(false);
  const [confirmPendurar, setConfirmPendurar] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!note) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [note, onClose]);

  if (!note) return null;

  const total = noteTotal(note);

  const q = search.trim().toLowerCase();
  const matches = q
    ? state.products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.emoji === search.trim(),
      )
    : state.products;
  const topMatch = matches[0];

  const itemMeta = (productId: string) =>
    productById(state.products, productId);

  const handleCheckout = () => {
    if (!confirmCheckout) {
      setConfirmDiscard(false);
      setConfirmPendurar(false);
      setConfirmCheckout(true);
      window.setTimeout(() => setConfirmCheckout(false), 3000);
      return;
    }
    closeNote(note.id);
    onClosed(note.id);
  };

  const handlePendurar = () => {
    if (!confirmPendurar) {
      setConfirmDiscard(false);
      setConfirmCheckout(false);
      setConfirmPendurar(true);
      window.setTimeout(() => setConfirmPendurar(false), 3000);
      return;
    }
    pendTab(note.id);
    onPended(note.id);
  };

  const handleDiscard = () => {
    if (!confirmDiscard) {
      setConfirmCheckout(false);
      setConfirmPendurar(false);
      setConfirmDiscard(true);
      window.setTimeout(() => setConfirmDiscard(false), 2500);
      return;
    }
    deleteNote(note.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fade-in absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("ticket.dialogAria", { name: note.customerName })}
        className="slide-in-right relative flex h-full w-full max-w-xl flex-col bg-[#fffdf6] shadow-2xl"
      >
        <div className="paper-lines border-b border-sky-900/20 px-6 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                {t("ticket.customer")}
              </label>
              <input
                value={note.customerName}
                onChange={(e) => renameNote(note.id, e.target.value)}
                aria-label={t("ticket.customer")}
                className="font-hand w-full bg-transparent text-4xl font-bold leading-tight text-stone-900 outline-none"
              />
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-stone-700">
                🕓 {formatClock(note.openedAt)} · {formatElapsed(note.openedAt, now)}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("ticket.closePanel")}
                title={t("ticket.closePanel")}
                className="grid h-8 w-8 place-items-center rounded-full border border-stone-300 bg-white/70 text-lg text-stone-500 transition-colors hover:bg-white hover:text-stone-900"
              >
                ×
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-500">{t("ticket.status")}</span>
            {STATUS_ORDER.map((s) => {
              const meta = STATUS_INFO[s];
              const isActive = note.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(note.id, s)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                    isActive
                      ? meta.pill
                      : "border-stone-300 bg-white/60 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  <span aria-hidden>{meta.dot}</span>
                  {t(meta.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-500">
            {t("ticket.items", { count: note.items.length })}
          </h3>

          {note.items.length === 0 ? (
            <p className="mb-4 rounded-sm border-2 border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
              {t("ticket.emptyItems")}
            </p>
          ) : (
            <ul className="mb-5 divide-y divide-stone-900/5 border-t border-stone-900/5">
              {note.items.map((item) => {
                const product = itemMeta(item.productId);
                const subtotal = item.quantity * item.unitPrice;
                return (
                  <li
                    key={item.productId}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-stone-100 text-lg">
                      {product?.emoji ?? "🧾"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-stone-900">
                        {product?.name ?? item.productId}
                      </p>
                      <p className="text-xs text-stone-500">
                        {cur(item.unitPrice)} {t("ticket.each")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrementItem(note.id, item.productId)}
                        aria-label={t("ticket.decrease", { name: product?.name ?? t("ticket.item") })}
                        className="grid h-7 w-7 place-items-center rounded-full bg-stone-200 font-bold text-stone-800 transition-colors hover:bg-stone-300"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem(note.id, item.productId)}
                        aria-label={t("ticket.increase", { name: product?.name ?? t("ticket.item") })}
                        className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 font-bold text-white transition-colors hover:bg-emerald-600"
                      >
                        +
                      </button>
                    </div>
                    <span className="w-16 text-right text-sm font-bold tabular-nums text-stone-900">
                      {cur(subtotal)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-500">
            {t("ticket.addFast")}
          </h3>

          <div className="mb-3 flex items-center gap-2">
            <div className="relative flex-1">
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              >
                🔎
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && topMatch) addItem(note.id, topMatch.id);
                  if (e.key === "Escape") setSearch("");
                }}
                placeholder={t("ticket.searchPlaceholder")}
                aria-label={t("ticket.searchAria")}
                className="h-10 w-full rounded-sm border border-stone-300 bg-white pl-9 pr-8 text-sm outline-none transition-colors focus:border-stone-900"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label={t("ticket.clearSearch")}
                  className="absolute right-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-stone-200 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-300"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {search.trim() && topMatch && (
            <div className="mb-3 flex items-center gap-3 rounded-sm border border-emerald-500/40 bg-emerald-50 px-3 py-2">
              <span className="text-xl" aria-hidden>
                {topMatch.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-stone-900">
                  {topMatch.name}
                </p>
                <p className="text-xs text-stone-500">{cur(topMatch.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => addItem(note.id, topMatch.id)}
                className="h-8 shrink-0 rounded-full bg-stone-900 px-3 text-xs font-bold text-white transition-colors hover:bg-stone-800"
              >
                {t("ticket.add")}
              </button>
            </div>
          )}

          {matches.length === 0 ? (
            <p className="rounded-sm border-2 border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
              {t("ticket.noMatch", { search: search.trim() })}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {matches.map((p) => {
                const qty =
                  note.items.find((it) => it.productId === p.id)?.quantity ?? 0;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addItem(note.id, p.id)}
                    className={`relative flex flex-col items-start gap-0.5 rounded-sm border p-2.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow ${
                      qty > 0
                        ? "border-yellow-500/60 bg-yellow-100"
                        : "border-stone-300 bg-white hover:border-stone-400"
                    }`}
                  >
                    {qty > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-yellow-500 px-1 text-[11px] font-bold text-white shadow">
                        {qty}
                      </span>
                    )}
                    <span className="text-xl leading-none" aria-hidden>
                      {p.emoji}
                    </span>
                    <span className="line-clamp-1 text-xs font-semibold text-stone-800">
                      {p.name}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500">
                      {cur(p.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {confirmCheckout && (
          <div className="fade-in border-t border-emerald-200 bg-emerald-50 px-6 py-2.5 text-xs font-semibold text-emerald-800">
            {t("ticket.confirmCheckout")}
          </div>
        )}

        {confirmPendurar && (
          <div className="fade-in border-t border-amber-200 bg-amber-50 px-6 py-2.5 text-xs font-semibold text-amber-800">
            {t("ticket.confirmPendurar")}
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-300 bg-white px-6 py-4 shadow-[0_-8px_20px_-12px_rgba(0,0,0,0.25)]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              {t("ticket.runningTotal")}
            </p>
            <p className="font-hand text-3xl font-bold leading-none text-stone-900">
              {cur(total)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              title={t("ticket.closeAutoSave")}
              className="h-11 rounded-sm px-4 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-100"
            >
              {t("ticket.close")}
            </button>
            <span aria-hidden className="mx-1.5 h-7 w-px bg-stone-200" />
            <button
              type="button"
              onClick={handleDiscard}
              className={`h-11 rounded-sm px-4 text-sm font-bold transition-colors ${
                confirmDiscard
                  ? "bg-red-600 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {confirmDiscard ? t("ticket.confirmDiscard") : t("ticket.discard")}
            </button>
            <button
              type="button"
              onClick={handlePendurar}
              disabled={note.items.length === 0}
              title={t("ticket.pendurarTitle")}
              className={`h-11 rounded-sm px-4 text-sm font-bold shadow transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                confirmPendurar
                  ? "bg-amber-500 text-amber-950 ring-2 ring-amber-300"
                  : "bg-amber-200 text-amber-900 hover:bg-amber-300"
              }`}
            >
              {confirmPendurar
                ? t("ticket.confirmBtn", { total: cur(total) }) + " ⏳"
                : t("ticket.pendurar") + " ⏳"}
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={note.items.length === 0}
              className={`h-11 rounded-sm px-5 text-sm font-bold shadow transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                confirmCheckout
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                  : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              {confirmCheckout
                ? t("ticket.confirmBtn", { total: cur(total) }) + " ✓"
                : t("ticket.checkout")}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}