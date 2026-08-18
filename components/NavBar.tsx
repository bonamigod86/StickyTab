"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { FlagBR, FlagUS } from "./Flags";
import type { Lang } from "@/lib/types";

const TABS: { href: string; labelKey: "nav.board" | "nav.products" | "nav.analytics" | "nav.history" }[] = [
  { href: "/", labelKey: "nav.board" },
  { href: "/products", labelKey: "nav.products" },
  { href: "/analytics", labelKey: "nav.analytics" },
  { href: "/history", labelKey: "nav.history" },
];

const LANGS: { value: Lang; Flag: ComponentType<{ className?: string }>; name: string }[] = [
  { value: "en", Flag: FlagUS, name: "English" },
  { value: "pt-BR", Flag: FlagBR, name: "Português" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { state } = useStore();
  const { t, lang, setLang } = useT();
  const open = state.notes.length;

  return (
    <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-yellow-300 shadow-sm ring-1 ring-black/5 rotate-[-3deg] text-lg">
              📌
            </span>
            <span className="font-hand text-3xl font-bold leading-none tracking-tight text-stone-900">
              StickyTab
            </span>
          </Link>

          <nav className="flex items-center gap-1 rounded-full bg-stone-100 p-1">
            {TABS.map((tab) => {
              const active =
                tab.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {t(tab.labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full border border-stone-200 bg-white p-0.5 shadow-sm">
            {LANGS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLang(l.value)}
                aria-pressed={lang === l.value}
                title={l.name}
                aria-label={l.name}
                className={`flex items-center rounded-sm p-0.5 leading-none transition-colors ${
                  lang === l.value
                    ? "bg-stone-900/5 ring-1 ring-stone-300"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <l.Flag className="h-4 w-6 rounded-[2px] shadow-sm ring-1 ring-black/5" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            {open === 1 ? t("nav.openTabsOne", { count: open }) : t("nav.openTabsMany", { count: open })}
          </div>
        </div>
      </div>
    </header>
  );
}