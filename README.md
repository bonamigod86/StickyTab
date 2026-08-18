# StickyTab 📌

![Status](https://img.shields.io/badge/status-active-2ea44f)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.8-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)

A flexible **sticky-note wall** for managing customer tabs, tickets, and payments in real time. Built for bars, cafés, and restaurants that prefer a friendly, paper-like corkboard over a stiff cash register.

StickyTab runs entirely in the browser — no backend, no accounts, no server. All data lives in `localStorage`, so you can open it, work all day, and close the tab.

---

## ✨ Features

### 🧱 Sticky-Note Board (`/`)
- Open unlimited customer tabs; each one becomes a colorful sticky note pinned to a corkboard wall.
- **Live status chips**: 🟡 Active, 🟢 Ready, 🔴 Attention — one tap to change, reflected instantly on the card.
- Filter the wall by status (All / Active / Ready / Attention) with per-status counters.
- Elapsed-time display and total that update automatically.
- Each note is taped and slightly rotated for an authentic, handmade look.

### 🧾 Ticket Drawer
- Click any note to open a full ticket panel with a ruled-paper aesthetic.
- **Add products fast**: click a quick-button or search by name, category, or emoji (press **Enter** to add the top match).
- Adjust quantities with **− / +** steppers — unit prices are snapshotted at order time, so catalog edits never rewrite past tickets.
- Rename the customer inline, switch status, and watch the running total grow.
- Every change is **saved automatically** — no Save button needed.

### 🏦 Checkout & "Pendurar"
- **Close & Checkout** — finalizes the tab and saves it to history as **paid**.
- **Pendurar ⏳** — a Portuguese term for "hang it"; closes the tab but marks it **pending** (a receber) so you can collect payment later.
- All critical actions (**Checkout, Pendurar, Discard, Delete**) require a **2-click confirmation** to prevent muscle-memory accidents.

### 📊 Analytics (`/analytics`)
- KPI cards: **Total billed** (paid only), **To collect** (pending), **Tabs paid**, **Average ticket**, and **Open tabs now**.
- 🏆 **Customer Ranking** — top spenders by visits and total billed (pending tabs excluded).
- 📈 **Best-Selling Products** — top 10 by units sold with revenue bars.

### 🗂️ History (`/history`)
- Search, group by **day**, **customer**, or flat **list**.
- Payment filters: All / Paid / **Pending** ("to collect").
- **Reopen** any tab — items are restored and the note goes back on the wall.
- **Collect** outstanding payment on pending tabs, or **delete** records (with confirmations).
- Footer summary of revenue and amount still to collect.

### 🛒 Product Catalog (`/products`)
- Full CRUD for products with emoji, price, and category.
- Quick-pick emoji palette, category suggestions, search, and grouped listing.
- Deleting a product never rewrites existing tickets — they keep the ordered prices.

### 🌎 Bilingual UI (EN / PT-BR)
- One-click language switcher in the navbar with embedded **SVG flags** (🇺🇸 / 🇧🇷) that render reliably across all platforms.
- The choice persists across sessions; every label is translated, including pluralization-aware strings.

---

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16.3.1** (App Router, Turbopack) |
| UI Library | **React 19.2.8** (Server + Client Components) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 4** (CSS-first config via `@theme`) + custom keyframe animations |
| Fonts | `next/font/google` — **Caveat** (handwriting) for UI, **Geist** for sans, **Geist Mono** for mono |
| State | **React Context + `useReducer`** with a single persisted store (`lib/store.tsx`) |
| Persistence | **`localStorage`** with versioned, validated envelopes (`stickytab:state:v1`) |
| Static output | All routes prerender as **static** content (`/`, `/products`, `/analytics`, `/history`) |
| Tooling | **ESLint 9** (`eslint-config-next`), clean `npm run lint` |

### Project structure
```
app/            Routes + root layout (board, products, analytics, history)
components/     Board, StickyNoteCard, TicketDrawer, NewTabModal,
                ProductManager, ProductModal, AnalyticsDashboard,
                TabHistory, NavBar, Flags (inline SVGs)
lib/            store (reducer + persistence), i18n dictionaries,
                theme (colors/status), hooks, mock data, utils
```

### State architecture
A single global store holds the whole app: `lang`, `products`, `customers`, open `notes`, and `closedTabs`. Every mutation is a typed reducer action, and a write-through effect serializes the state to `localStorage` on every change.

### i18n approach
- `lib/i18n.tsx` defines typed translation dictionaries for **en** and **pt-BR**.
- The `useT()` hook returns a `t(key, vars)` function that interpolates `{count}`, `{name}`, `{total}`, etc., and is memoized per language.
- Count-sensitive strings use dedicated singular/plural keys selected via ternary.

### Desktop app (Tauri)
StickyTab ships as a **native Windows desktop app** built with [Tauri v2](https://tauri.app):
- The Next.js app is exported as **static files** (`next.config.ts` → `output: "export"`) and bundled inside a lightweight Rust shell (`src-tauri/`).
- Small installers (~2–3 MB) with zero server and zero browser chrome.
- Uses the WebView2 runtime (preinstalled on Windows 10/11).

**Where data is stored** (desktop app): the WebView2 runtime persists the same `localStorage` store on disk, so your tabs survive closing and reopening the app:

```
C:\Users\<you>\AppData\Local\com.stickytab.desktop\EBWebView\Default\Local Storage\leveldb\
```

- This folder is **app-specific** (separate from Edge/Chrome), so clearing browser data won't touch it.
- **Deleting that folder resets StickyTab** to a clean slate — back it up if you need to keep the data.
- Uninstalling the app may leave this folder behind.

```bash
# Build the installers (produces MSI + NSIS .exe in src-tauri/target/release/bundle/)
npm run tauri:build
```

### Roadmap (planned)
- **Print-ready receipt view** for tickets.
- File-based persistence in the OS user-data folder (so data survives even if web storage is cleared).

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (Turbopack)
npm run dev

# Lint
npm run lint

# Production build (all routes statically prerendered)
npm run build && npm run start
```

No environment variables, API keys, or database setup required. Open `http://localhost:3000` and start sticking notes.

---

## 📄 License

Private project — all rights reserved.