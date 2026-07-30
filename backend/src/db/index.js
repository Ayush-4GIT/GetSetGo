import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import fileDir from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, "../../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "tracker.db");
const db = new Database(dbPath);

// Enable foreign keys & WAL mode for performance
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('yesno', 'numeric')),
    unit TEXT,
    archived INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    UNIQUE(activity_id, date)
  );
`);

// Seed default activities if empty
const count = db.prepare("SELECT COUNT(*) AS total FROM activities").get();
if (count.total === 0) {
  const insertStmt = db.prepare(
    "INSERT INTO activities (name, type, unit, order_index) VALUES (?, ?, ?, ?)"
  );
  const seedData = [
    { name: "Morning Workout", type: "yesno", unit: null, order: 0 },
    { name: "Water Intake", type: "numeric", unit: "L", order: 1 },
    { name: "Daily Reading", type: "numeric", unit: "mins", order: 2 },
    { name: "8 Hours Sleep", type: "yesno", unit: null, order: 3 },
  ];

  const seedTx = db.transaction((activities) => {
    for (const item of activities) {
      insertStmt.run(item.name, item.type, item.unit, item.order);
    }
  });

  seedTx(seedData);
  console.log("Seeded initial default activities.");
}

export default db;
