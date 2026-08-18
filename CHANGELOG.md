# Changelog

All notable changes to StickyTab are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-08-17

StickyTab — a real-time customer tab manager styled as a sticky-note corkboard — now available as a native Windows desktop app built with Tauri.

### Added

- **Sticky-note wall** — open tabs as colorful notes on a corkboard; status chips (🟡 Active / 🟢 Ready / 🔴 Attention) update live.
- **Ticket drawer** — add products via quick-buttons or search (name, category, emoji), adjust quantities, rename customers inline, watch the running total grow. Every change auto-saves.
- **Checkout & Pendurar** — close a tab as paid, or "Pendurar ⏳" to record it as pending payment (a receber). All critical actions require 2-click confirmation.
- **Analytics** — total billed (paid only), amount to collect, tabs paid, average ticket, open tabs, customer ranking, and best-selling products.
- **History** — search, group by day/customer/flat, filter by payment status, reopen tabs, collect pending payments, and delete records.
- **Product catalog** — full CRUD with emoji, price, and category; past tickets keep their ordered prices.
- **Bilingual UI** (English / Português) — one-click switcher with native SVG flags; language preference persisted.
- **Offline-first persistence** — all data stored in local web storage; no account or server required.
- **Native Windows app** — compact (~2.3 MB) installers built with Tauri 2 (NSIS `.exe` + MSI).

### Notes

- Installers are **unsigned** — Windows SmartScreen may warn "Unknown publisher"; select *More info → Run anyway*.
- Requires the **WebView2** runtime (preinstalled on Windows 10/11).
- Data currently lives in web storage; file-based persistence in the OS app-data folder is planned.
