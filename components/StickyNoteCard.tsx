"use client";

import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { NOTE_COLORS, STATUS_INFO } from "@/lib/theme";
import type { StickyTabNote } from "@/lib/types";
import {
  cur,
  formatClock,
  formatElapsed,
  noteTotal,
  productById,
} from "@/lib/utils";

interface Props {
  note: StickyTabNote;
  tilt: string;
  now: number;
  onOpen: (id: string) => void;
}

export default function StickyNoteCard({ note, tilt, now, onOpen }: Props) {
  const { state } = useStore();
  const { t } = useT();
  const color = NOTE_COLORS[note.color];
  const status = STATUS_INFO[note.status];
  const total = noteTotal(note);
  const preview = note.items.slice(0, 3);
  const extra = note.items.length - preview.length;

  return (
    <button
      type="button"
      onClick={() => onOpen(note.id)}
      aria-label={`Open tab for ${note.customerName}`}
      className={`relative flex w-64 cursor-pointer flex-col gap-2 rounded-sm p-4 pt-7 pb-5 text-left shadow-[0_10px_20px_-6px_rgba(0,0,0,0.45)] ring-1 ring-black/5 transition-all duration-150 hover:rotate-0 hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-[0_16px_28px_-8px_rgba(0,0,0,0.5)] ${color.bg} ${tilt}`}
    >
      <span
        aria-hidden
        className={`absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-[-4deg] rounded-[2px] shadow-sm ${color.tape}`}
      />

      <span className="flex items-start justify-between gap-2">
        <span className={`font-hand text-2xl font-bold leading-tight ${color.ink}`}>
          {note.customerName}
        </span>
        <span
          title={t(status.labelKey)}
          className={`mt-1 h-3.5 w-3.5 shrink-0 animate-pulse rounded-full ${status.chip}`}
        />
      </span>

      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-black/10 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
        🕓 {formatClock(note.openedAt)} · {formatElapsed(note.openedAt, now)}
      </span>

      <span className="mt-1 flex flex-1 flex-col gap-1 border-t border-black/10 pt-2 text-[13px] leading-snug text-stone-800">
        {preview.length === 0 ? (
          <span className="text-stone-600 italic">{t("card.noItems")}</span>
        ) : (
          preview.map((item) => {
            const product = productById(state.products, item.productId);
            return (
              <span key={item.productId} className="flex justify-between gap-2">
                <span>
                  {product?.emoji} {product?.name ?? item.productId}{" "}
                  <span className="text-stone-600">×{item.quantity}</span>
                </span>
              </span>
            );
          })
        )}
        {extra > 0 && (
          <span className="font-semibold text-stone-600">
            {t("card.more", { count: extra })}
          </span>
        )}
      </span>

      <span className="flex items-end justify-between border-t border-black/10 pt-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
          {t("card.total")}
        </span>
        <span className={`font-hand text-3xl font-bold leading-none ${color.ink}`}>
          {cur(total)}
        </span>
      </span>
    </button>
  );
}