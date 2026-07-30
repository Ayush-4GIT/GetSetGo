# Backend — Express

A small REST API serving activities and daily entries, backed by SQLite (file-based — no external DB server needed for personal use).

## Tech Stack

- Node.js + Express
- SQLite (via `better-sqlite3`) — swap for Postgres later if multi-device sync is added
- `cors`, `dotenv`, `express.json()`

## Project Structure

```
backend/
├── package.json
├── .env
├── data/
│   └── tracker.db              # SQLite file (gitignored)
└── src/
    ├── server.js                # app entry, middleware, mounts routes
    ├── db/
    │   ├── index.js              # db connection + init
    │   └── migrations.sql        # table definitions
    ├── routes/
    │   ├── activities.js
    │   └── entries.js
    ├── controllers/
    │   ├── activitiesController.js
    │   └── entriesController.js
    └── models/
        ├── Activity.js
        └── Entry.js
```

## Data Model

### `activities` table
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | |
| type | TEXT | `"yesno"` or `"numeric"` |
| unit | TEXT | nullable, only for numeric |
| archived | BOOLEAN | default false |
| order_index | INTEGER | for custom ordering |
| created_at | DATETIME | |

### `entries` table
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| activity_id | INTEGER FK → activities.id | |
| date | TEXT | `"YYYY-MM-DD"` |
| value | TEXT | stores `"1"/"0"` for yesno, numeric string for numeric |
| updated_at | DATETIME | |

Unique constraint on `(activity_id, date)` — one entry per activity per day, upserted.

## API Endpoints

### Activities

**`GET /api/activities`**
Query param `includeArchived=true` optional.
```json
[
  { "id": 1, "name": "Workout", "type": "yesno", "unit": null, "archived": false, "order": 0 }
]
```

**`POST /api/activities`**
```json
{ "name": "Reading", "type": "numeric", "unit": "min" }
```

**`PATCH /api/activities/:id`**
```json
{ "name": "Reading Time", "unit": "pages" }
```

**`DELETE /api/activities/:id`**
Soft-deletes by setting `archived = true` (entries are preserved).

### Entries

**`GET /api/entries?date=2026-07-30`**
Returns all entries for that date, one per active activity.

**`GET /api/entries?from=2026-07-01&to=2026-07-30`**
Returns all entries in the range, for the Progress dashboard charts.

**`PUT /api/entries`**
Upsert (create or update) a single entry.
```json
{ "activityId": 3, "date": "2026-07-30", "value": true }
```
or
```json
{ "activityId": 4, "date": "2026-07-30", "value": 8 }
```

## Example: `server.js`

```js
import express from "express";
import cors from "cors";
import activitiesRouter from "./routes/activities.js";
import entriesRouter from "./routes/entries.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/activities", activitiesRouter);
app.use("/api/entries", entriesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
```

## Setup

```bash
cd backend
npm install
npm run dev   # nodemon src/server.js
```

`.env`:
```
PORT=4000
DATABASE_URL=./data/tracker.db
```

## Error Handling

- 400 for malformed input (missing name/type, invalid date format).
- 404 for unknown activity/entry id.
- 409 on duplicate active activity name (optional constraint).
- All errors return `{ "error": "message" }` with an appropriate status code.