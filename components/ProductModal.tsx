"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import type { Product } from "@/lib/types";

export interface ProductForm {
  name: string;
  price: number;
  emoji: string;
  category: string;
}

interface Props {
  initial?: Product;
  categories: string[];
  onClose: () => void;
  onSave: (form: ProductForm) => void;
}

const QUICK_EMOJIS = ["🍔", "🍕", "☕", "🍺", "🍹", "🍟", "🍰", "🥗", "🍨", "🍣"];

export default function ProductModal({
  initial,
  categories,
  onClose,
  onSave,
}: Props) {
  const { t } = useT();
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "🧾");
  const [category, setCategory] = useState(
    initial?.category ?? categories[0] ?? t("productModal.categoryDefault"),
  );

  const priceValue = Number(price);
  const valid =
    name.trim().length > 0 &&
    price.trim() !== "" &&
    !Number.isNaN(priceValue) &&
    priceValue >= 0 &&
    category.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    onSave({
      name: name.trim(),
      price: Math.round(priceValue * 100) / 100,
      emoji: emoji.trim() || "🧾",
      category: category.trim(),
    });
  };

  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={initial ? t("productModal.edit") : t("productModal.new")}
        className="pop-in relative w-full max-w-md rounded-sm bg-[#fffdf6] px-6 pb-6 pt-8 shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 rounded-[2px] bg-amber-300/80 shadow-sm"
        />
        <h2 className="font-hand text-3xl font-bold text-stone-900">
          {initial ? t("productModal.edit") : t("productModal.new")}
        </h2>
        <p className="mt-0.5 text-sm text-stone-500">
          {initial
            ? t("productModal.editHint")
            : t("productModal.newHint")}
        </p>

        <div className="mt-4 grid grid-cols-[64px_1fr] gap-3">
          <div>
            <label className="block text-sm font-semibold text-stone-800">
              {t("productModal.emoji")}
            </label>
            <input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={4}
              aria-label={t("productModal.emoji")}
              className="mt-1.5 h-12 w-full rounded-sm border border-stone-300 bg-white text-center text-2xl outline-none focus:border-stone-500"
            />
            <div className="mt-1.5 flex flex-wrap gap-1">
              {QUICK_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`grid h-7 w-7 place-items-center rounded bg-stone-100 text-sm transition-colors hover:bg-stone-200 ${
                    emoji === e ? "ring-2 ring-yellow-500" : ""
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-800">
              {t("productModal.name")}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") onClose();
              }}
              placeholder={t("productModal.namePlaceholder")}
              className="mt-1.5 h-12 w-full rounded-sm border border-stone-300 bg-white px-3 outline-none focus:border-stone-500"
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-stone-800">
              {t("productModal.category")}
            </label>
            <input
              list="product-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={t("productModal.categoryPlaceholder")}
              className="mt-1.5 h-12 w-full rounded-sm border border-stone-300 bg-white px-3 outline-none focus:border-stone-500"
            />
            <datalist id="product-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-800">
              {t("productModal.price")}
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="0.00"
              className="mt-1.5 h-12 w-full rounded-sm border border-stone-300 bg-white px-3 outline-none focus:border-stone-500"
            />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                  category === c
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-600 hover:border-stone-500"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-sm px-4 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-100"
          >
            {t("productModal.cancel")}
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!valid}
            className="h-11 rounded-sm bg-stone-900 px-5 text-sm font-bold text-white shadow transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {initial ? t("productModal.save") : t("productModal.add")}
          </button>
        </div>
      </div>
    </div>
  );
}