# 🌱 AgriSmart — AI Farmer Assistant

A fully functional, responsive farming dashboard built with **React + Vite**. It replicates the AgriSmart mockup and wires up **real, free, no-key APIs** where they exist (live weather + geocoding, Indian mandi prices) and clearly-labelled on-device simulations where no free API exists (disease detection, the AI chat assistant, soil & crop advisories).

> No "Upgrade to Premium" — every feature is free and works out of the box.

## ✨ Features

| Page | What it does | Data source |
|------|--------------|-------------|
| **Dashboard** | Hero, feature cards, live weather & market widgets, recent reports, alerts, AI bar | live + local state |
| **Disease Detection** | Upload a leaf photo → simulated diagnosis with confidence, cause, symptoms & treatment; save report | **simulated** (on-device, deterministic) |
| **Soil & Nutrition** | Enter N-P-K / pH / moisture → health score + fertiliser & amendment plan | rule-based |
| **Crop Advisory** | Pick a crop → sowing window, irrigation, fertiliser plan, pest watch, expected yield | crop knowledge base |
| **Market Prices** | Searchable/sortable mandi price table + commodity trend chart | **data.gov.in** (live) → graceful fallback |
| **Weather** | Current conditions, 7-day forecast, hourly temperature chart, farming tips | **Open-Meteo** (live) |
| **AI Assistant** | Chat with quick-reply chips, typing indicator, persisted history | **simulated** keyword engine |
| **My Farms** | Add / edit / delete fields (crop, soil, area, sowing date) | localStorage |
| **History** | Timeline of all activity, filterable | localStorage |
| **Saved Reports** | View / delete / print saved diagnoses & advisories | localStorage |
| **Profile / Settings** | Edit profile; theme, language (EN/हिंदी), °C/°F, notifications, reset | localStorage |

### Cross-cutting
- 🌗 **Light / dark mode**, 🌐 **English / हिंदी** i18n, °C/°F units — all applied live and persisted.
- 📍 **Location picker** (Open-Meteo geocoding) updates weather & market globally.
- 🔔 Notifications, 🍞 toasts, 📱 fully responsive (sidebar → drawer, grids stack).
- 💾 All user data persists to `localStorage` (`agrismart.state.v1`).

## 🔌 Real vs. simulated (honest scope)

**Real, free, no key required:**
- **Open-Meteo** forecast + geocoding — live current conditions and 7-day forecast for any location.
- **data.gov.in** mandi prices — live commodity prices; falls back to curated sample data (with a visible "sample data" note) on error/CORS/rate-limit.

**Simulated (no free API exists) — and the UI says so:**
- Disease detection (deterministic pick from a curated knowledge base + confidence score).
- AI assistant (offline keyword/rule engine).
- Soil & crop advisories (rule-based over a small crop knowledge base).

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173).

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build
```

### Optional: data.gov.in API key
Market prices work out of the box with a public sample key. For higher limits, create a free key at [data.gov.in](https://data.gov.in) and add it:

```bash
cp .env.example .env
# then set VITE_DATA_GOV_API_KEY=your_key
```

## 🧰 Tech stack
- **React 18** + **Vite 5**
- **react-router-dom 6** — a real route per nav item
- **recharts** — weather & market trend charts (built per the dataviz guidelines: single-hue, thin marks, recessive grid, hover tooltips)
- **lucide-react** — icons
- Context + `useReducer` global store, persisted to `localStorage`
- Hand-authored CSS design system (`src/index.css` tokens + primitives, `src/styles/app.css` components) with light/dark themes

## 📁 Structure
```
src/
  main.jsx  App.jsx            # entry + router
  index.css  styles/app.css    # design tokens/primitives + components
  context/AppContext.jsx       # global store (localStorage-persisted)
  i18n/strings.js              # en/hi dictionary + useT()
  data/mockData.js             # seeds + crop/disease knowledge bases + fallbacks
  api/{weather,market}.js      # Open-Meteo + data.gov.in
  hooks/{useWeather,useMarketPrices}.js
  utils/{format,assistant}.js
  components/{layout,dashboard,common}/
  pages/                       # 12 routed pages
```

## 📝 Notes
- Simulated features are labelled in the UI so results are never mistaken for a certified diagnosis.
- Everything runs client-side; no backend or account required.
