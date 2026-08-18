"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import {
  computeCustomerRanking,
  computeProductRanking,
  cur,
  isPaidTab,
  noteTotal,
} from "@/lib/utils";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function AnalyticsDashboard() {
  const { state } = useStore();
  const { t } = useT();
  const { closedTabs, products, notes } = state;

  const metrics = useMemo(() => {
    const paid = closedTabs.filter(isPaidTab);
    const pending = closedTabs.filter((t) => !isPaidTab(t));
    const revenue = paid.reduce((sum, t) => sum + noteTotal(t), 0);
    const completed = paid.length;
    const avg = completed > 0 ? revenue / completed : 0;
    const receivables = pending.reduce((sum, t) => sum + noteTotal(t), 0);
    return {
      revenue,
      completed,
      avg,
      receivables,
      pendingCount: pending.length,
      open: notes.length,
    };
  }, [closedTabs, notes]);

  const ranking = useMemo(
    () => computeCustomerRanking(closedTabs),
    [closedTabs],
  );
  const topProducts = useMemo(
    () => computeProductRanking(closedTabs, products).slice(0, 10),
    [closedTabs, products],
  );
  const maxUnits = topProducts[0]?.units ?? 0;

  const stats = [
    { label: t("analytics.stat.billed"), value: cur(metrics.revenue), hint: t("analytics.stat.billedHint"), icon: "💰" },
    { label: t("analytics.stat.collect"), value: cur(metrics.receivables), hint: t("analytics.stat.collectHint", { count: metrics.pendingCount }), icon: "⏳" },
    { label: t("analytics.stat.paid"), value: String(metrics.completed), hint: t("analytics.stat.paidHint"), icon: "🧾" },
    { label: t("analytics.stat.avg"), value: cur(metrics.avg), hint: t("analytics.stat.avgHint"), icon: "✍️" },
    { label: t("analytics.stat.open"), value: String(metrics.open), hint: t("analytics.stat.openHint"), icon: "📌" },
  ];

  return (
    <div className="flex-1 bg-[#faf6ec]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="font-hand text-5xl font-bold text-stone-900">
          {t("analytics.title")}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {t("analytics.subtitle")}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-sm border border-amber-900/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                  {s.label}
                </span>
                <span aria-hidden className="text-lg">
                  {s.icon}
                </span>
              </div>
              <p className="font-hand mt-1 text-4xl font-bold text-stone-900">
                {s.value}
              </p>
              <p className="text-xs text-stone-400">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-sm border border-amber-900/10 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
              <span aria-hidden>🏆</span> {t("analytics.rankingTitle")}
            </h2>
            <p className="mt-0.5 text-xs text-stone-500">
              {t("analytics.rankingHint")}
            </p>

            {ranking.length === 0 ? (
              <p className="mt-6 text-center text-sm text-stone-400">
                {t("analytics.rankingEmpty")}
              </p>
            ) : (
              <ol className="mt-4 divide-y divide-stone-100">
                {ranking.slice(0, 8).map((c, i) => (
                  <li
                    key={c.customerId}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <span className="w-8 shrink-0 text-center text-xl">
                      {MEDALS[i] ?? <span className="text-sm font-bold text-stone-400">{i + 1}</span>}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-stone-900">
                        {c.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {c.visits === 1
                          ? t("analytics.visitsOne", { count: c.visits })
                          : t("analytics.visitsMany", { count: c.visits })}
                      </p>
                    </div>
                    <span className="font-hand text-2xl font-bold text-stone-900">
                      {cur(c.totalSpent)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="rounded-sm border border-amber-900/10 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
              <span aria-hidden>📈</span> {t("analytics.productsTitle")}
            </h2>
            <p className="mt-0.5 text-xs text-stone-500">
              {t("analytics.productsHint")}
            </p>

            {topProducts.length === 0 ? (
              <p className="mt-6 text-center text-sm text-stone-400">
                {t("analytics.productsEmpty")}
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {topProducts.map((p) => (
                  <li key={p.productId}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-stone-800">
                        {p.emoji} {p.name}
                        <span className="ml-1.5 font-normal text-stone-500">
                          {p.units === 1
                            ? t("analytics.unitsSoldOne", { count: p.units })
                            : t("analytics.unitsSoldMany", { count: p.units })}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-stone-900">
                        {cur(p.revenue)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500"
                        style={{
                          width: `${maxUnits > 0 ? (p.units / maxUnits) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}