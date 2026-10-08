# TRAFFIX — Predictive Traffic Decision Assistant

> **“Don’t just see traffic. See what’s coming. Know what to do.”**

Traffix is a full-stack predictive traffic decision intelligence platform designed to eliminate wasted commute time by modeling downstream congestion shockwaves before you depart.

---

## 🌟 Core Pillars

1. **PREDICT**: What is likely to happen to traffic velocity and congestion over the next 15–60 minutes?
2. **PROPAGATE**: Where will congestion spread across connected road network junctions?
3. **RECOMMEND**: Which route delivers the lowest risk profile and what is the optimal departure window?

---

## 🚀 Key Features & 10 Dedicated Screens

- **Screen 1 — Home (`/`)**: Ambient greeting, live area status, destination input, and upcoming journey quick prediction.
- **Screen 2 — Plan Journey (`/plan`)**: Departure timing, multi-objective preferences, and animated 7-step prediction sequence.
- **Screen 3 — Route Comparison (`/routes`)**: Route B (Recommended, 38m, Low Risk, Save 14m) vs Route C vs Route A, with embedded **Departure Optimizer** (Now 35m, +15 39m, +30 52m, Save 17m).
- **Screen 4 — Map (`/map`)**: Signature 3D urban traffic canvas with 4 modes (`LIVE`, `FORECAST`, `ROUTES`, `PROPAGATION`), road inspection, and particle flow.
- **Screen 5 — Live Traffic (`/live`)**: Current arterial states (Anna Salai, Avinashi Rd, Outer Ring Rd, Trichy Rd, Lakshmi Mills) and telemetry cards.
- **Screen 6 — Future Traffic (`/forecast`)**: Interactive time scrubber (0, 15, 30, 45, 60 min) synchronizing timeline, speed curves, and maps.
- **Screen 7 — Congestion Propagation (`/propagation`)**: Directed transmission graph modeling the 3.2 km corridor shockwave.
- **Screen 8 — Traffic Risk (`/risk`)**: 87 / 100 High Risk diagnostic breakdown with interactive telemetry accordion.
- **Screen 9 — Trip Monitoring (`/trip`)**: Live navigation HUD with dynamic anomaly simulation and seamless rerouting.
- **Screen 10 — You (`/you`)**: Saved places, alert preferences, and data provider information.
- **Notification System**: Top-right bell with unread pulse triggering a high-craft bottom sheet recommendation modal.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Glassmorphic Design System, Cyberpunk atmospheric grid
- **Motion**: Framer Motion, Canvas Particle System, Custom Cursor
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.14)
- **Data Models**: Pydantic v2, SQLAlchemy, SQLite fallback
- **Engines**:
  - Shockwave Congestion Propagation Engine (NetworkX Directed Graph)
  - Multi-Objective Route Recommendation Engine
  - Departure Window Optimizer
  - Multi-Vector Risk Engine (87/100)
- **Providers**: Abstracted interfaces (`TrafficProvider`, `WeatherProvider`, `EventsProvider`, `RoutingProvider`, `ForecastProvider`)

---

## ⚡ Quick Start

### 1. Start the Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API runs on `http://localhost:8000`. Swagger documentation available at `http://localhost:8000/docs`.

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.
