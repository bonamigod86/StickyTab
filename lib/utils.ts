import type { ClosedTab, Product, StickyTabNote } from "./types";

export function uid(): string {
  return (
    Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
  );
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const cur = (value: number): string => brl.format(value);

export function noteTotal(note: Pick<StickyTabNote, "items">): number {
  return note.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}

export const isPaidTab = (tab: ClosedTab): boolean => tab.payment === "paid";

export function formatElapsed(openedAt: number, now: number): string {
  const secs = Math.max(0, Math.floor((now - openedAt) / 1000));
  const mins = Math.floor(secs / 60);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}min`;
}

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dayLabel(ts: number): string {
  const date = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function productById(
  products: Product[],
  id: string,
): Product | undefined {
  return products.find((p) => p.id === id);
}

const TILTS = [
  "-rotate-2",
  "rotate-1",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "rotate-0",
];

export function tiltFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return TILTS[hash % TILTS.length];
}

export interface CustomerStat {
  customerId: string;
  name: string;
  visits: number;
  totalSpent: number;
}

export function computeCustomerRanking(
  closedTabs: ClosedTab[],
): CustomerStat[] {
  const map = new Map<string, CustomerStat>();
  for (const tab of closedTabs.filter(isPaidTab)) {
    const entry = map.get(tab.customerId) ?? {
      customerId: tab.customerId,
      name: tab.customerName,
      visits: 0,
      totalSpent: 0,
    };
    entry.visits += 1;
    entry.totalSpent += noteTotal(tab);
    map.set(tab.customerId, entry);
  }
  return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
}

export interface ProductStat {
  productId: string;
  name: string;
  emoji: string;
  units: number;
  revenue: number;
}

export function computeProductRanking(
  closedTabs: ClosedTab[],
  products: Product[],
): ProductStat[] {
  const nameById = new Map(products.map((p) => [p.id, p]));
  const map = new Map<string, ProductStat>();
  for (const tab of closedTabs.filter(isPaidTab)) {
    for (const item of tab.items) {
      const meta = nameById.get(item.productId);
      const entry = map.get(item.productId) ?? {
        productId: item.productId,
        name: meta?.name ?? item.productId,
        emoji: meta?.emoji ?? "🧾",
        units: 0,
        revenue: 0,
      };
      entry.units += item.quantity;
      entry.revenue += item.quantity * item.unitPrice;
      map.set(item.productId, entry);
    }
  }
  return [...map.values()].sort(
    (a, b) => b.units - a.units || b.revenue - a.revenue,
  );
}