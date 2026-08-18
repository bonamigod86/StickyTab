import type { NoteColorKey, TabStatus } from "./types";

export const NOTE_PALETTE: NoteColorKey[] = [
  "yellow",
  "pink",
  "mint",
  "sky",
  "orange",
  "violet",
];

export interface NoteColorStyle {
  bg: string;
  tape: string;
  ink: string;
}

export const NOTE_COLORS: Record<NoteColorKey, NoteColorStyle> = {
  yellow: { bg: "bg-yellow-200", tape: "bg-amber-300/80", ink: "text-yellow-950" },
  pink: { bg: "bg-pink-200", tape: "bg-pink-300/80", ink: "text-rose-950" },
  mint: { bg: "bg-emerald-200", tape: "bg-emerald-300/80", ink: "text-emerald-950" },
  sky: { bg: "bg-sky-200", tape: "bg-sky-300/80", ink: "text-sky-950" },
  orange: { bg: "bg-orange-200", tape: "bg-orange-300/80", ink: "text-orange-950" },
  violet: { bg: "bg-violet-200", tape: "bg-violet-300/80", ink: "text-violet-950" },
};

export const TILTS = [
  "-rotate-2",
  "rotate-1",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "rotate-0",
];

export interface StatusStyle {
  dot: string;
  labelKey: "status.active" | "status.ready" | "status.attention";
  chip: string;
  pill: string;
}

export const STATUS_INFO: Record<TabStatus, StatusStyle> = {
  active: {
    dot: "🟡",
    labelKey: "status.active",
    chip: "bg-yellow-500",
    pill: "bg-yellow-300/70 border-yellow-500/60 text-yellow-950",
  },
  ready: {
    dot: "🟢",
    labelKey: "status.ready",
    chip: "bg-green-500",
    pill: "bg-green-300/70 border-green-500/60 text-green-950",
  },
  attention: {
    dot: "🔴",
    labelKey: "status.attention",
    chip: "bg-red-500",
    pill: "bg-red-300/70 border-red-500/60 text-red-950",
  },
};