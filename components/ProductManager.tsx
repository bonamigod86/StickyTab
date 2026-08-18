"use client";

import { useMemo, useState } from "react";
import ProductModal, { type ProductForm } from "./ProductModal";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import { cur, uid } from "@/lib/utils";

type ModalState = { mode: "new" } | { mode: "edit"; product: Product } | null;

export default function ProductManager() {
  const { state, addProduct, updateProduct, deleteProduct } = useStore();
  const { t } = useT();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(state.products.map((p) => p.category))].sort(),
    [state.products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.products;
    return state.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [state.products, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of [...filtered].sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    return [...map.entries()];
  }, [filtered]);

  const handleSave = (form: ProductForm) => {
    if (modal?.mode === "edit") {
      updateProduct(modal.product.id, form);
    } else {
      addProduct({ ...form, id: uid() });
    }
    setModal(null);
  };

  const handleDelete = (product: Product) => {
    if (confirmId !== product.id) {
      setConfirmId(product.id);
      window.setTimeout(
        () => setConfirmId((c) => (c === product.id ? null : c)),
        2500,
      );
      return;
    }
    deleteProduct(product.id);
    setConfirmId(null);
  };

  return (
    <div className="flex-1 bg-[#faf6ec]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-hand text-5xl font-bold text-stone-900">
              {t("products.title")}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {state.products.length === 1
                ? t("products.subtitleOne", { count: state.products.length })
                : t("products.subtitleMany", { count: state.products.length })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("products.searchPlaceholder")}
              aria-label={t("products.searchAria")}
              className="h-11 w-56 rounded-sm border border-stone-300 bg-white px-3 text-sm outline-none transition-colors focus:border-stone-500"
            />
            <button
              type="button"
              onClick={() => setModal({ mode: "new" })}
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-stone-900 px-4 text-sm font-bold text-white shadow transition-colors hover:bg-stone-800"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20">
                +
              </span>
              {t("products.add")}
            </button>
          </div>
        </div>

        {grouped.length === 0 ? (
          <div className="fade-in mx-auto mt-16 max-w-md rounded-sm border-2 border-dashed border-stone-300 px-8 py-12 text-center">
            <p className="text-5xl" aria-hidden>
              🛒
            </p>
            <p className="font-hand mt-3 text-3xl font-bold text-stone-900">
              {t("products.empty.title")}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              {query.trim()
                ? t("products.empty.search")
                : t("products.empty.none")}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {grouped.map(([category, items], i) => (
              <section
                key={category}
                className="rounded-sm border border-amber-900/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                    <span
                      aria-hidden
                      className={`text-xl ${i % 2 === 0 ? "" : "rotate-6"}`}
                    >
                      🗂️
                    </span>
                    {category}
                  </h2>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                    {items.length}
                  </span>
                </div>

                <ul className="mt-3 divide-y divide-stone-100">
                  {items.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-100 text-xl">
                        {p.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-stone-900">
                          {p.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          {cur(p.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setModal({ mode: "edit", product: p })}
                          aria-label={t("products.edit", { name: p.name })}
                          className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-sm transition-colors hover:bg-stone-200"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          aria-label={t("products.delete", { name: p.name })}
                          className={`h-8 rounded-full px-3 text-xs font-bold transition-colors ${
                            confirmId === p.id
                              ? "bg-red-600 text-white"
                              : "grid w-8 place-items-center bg-stone-100 hover:bg-red-100"
                          }`}
                        >
                          {confirmId === p.id ? t("products.sure") : "🗑️"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-stone-400">
          {t("products.hint")}
        </p>
      </div>

      {modal && (
        <ProductModal
          initial={modal.mode === "edit" ? modal.product : undefined}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}