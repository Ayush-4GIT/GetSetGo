import db from "../db/index.js";

export const getEntries = (req, res) => {
  try {
    const { date, from, to } = req.query;

    if (date) {
      // Return entries for specific date
      const rows = db
        .prepare(
          `SELECT e.*, a.type as activity_type, a.name as activity_name 
           FROM entries e 
           JOIN activities a ON e.activity_id = a.id 
           WHERE e.date = ?`
        )
        .all(date);

      const formatted = rows.map((r) => ({
        id: r.id,
        activityId: r.activity_id,
        activityName: r.activity_name,
        activityType: r.activity_type,
        date: r.date,
        value: r.value,
        updated_at: r.updated_at,
      }));

      return res.json(formatted);
    }

    if (from && to) {
      // Return entries for range [from, to]
      const rows = db
        .prepare(
          `SELECT e.*, a.type as activity_type, a.name as activity_name 
           FROM entries e 
           JOIN activities a ON e.activity_id = a.id 
           WHERE e.date >= ? AND e.date <= ? 
           ORDER BY e.date ASC`
        )
        .all(from, to);

      const formatted = rows.map((r) => ({
        id: r.id,
        activityId: r.activity_id,
        activityName: r.activity_name,
        activityType: r.activity_type,
        date: r.date,
        value: r.value,
        updated_at: r.updated_at,
      }));

      return res.json(formatted);
    }

    // Default: return all entries
    const rows = db
      .prepare(
        `SELECT e.*, a.type as activity_type, a.name as activity_name 
         FROM entries e 
         JOIN activities a ON e.activity_id = a.id 
         ORDER BY e.date DESC`
      )
      .all();

    const formatted = rows.map((r) => ({
      id: r.id,
      activityId: r.activity_id,
      activityName: r.activity_name,
      activityType: r.activity_type,
      date: r.date,
      value: r.value,
      updated_at: r.updated_at,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};

export const upsertEntry = (req, res) => {
  try {
    const { activityId, date, value } = req.body;

    if (!activityId || !date) {
      return res
        .status(400)
        .json({ error: "activityId and date (YYYY-MM-DD) are required." });
    }

    // Verify activity exists
    const activity = db
      .prepare("SELECT * FROM activities WHERE id = ?")
      .get(activityId);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Normalize value
    let stringValue = "";
    if (typeof value === "boolean") {
      stringValue = value ? "1" : "0";
    } else if (value !== null && value !== undefined) {
      stringValue = String(value);
    }

    const stmt = db.prepare(`
      INSERT INTO entries (activity_id, date, value, updated_at) 
      VALUES (?, ?, ?, CURRENT_TIMESTAMP) 
      ON CONFLICT(activity_id, date) 
      DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(activityId, date, stringValue);

    const saved = db
      .prepare(
        "SELECT * FROM entries WHERE activity_id = ? AND date = ?"
      )
      .get(activityId, date);

    res.json({
      id: saved.id,
      activityId: saved.activity_id,
      date: saved.date,
      value: saved.value,
      updated_at: saved.updated_at,
    });
  } catch (error) {
    console.error("Error upserting entry:", error);
    res.status(500).json({ error: "Failed to save entry" });
  }
};
