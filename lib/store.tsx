"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { NOTE_PALETTE } from "./theme";
import type {
  ClosedTab,
  Customer,
  Lang,
  Product,
  StoreState,
  StickyTabNote,
  TabStatus,
} from "./types";
import {
  initialClosedTabs,
  initialCustomers,
  initialNotes,
  initialProducts,
} from "./mockData";
import { noteTotal, uid } from "./utils";

export const initialState: StoreState = {
  lang: "en",
  products: initialProducts,
  customers: initialCustomers,
  notes: initialNotes,
  closedTabs: initialClosedTabs,
};

const STORAGE_KEY = "stickytab:state:v1";
const STORAGE_VERSION = 1;

function isValidState(value: unknown): value is StoreState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const langOk =
    v.lang === undefined || v.lang === "en" || v.lang === "pt-BR";
  return (
    langOk &&
    Array.isArray(v.products) &&
    Array.isArray(v.customers) &&
    Array.isArray(v.notes) &&
    Array.isArray(v.closedTabs)
  );
}

export function clearStoredState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable — ignore
  }
}

function paidDelta(tab: ClosedTab): number {
  return tab.payment === "paid" ? noteTotal(tab) : 0;
}

function applyTab(customers: Customer[], tab: ClosedTab): Customer[] {
  const spent = paidDelta(tab);
  return customers.map((c) =>
    c.id === tab.customerId
      ? {
          ...c,
          visits: c.visits + 1,
          totalSpent: Math.round((c.totalSpent + spent) * 100) / 100,
        }
      : c,
  );
}

function unapplyTab(customers: Customer[], tab: ClosedTab): Customer[] {
  const spent = paidDelta(tab);
  return customers.map((c) =>
    c.id === tab.customerId
      ? {
          ...c,
          visits: Math.max(0, c.visits - 1),
          totalSpent: Math.max(0, Math.round((c.totalSpent - spent) * 100) / 100),
        }
      : c,
  );
}

function addPaid(
  customers: Customer[],
  customerId: string,
  amount: number,
): Customer[] {
  return customers.map((c) =>
    c.id === customerId
      ? {
          ...c,
          totalSpent: Math.round((c.totalSpent + amount) * 100) / 100,
        }
      : c,
  );
}

type Action =
  | { type: "OPEN_NOTE"; id: string; name: string }
  | { type: "RENAME_NOTE"; id: string; name: string }
  | { type: "SET_STATUS"; id: string; status: TabStatus }
  | { type: "ADD_ITEM"; noteId: string; productId: string }
  | { type: "DECREMENT_ITEM"; noteId: string; productId: string }
  | { type: "CLOSE_NOTE"; id: string }
  | { type: "DELETE_NOTE"; id: string }
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "UPDATE_PRODUCT"; id: string; patch: Omit<Product, "id"> }
  | { type: "DELETE_PRODUCT"; id: string }
  | { type: "REOPEN_TAB"; id: string }
  | { type: "DELETE_CLOSED_TAB"; id: string }
  | { type: "PEND_TAB"; id: string }
  | { type: "SETTLE_TAB"; id: string }
  | { type: "SET_LANG"; lang: Lang }
  | { type: "HYDRATE"; state: StoreState };

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "OPEN_NOTE": {
      const name = action.name.trim();
      if (!name) return state;
      const existing = state.customers.find(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      );
      let customers = state.customers;
      if (!existing) {
        const fresh: Customer = {
          id: uid(),
          name,
          visits: 0,
          totalSpent: 0,
        };
        customers = [...state.customers, fresh];
      }
      const customer = existing ?? customers[customers.length - 1];
      const note: StickyTabNote = {
        id: action.id,
        customerId: customer.id,
        customerName: customer.name,
        status: "active",
        color: NOTE_PALETTE[state.notes.length % NOTE_PALETTE.length],
        openedAt: Date.now(),
        items: [],
      };
      return {
        ...state,
        customers,
        notes: [note, ...state.notes],
      };
    }

    case "RENAME_NOTE": {
      const name = action.name.trim();
      if (!name) return state;
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.id ? { ...n, customerName: name } : n,
        ),
      };
    }

    case "SET_STATUS":
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.id ? { ...n, status: action.status } : n,
        ),
      };

    case "ADD_ITEM": {
      const product = state.products.find((p) => p.id === action.productId);
      if (!product) return state;
      return {
        ...state,
        notes: state.notes.map((n) => {
          if (n.id !== action.noteId) return n;
          const existingItem = n.items.find(
            (it) => it.productId === action.productId,
          );
          return {
            ...n,
            items: existingItem
              ? n.items.map((it) =>
                  it.productId === action.productId
                    ? { ...it, quantity: it.quantity + 1 }
                    : it,
                )
              : [
                  ...n.items,
                  {
                    productId: product.id,
                    quantity: 1,
                    unitPrice: product.price,
                  },
                ],
          };
        }),
      };
    }

    case "DECREMENT_ITEM": {
      return {
        ...state,
        notes: state.notes.map((n) => {
          if (n.id !== action.noteId) return n;
          const next = n.items
            .map((it) =>
              it.productId === action.productId
                ? { ...it, quantity: it.quantity - 1 }
                : it,
            )
            .filter((it) => it.quantity > 0);
          return { ...n, items: next };
        }),
      };
    }

    case "CLOSE_NOTE": {
      const note = state.notes.find((n) => n.id === action.id);
      if (!note) return state;
      const closed: ClosedTab = {
        ...note,
        status: "ready",
        closedAt: Date.now(),
        payment: "paid",
      };
      return {
        ...state,
        customers: applyTab(state.customers, closed),
        notes: state.notes.filter((n) => n.id !== action.id),
        closedTabs: [closed, ...state.closedTabs],
      };
    }

    case "PEND_TAB": {
      const note = state.notes.find((n) => n.id === action.id);
      if (!note) return state;
      const closed: ClosedTab = {
        ...note,
        status: "ready",
        closedAt: Date.now(),
        payment: "pending",
      };
      return {
        ...state,
        customers: applyTab(state.customers, closed),
        notes: state.notes.filter((n) => n.id !== action.id),
        closedTabs: [closed, ...state.closedTabs],
      };
    }

    case "SETTLE_TAB": {
      const tab = state.closedTabs.find((t) => t.id === action.id);
      if (!tab || tab.payment === "paid") return state;
      return {
        ...state,
        customers: addPaid(state.customers, tab.customerId, noteTotal(tab)),
        closedTabs: state.closedTabs.map((t) =>
          t.id === action.id ? { ...t, payment: "paid" } : t,
        ),
      };
    }

    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.id),
      };

    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.product] };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.id ? { ...p, ...action.patch } : p,
        ),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.id),
      };

    case "REOPEN_TAB": {
      const tab = state.closedTabs.find((t) => t.id === action.id);
      if (!tab) return state;
      const reopened: StickyTabNote = {
        id: tab.id,
        customerId: tab.customerId,
        customerName: tab.customerName,
        status: "active",
        color: tab.color,
        openedAt: tab.openedAt,
        items: tab.items,
      };
      return {
        ...state,
        customers: unapplyTab(state.customers, tab),
        notes: [reopened, ...state.notes],
        closedTabs: state.closedTabs.filter((t) => t.id !== action.id),
      };
    }

    case "DELETE_CLOSED_TAB": {
      const tab = state.closedTabs.find((t) => t.id === action.id);
      if (!tab) return state;
      return {
        ...state,
        customers: unapplyTab(state.customers, tab),
        closedTabs: state.closedTabs.filter((t) => t.id !== action.id),
      };
    }

    case "HYDRATE":
      return action.state;

    case "SET_LANG":
      return { ...state, lang: action.lang };

    default:
      return state;
  }
}

export interface StoreApi {
  state: StoreState;
  openNote: (id: string, name: string) => void;
  renameNote: (id: string, name: string) => void;
  setStatus: (id: string, status: TabStatus) => void;
  addItem: (noteId: string, productId: string) => void;
  decrementItem: (noteId: string, productId: string) => void;
  closeNote: (id: string) => void;
  deleteNote: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  reopenTab: (id: string) => void;
  deleteClosedTab: (id: string) => void;
  pendTab: (id: string) => void;
  settleTab: (id: string) => void;
  setLang: (lang: Lang) => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, state }),
      );
    } catch {
      // storage full or unavailable — ignore
    }
  }, [state]);

  useEffect(() => {
    let saved: StoreState | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        const version = (parsed as { version?: number } | null)?.version;
        const data = (parsed as { state?: unknown } | null)?.state;
        if (version === STORAGE_VERSION && isValidState(data)) saved = data;
      }
    } catch {
      // corrupted storage — fall back to mock data
    }
    if (saved) dispatch({ type: "HYDRATE", state: saved });
    mountedRef.current = true;
  }, []);

  const api = useMemo<StoreApi>(
    () => ({
      state,
      openNote: (id, name) => dispatch({ type: "OPEN_NOTE", id, name }),
      renameNote: (id, name) => dispatch({ type: "RENAME_NOTE", id, name }),
      setStatus: (id, status) => dispatch({ type: "SET_STATUS", id, status }),
      addItem: (noteId, productId) =>
        dispatch({ type: "ADD_ITEM", noteId, productId }),
      decrementItem: (noteId, productId) =>
        dispatch({ type: "DECREMENT_ITEM", noteId, productId }),
      closeNote: (id) => dispatch({ type: "CLOSE_NOTE", id }),
      deleteNote: (id) => dispatch({ type: "DELETE_NOTE", id }),
      addProduct: (product) => dispatch({ type: "ADD_PRODUCT", product }),
      updateProduct: (id, patch) =>
        dispatch({ type: "UPDATE_PRODUCT", id, patch }),
      deleteProduct: (id) => dispatch({ type: "DELETE_PRODUCT", id }),
      reopenTab: (id) => dispatch({ type: "REOPEN_TAB", id }),
      deleteClosedTab: (id) => dispatch({ type: "DELETE_CLOSED_TAB", id }),
      pendTab: (id) => dispatch({ type: "PEND_TAB", id }),
      settleTab: (id) => dispatch({ type: "SETTLE_TAB", id }),
      setLang: (lang) => dispatch({ type: "SET_LANG", lang }),
    }),
    [state],
  );

  return (
    <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}