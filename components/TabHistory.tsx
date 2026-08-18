"use client";

import { useMemo, useState } from "react";
import { clearStoredState, useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { NOTE_COLORS } from "@/lib/theme";
import type { ClosedTab } from "@/lib/types";
import {
  cur,
  dayLabel,
  formatClock,
  formatElapsed,
  noteTotal,
  productById,
} from "@/lib/utils";

type GroupMode = "day" | "customer" | "flat";
type PaymentFilter = "all" | "paid" | "pending";

const GROUP_MODES: {
  value: GroupMode;
  dot: string;
  labelKey: "history.group.day" | "history.group.customer" | "history.group.flat";
}[] = [
  { value: "day", dot: "🗓️", labelKey: "history.group.day" },
  { value: "customer", dot: "👤", labelKey: "history.group.customer" },
  { value: "flat", dot: "📄", labelKey: "history.group.flat" },
];

const PAYMENT_FILTERS: {
  value: PaymentFilter;
  dot: string;
  labelKey: "history.payment.all" | "history.payment.paid" | "history.payment.pending";
}[] = [
  { value: "all", dot: "", labelKey: "history.payment.all" },
  { value: "paid", dot: "", labelKey: "history.payment.paid" },
  { value: "pending", dot: "⏳", labelKey: "history.payment.pending" },
];

interface TabGroup {
  key: string;
  label: string;
  tabs: ClosedTab[];
}

function TabRow({
  tab,
  expanded,
  confirmDelete,
  confirmSettle,
  onToggle,
  onReopen,
  onSettle,
  onDelete,
}: {
  tab: ClosedTab;
  expanded: boolean;
  confirmDelete: boolean;
  confirmSettle: boolean;
  onToggle: () => void;
  onReopen: () => void;
  onSettle: () => void;
  onDelete: () => void;
}) {
  const { state } = useStore();
  const { t } = useT();
  const total = noteTotal(tab);
  const color = NOTE_COLORS[tab.color];
  const preview = tab.items.slice(0, 3);
  const extra = tab.items.length - preview.length;
  const duration = formatElapsed(tab.openedAt, tab.closedAt);

  return (
    <li className="border-b border-stone-100 last:border-0">
      <div className="flex items-center gap-3 py-3">
        <span
          aria-hidden
          className={`h-10 w-10 shrink-0 rotate-3 rounded-sm shadow-sm ring-1 ring-black/5 ${color.bg}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left"
          aria-label={t("history.toggle", { name: tab.customerName })}
        >
          <p className="truncate font-semibold text-stone-900">
            {tab.customerName}
          </p>
          <p className="text-xs text-stone-500">
            {tab.items.length === 1
              ? t("history.itemsOne", { count: tab.items.length })
              : t("history.itemsMany", { count: tab.items.length })}
            ·{" "}
            {formatClock(tab.openedAt)} → {formatClock(tab.closedAt)} · {duration}
            {tab.payment === "pending" && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 font-bold text-amber-800">
                {t("history.pending")}
              </span>
            )}
          </p>
          <p className="mt-0.5 truncate text-xs text-stone-600">
            {preview.map((it) => {
              const p = productById(state.products, it.productId);
              return `${p?.emoji ?? "🧾"} ${p?.name ?? it.productId} ×${it.quantity}`;
            }).join(" · ")}
            {extra > 0 && (
              <span className="text-stone-400"> {t("history.more", { count: extra })}</span>
            )}
          </p>
        </button>

        <span className="font-hand shrink-0 text-2xl font-bold text-stone-900">
          {cur(total)}
        </span>

        <div className="flex shrink-0 items-center gap-1">
          {tab.payment === "pending" && (
            <button
              type="button"
              onClick={onSettle}
              title={t("history.collectTitle")}
              className={`h-8 rounded-full px-3 text-xs font-bold shadow transition-colors ${
                confirmSettle
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-300"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              {confirmSettle
                ? t("history.collectConfirm", { total: cur(total) })
                : t("history.collect")}
            </button>
          )}
          <button
            type="button"
            onClick={onReopen}
            title={t("history.reopenTitle")}
            className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-stone-200"
          >
            ↩
          </button>
          <button
            type="button"
            onClick={onDelete}
            title={t("history.removeTitle")}
            className={`h-8 rounded-full px-3 text-xs font-bold transition-colors ${
              confirmDelete
                ? "bg-red-600 text-white"
                : "grid w-8 place-items-center bg-stone-100 hover:bg-red-100"
            }`}
          >
            {confirmDelete ? t("history.sure") : "🗑️"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pop-in mb-3 rounded-sm border border-stone-200 bg-stone-50 px-4 py-3">
          <ul className="divide-y divide-stone-200/70">
            {tab.items.map((it) => {
              const p = productById(state.products, it.productId);
              const subtotal = it.quantity * it.unitPrice;
              return (
                <li
                  key={it.productId}
                  className="flex items-center gap-2 py-1.5 text-sm"
                >
                  <span aria-hidden>{p?.emoji ?? "🧾"}</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-stone-800">
                    {p?.name ?? it.productId}
                  </span>
                  <span className="text-stone-500">
                    {it.quantity} × {cur(it.unitPrice)}
                  </span>
                  <span className="w-16 text-right font-bold tabular-nums text-stone-900">
                    {cur(subtotal)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-stone-200 pt-2 text-sm">
            <span className="text-stone-500">{t("history.total")}</span>
            <span className="font-hand text-2xl font-bold text-stone-900">
              {cur(total)}
            </span>
          </div>
        </div>
      )}
    </li>
  );
}

export default function TabHistory() {
  const { state, reopenTab, deleteClosedTab, settleTab } = useStore();
  const { t } = useT();
  const [groupMode, setGroupMode] = useState<GroupMode>("day");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmSettleId, setConfirmSettleId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };

  const groups = useMemo<TabGroup[]>(() => {
    const byPayment =
      paymentFilter === "all"
        ? state.closedTabs
        : state.closedTabs.filter((t) => t.payment === paymentFilter);
    const q = query.trim().toLowerCase();
    const filtered = q
      ? byPayment.filter((t) => {
          if (t.customerName.toLowerCase().includes(q)) return true;
          return t.items.some((it) =>
            productById(state.products, it.productId)?.name
              .toLowerCase()
              .includes(q),
          );
        })
      : byPayment;

    if (filtered.length === 0) return [];

    if (groupMode === "flat") {
      return [{ key: "all", label: t("history.group.allTabs"), tabs: filtered }];
    }

    if (groupMode === "day") {
      const map = new Map<string, TabGroup>();
      for (const t of filtered) {
        const label = dayLabel(t.closedAt);
        const entry = map.get(label) ?? { key: label, label, tabs: [] };
        entry.tabs.push(t);
        map.set(label, entry);
      }
      return [...map.values()].sort(
        (a, b) => b.tabs[0].closedAt - a.tabs[0].closedAt,
      );
    }

    const map = new Map<string, TabGroup>();
    for (const t of filtered) {
      const entry = map.get(t.customerId) ?? {
        key: t.customerId,
        label: t.customerName,
        tabs: [],
      };
      entry.tabs.push(t);
      map.set(t.customerId, entry);
    }
    return [...map.values()].sort(
      (a, b) => b.tabs[0].closedAt - a.tabs[0].closedAt,
    );
  }, [state.closedTabs, state.products, groupMode, query, paymentFilter, t]);

  const revenue = useMemo(
    () =>
      state.closedTabs
        .filter((t) => t.payment === "paid")
        .reduce((sum, t) => sum + noteTotal(t), 0),
    [state.closedTabs],
  );
  const receivable = useMemo(
    () =>
      state.closedTabs
        .filter((t) => t.payment === "pending")
        .reduce((sum, t) => sum + noteTotal(t), 0),
    [state.closedTabs],
  );

  const handleReopen = (tab: ClosedTab) => {
    reopenTab(tab.id);
    notify(t("history.toast.reopened", { name: tab.customerName }));
  };

  const handleSettle = (tab: ClosedTab) => {
    if (confirmSettleId !== tab.id) {
      setConfirmSettleId(tab.id);
      window.setTimeout(
        () => setConfirmSettleId((v) => (v === tab.id ? null : v)),
        2500,
      );
      return;
    }
    settleTab(tab.id);
    setConfirmSettleId(null);
    notify(t("history.toast.collected", { total: cur(noteTotal(tab)), name: tab.customerName }));
  };

  const handleDelete = (tab: ClosedTab) => {
    if (confirmDeleteId !== tab.id) {
      setConfirmDeleteId(tab.id);
      window.setTimeout(
        () => setConfirmDeleteId((v) => (v === tab.id ? null : v)),
        2500,
      );
      return;
    }
    deleteClosedTab(tab.id);
    setConfirmDeleteId(null);
    notify(t("history.toast.removed"));
  };

  const groupTotal = (tabs: ClosedTab[]) =>
    tabs.reduce((sum, t) => sum + noteTotal(t), 0);

  return (
    <div className="flex-1 bg-[#faf6ec]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-hand text-5xl font-bold text-stone-900">
              {t("history.title")}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {state.closedTabs.length === 1
                ? t("history.subtitleOne", { count: state.closedTabs.length })
                : t("history.subtitleMany", { count: state.closedTabs.length })}{" "}
              · {cur(revenue)} {t("history.subtitle_2")}
              {receivable > 0 && (
                <>
                  {" "}
                  · <span className="font-bold text-amber-700">
                    {cur(receivable)} {t("history.subtitle_3")}
                  </span>
                </>
              )}
              · {t("history.subtitle_4")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-stone-100 p-1">
              {GROUP_MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setGroupMode(m.value)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                    groupMode === m.value
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {m.dot && <span aria-hidden>{m.dot}</span>} {t(m.labelKey)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm">
              {PAYMENT_FILTERS.map((f) => {
                const count =
                  f.value === "all"
                    ? state.closedTabs.length
                    : state.closedTabs.filter((t) => t.payment === f.value)
                        .length;
                const active = paymentFilter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setPaymentFilter(f.value)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-stone-900 text-white shadow-sm"
                        : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                    }`}
                  >
                    {f.dot && <span aria-hidden>{f.dot}</span>}
                    {t(f.labelKey)}
                    <span
                      className={`rounded-full px-1.5 text-xs font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("history.searchPlaceholder")}
              aria-label={t("history.searchAria")}
              className="h-10 w-56 rounded-sm border border-stone-300 bg-white px-3 text-sm outline-none transition-colors focus:border-stone-500"
            />
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="fade-in mx-auto mt-16 max-w-md rounded-sm border-2 border-dashed border-stone-300 px-8 py-12 text-center">
            <p className="text-5xl" aria-hidden>
              🗂️
            </p>
            <p className="font-hand mt-3 text-3xl font-bold text-stone-900">
              {t("history.empty.title")}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              {query.trim()
                ? t("history.empty.search")
                : t("history.empty.none")}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {groups.map((group) => (
              <section
                key={group.key}
                className="rounded-sm border border-amber-900/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <h2 className="text-lg font-bold text-stone-900">
                    {group.label}
                    <span className="ml-2 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                      {group.tabs.length}
                    </span>
                  </h2>
                  <span className="font-hand text-2xl font-bold text-stone-900">
                    {cur(groupTotal(group.tabs))}
                  </span>
                </div>
                <ul className="pt-1">
                  {group.tabs.map((tab) => (
                                        <TabRow
                      key={tab.id}
                      tab={tab}
                      expanded={expandedId === tab.id}
                      confirmDelete={confirmDeleteId === tab.id}
                      confirmSettle={confirmSettleId === tab.id}
                      onToggle={() =>
                        setExpandedId((v) => (v === tab.id ? null : tab.id))
                      }
                      onReopen={() => handleReopen(tab)}
                      onSettle={() => handleSettle(tab)}
                      onDelete={() => handleDelete(tab)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-stone-400">
          {t("history.footer")}
        </p>
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => {
              clearStoredState();
              window.location.reload();
            }}
            className="text-xs text-stone-400 underline transition-colors hover:text-stone-600"
          >
            {t("history.reset")}
          </button>
        </div>
      </div>

      {toast && (
        <div className="pop-in fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}