import type {
  ClosedTab,
  Customer,
  Product,
  StickyTabNote,
} from "./types";

const MIN = 60_000;
const HOUR = 3_600_000;

export const initialProducts: Product[] = [
  { id: "p-espresso", name: "Espresso", price: 6, emoji: "☕", category: "Hot Drinks" },
  { id: "p-cappuccino", name: "Cappuccino", price: 12, emoji: "🥛", category: "Hot Drinks" },
  { id: "p-aromato", name: "Hot Chocolate", price: 14, emoji: "🍫", category: "Hot Drinks" },
  { id: "p-cola", name: "Cola", price: 8, emoji: "🥤", category: "Cold Drinks" },
  { id: "p-juice", name: "Fresh Orange Juice", price: 12, emoji: "🧃", category: "Cold Drinks" },
  { id: "p-water", name: "Mineral Water", price: 5, emoji: "💧", category: "Cold Drinks" },
  { id: "p-draft", name: "Draft Beer 500ml", price: 16, emoji: "🍺", category: "Cold Drinks" },
  { id: "p-craft", name: "Craft Beer", price: 24, emoji: "🍻", category: "Cold Drinks" },
  { id: "p-wine", name: "House Wine (glass)", price: 22, emoji: "🍷", category: "Cocktails" },
  { id: "p-mojito", name: "Mojito", price: 26, emoji: "🍸", category: "Cocktails" },
  { id: "p-caipirinha", name: "Caipirinha", price: 25, emoji: "🍹", category: "Cocktails" },
  { id: "p-burger", name: "Classic Burger", price: 34, emoji: "🍔", category: "Main Dishes" },
  { id: "p-pizza", name: "Margherita Pizza", price: 48, emoji: "🍕", category: "Main Dishes" },
  { id: "p-steak", name: "Picanha & Chips", price: 68, emoji: "🥩", category: "Main Dishes" },
  { id: "p-salad", name: "Caesar Salad", price: 28, emoji: "🥗", category: "Main Dishes" },
  { id: "p-wings", name: "Buffalo Wings", price: 32, emoji: "🍗", category: "Snacks" },
  { id: "p-fries", name: "French Fries", price: 18, emoji: "🍟", category: "Snacks" },
  { id: "p-cheesecake", name: "Cheesecake", price: 22, emoji: "🍰", category: "Desserts" },
  { id: "p-croissant", name: "Croissant", price: 10, emoji: "🥐", category: "Snacks" },
];

const now = Date.now();

export const initialNotes: StickyTabNote[] = [
  {
    id: "n1",
    customerId: "c1",
    customerName: "Anna Souza",
    status: "active",
    color: "yellow",
    openedAt: now - 42 * MIN,
    items: [
      { productId: "p-espresso", quantity: 2, unitPrice: 6 },
      { productId: "p-cappuccino", quantity: 1, unitPrice: 12 },
    ],
  },
  {
    id: "n2",
    customerId: "c2",
    customerName: "Bruno Lima",
    status: "attention",
    color: "pink",
    openedAt: now - 95 * MIN,
    items: [
      { productId: "p-burger", quantity: 2, unitPrice: 34 },
      { productId: "p-fries", quantity: 1, unitPrice: 18 },
      { productId: "p-cola", quantity: 2, unitPrice: 8 },
    ],
  },
  {
    id: "n3",
    customerId: "c3",
    customerName: "Camila Rocha",
    status: "ready",
    color: "mint",
    openedAt: now - 2 * HOUR - 20 * MIN,
    items: [
      { productId: "p-pizza", quantity: 1, unitPrice: 48 },
      { productId: "p-wine", quantity: 2, unitPrice: 22 },
      { productId: "p-salad", quantity: 1, unitPrice: 28 },
    ],
  },
  {
    id: "n4",
    customerId: "c4",
    customerName: "Diego Martins",
    status: "active",
    color: "sky",
    openedAt: now - 18 * MIN,
    items: [{ productId: "p-draft", quantity: 2, unitPrice: 16 }],
  },
  {
    id: "n5",
    customerId: "c5",
    customerName: "Elisa Castro",
    status: "attention",
    color: "orange",
    openedAt: now - 3 * HOUR,
    items: [
      { productId: "p-mojito", quantity: 1, unitPrice: 26 },
      { productId: "p-wings", quantity: 1, unitPrice: 32 },
      { productId: "p-cheesecake", quantity: 1, unitPrice: 22 },
    ],
  },
];

const initialTabList: Array<Omit<ClosedTab, "payment"> & { pending?: boolean }> = [
  {
    id: "t1",
    customerId: "c6",
    customerName: "Felipe Nunes",
    status: "ready",
    color: "yellow",
    openedAt: now - 3 * HOUR - 40 * MIN,
    closedAt: now - 2 * HOUR - 50 * MIN,
    items: [
      { productId: "p-steak", quantity: 1, unitPrice: 68 },
      { productId: "p-wine", quantity: 1, unitPrice: 22 },
    ],
  },
  {
    id: "t2",
    customerId: "c7",
    customerName: "Gabriela Almeida",
    status: "ready",
    color: "pink",
    openedAt: now - 2 * HOUR,
    closedAt: now - HOUR - 30 * MIN,
    items: [
      { productId: "p-caipirinha", quantity: 3, unitPrice: 25 },
      { productId: "p-fries", quantity: 2, unitPrice: 18 },
    ],
  },
  {
    id: "t3",
    customerId: "c1",
    customerName: "Anna Souza",
    status: "ready",
    color: "mint",
    openedAt: now - 5 * HOUR,
    closedAt: now - 4 * HOUR - 15 * MIN,
    items: [
      { productId: "p-cappuccino", quantity: 2, unitPrice: 12 },
      { productId: "p-cheesecake", quantity: 2, unitPrice: 22 },
    ],
  },
  {
    id: "t4",
    customerId: "c8",
    customerName: "Hugo Santos",
    status: "ready",
    color: "sky",
    openedAt: now - 6 * HOUR,
    closedAt: now - 5 * HOUR - 20 * MIN,
    items: [
      { productId: "p-pizza", quantity: 2, unitPrice: 48 },
      { productId: "p-craft", quantity: 4, unitPrice: 24 },
    ],
  },
  {
    id: "t5",
    customerId: "c9",
    customerName: "Isabela Pereira",
    status: "ready",
    color: "orange",
    openedAt: now - 7 * HOUR - 10 * MIN,
    closedAt: now - 6 * HOUR - 25 * MIN,
    items: [
      { productId: "p-salad", quantity: 1, unitPrice: 28 },
      { productId: "p-juice", quantity: 2, unitPrice: 12 },
      { productId: "p-cheesecake", quantity: 1, unitPrice: 22 },
    ],
  },
  {
    id: "t6",
    customerId: "c6",
    customerName: "Felipe Nunes",
    status: "ready",
    color: "violet",
    openedAt: now - 9 * HOUR,
    closedAt: now - 8 * HOUR - 10 * MIN,
    items: [
      { productId: "p-espresso", quantity: 3, unitPrice: 6 },
      { productId: "p-croissant", quantity: 1, unitPrice: 10 },
    ],
  },
  {
    id: "t7",
    customerId: "c2",
    customerName: "Bruno Lima",
    status: "ready",
    color: "yellow",
    openedAt: now - 10 * HOUR,
    closedAt: now - 9 * HOUR - 30 * MIN,
    items: [
      { productId: "p-mojito", quantity: 2, unitPrice: 26 },
      { productId: "p-wings", quantity: 1, unitPrice: 32 },
    ],
  },
  {
    id: "t8",
    customerId: "c10",
    customerName: "João Ferreira",
    status: "ready",
    color: "pink",
    openedAt: now - 12 * HOUR,
    closedAt: now - 11 * HOUR - 20 * MIN,
    items: [
      { productId: "p-burger", quantity: 1, unitPrice: 34 },
      { productId: "p-draft", quantity: 3, unitPrice: 16 },
    ],
  },
  {
    id: "t9",
    customerId: "c7",
    customerName: "Gabriela Almeida",
    status: "ready",
    color: "mint",
    openedAt: now - 26 * HOUR,
    closedAt: now - 25 * HOUR - 20 * MIN,
    items: [
      { productId: "p-cappuccino", quantity: 1, unitPrice: 12 },
      { productId: "p-salad", quantity: 1, unitPrice: 28 },
      { productId: "p-wine", quantity: 2, unitPrice: 22 },
    ],
  },
  {
    id: "t10",
    customerId: "c3",
    customerName: "Camila Rocha",
    status: "ready",
    color: "sky",
    openedAt: now - 28 * HOUR,
    closedAt: now - 27 * HOUR - 15 * MIN,
    items: [
      { productId: "p-craft", quantity: 2, unitPrice: 24 },
      { productId: "p-fries", quantity: 1, unitPrice: 18 },
    ],
  },
  {
    id: "t11",
    customerId: "c8",
    customerName: "Hugo Santos",
    status: "ready",
    color: "orange",
    openedAt: now - 3 * HOUR,
    closedAt: now - HOUR,
    pending: true,
    items: [
      { productId: "p-mojito", quantity: 2, unitPrice: 26 },
    ],
  },
  {
    id: "t12",
    customerId: "c9",
    customerName: "Isabela Pereira",
    status: "ready",
    color: "violet",
    openedAt: now - 2 * HOUR,
    closedAt: now - 45 * MIN,
    pending: true,
    items: [
      { productId: "p-caipirinha", quantity: 1, unitPrice: 25 },
      { productId: "p-draft", quantity: 1, unitPrice: 16 },
    ],
  },
];

export const initialClosedTabs: ClosedTab[] = initialTabList.map((t) => ({
  ...t,
  payment: t.pending ? "pending" : "paid",
}));

const baseCustomers: Omit<Customer, "visits" | "totalSpent">[] = [
  { id: "c1", name: "Anna Souza" },
  { id: "c2", name: "Bruno Lima" },
  { id: "c3", name: "Camila Rocha" },
  { id: "c4", name: "Diego Martins" },
  { id: "c5", name: "Elisa Castro" },
  { id: "c6", name: "Felipe Nunes" },
  { id: "c7", name: "Gabriela Almeida" },
  { id: "c8", name: "Hugo Santos" },
  { id: "c9", name: "Isabela Pereira" },
  { id: "c10", name: "João Ferreira" },
];

function tallyCustomers(closedTabs: ClosedTab[]): Customer[] {
  return baseCustomers.map((c) => {
    let visits = 0;
    let totalSpent = 0;
    for (const tab of closedTabs) {
      if (tab.customerId !== c.id) continue;
      visits += 1;
      if (tab.payment === "paid") {
        totalSpent += tab.items.reduce(
          (sum, it) => sum + it.quantity * it.unitPrice,
          0,
        );
      }
    }
    return { ...c, visits, totalSpent };
  });
}

export const initialCustomers: Customer[] = tallyCustomers(initialClosedTabs);