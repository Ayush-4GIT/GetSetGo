# Daily Tracker

A personal daily habit tracker. Log check-ins for activities like waking up, workouts, water intake, reading, and sleep — each as a Yes/No or numeric value — and review your consistency over time with charts.

See [PRD](./daily-tracker-prd.md) for full product requirements.

## Project Structure

```
daily-tracker/
├── frontend/          # React app (see frontend.md)
├── backend/           # Express API (see backend.md)
├── README.md
├── frontend.md
└── backend.md
```

## Stack

- **Frontend:** React (Vite), Recharts for graphs
- **Backend:** Node.js + Express, REST API
- **Database:** SQLite (file-based, no external DB service needed for a personal single-user app) — swappable for Postgres later

## Core Features

- Daily check-in for a customizable list of activities
- Yes/No or numeric input per activity
- Edit/add/remove/archive activities at any time
- Progress dashboard: pie charts (Yes/No completion) and line/bar charts (numeric trends) over a selectable date range

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone & install

```bash
git clone <your-repo-url>
cd daily-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:4000` by default.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default and proxies API calls to the backend.

## Environment Variables

**backend/.env**
```
PORT=4000
DATABASE_URL=./data/tracker.db
```

**frontend/.env**
```
VITE_API_URL=http://localhost:4000/api
```

## Documentation

- [`frontend.md`](./frontend.md) — React app structure, components, state, and setup
- [`backend.md`](./backend.md) — Express API structure, routes, and data model

