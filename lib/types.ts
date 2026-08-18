export type TabStatus = "active" | "ready" | "attention";

export type Lang = "en" | "pt-BR";

export type NoteColorKey =
  | "yellow"
  | "pink"
  | "mint"
  | "sky"
  | "orange"
  | "violet";

export interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  visits: number;
  totalSpent: number;
}

export interface StickyTabNote {
  id: string;
  customerId: string;
  customerName: string;
  status: TabStatus;
  color: NoteColorKey;
  openedAt: number;
  items: OrderItem[];
}

export type PaymentStatus = "paid" | "pending";

export interface ClosedTab extends StickyTabNote {
  closedAt: number;
  payment: PaymentStatus;
}

export interface StoreState {
  lang: Lang;
  products: Product[];
  customers: Customer[];
  notes: StickyTabNote[];
  closedTabs: ClosedTab[];
}