# Frontend — React

The frontend is a single-page React app (Vite) with three main views: **Today**, **Manage Activities**, and **Progress**.

## Tech Stack

- React 18 + Vite
- React Router (view navigation)
- Recharts (pie / line / bar charts)
- Fetch API / Axios for HTTP calls to the Express backend
- Plain CSS or a lightweight utility layer (no heavy UI framework needed)

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── api/
    │   └── client.js          # fetch wrapper, reads VITE_API_URL
    ├── context/
    │   └── ActivitiesContext.jsx  # shared activities + entries state
    ├── views/
    │   ├── TodayView.jsx
    │   ├── ManageActivitiesView.jsx
    │   └── ProgressView.jsx
    ├── components/
    │   ├── NavBar.jsx
    │   ├── ActivityInput.jsx       # renders Yes/No toggle or numeric field
    │   ├── ActivityForm.jsx        # add/edit activity modal or panel
    │   ├── ActivityListItem.jsx
    │   ├── DateRangePicker.jsx
    │   ├── PieCompletionChart.jsx
    │   └── NumericTrendChart.jsx
    └── styles/
        └── index.css
```

## Views

### 1. Today (`/`)
- Fetches active activities + today's entries on load.
- Renders one `ActivityInput` per activity:
  - **Yes/No** → segmented toggle (Yes / No / not logged).
  - **Numeric** → number input with unit suffix label.
- Each input change calls `PUT /api/entries` (upsert) — autosave, debounced ~500ms for numeric fields.
- Date navigator (← Today →) to view/edit past days; reuses the same view with a `date` param.

### 2. Manage Activities (`/activities`)
- Lists all activities (active + archived) via `ActivityListItem`.
- "Add Activity" opens `ActivityForm`: name, type (Yes/No | Numeric), unit (if numeric).
- Edit/archive/delete actions per item, calling the corresponding backend routes.
- Reordering (optional): drag handle, persists an `order` field.

### 3. Progress (`/progress`)
- `DateRangePicker`: presets (Last 7 days, Last 30 days, This Month) + custom range.
- For each **Yes/No** activity → `PieCompletionChart` (done vs. missed %) + streak stats.
- For each **Numeric** activity → `NumericTrendChart` (line/bar of daily values) + avg/min/max/total.
- Summary card at top: total check-ins, most/least consistent activity.

## State Management

- `ActivitiesContext` holds the activity list and current view's entries; avoids prop-drilling across views.
- Local component state for form inputs and date range selection.
- No Redux needed at this scale — Context + hooks is sufficient.

## API Calls (from frontend)

| Action | Endpoint |
|---|---|
| Get activities | `GET /api/activities` |
| Create activity | `POST /api/activities` |
| Update activity | `PATCH /api/activities/:id` |
| Archive/delete activity | `DELETE /api/activities/:id` |
| Get entries for a date | `GET /api/entries?date=YYYY-MM-DD` |
| Upsert an entry | `PUT /api/entries` |
| Get entries for a range (for charts) | `GET /api/entries?from=...&to=...` |

See [`backend.md`](./backend.md) for full request/response shapes.

## Setup

```bash
cd frontend
npm install
npm run dev
```

`.env`:
```
VITE_API_URL=http://localhost:4000/api
```

## Build

```bash
npm run build   # outputs to frontend/dist
npm run preview
```