import db from "../db/index.js";

export const getActivities = (req, res) => {
  try {
    const includeArchived = req.query.includeArchived === "true";
    let query = "SELECT * FROM activities";
    if (!includeArchived) {
      query += " WHERE archived = 0";
    }
    query += " ORDER BY order_index ASC, id ASC";

    const rows = db.prepare(query).all();
    const formatted = rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      unit: r.unit,
      archived: Boolean(r.archived),
      order: r.order_index,
      created_at: r.created_at,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};

export const createActivity = (req, res) => {
  try {
    const { name, type, unit } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Activity name is required." });
    }

    if (!type || !["yesno", "numeric"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Type must be either 'yesno' or 'numeric'." });
    }

    const maxOrderRow = db
      .prepare("SELECT MAX(order_index) as max_order FROM activities")
      .get();
    const nextOrder = (maxOrderRow?.max_order ?? -1) + 1;

    const result = db
      .prepare(
        "INSERT INTO activities (name, type, unit, order_index) VALUES (?, ?, ?, ?)"
      )
      .run(name.trim(), type, type === "numeric" ? unit || null : null, nextOrder);

    const created = db
      .prepare("SELECT * FROM activities WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({
      id: created.id,
      name: created.name,
      type: created.type,
      unit: created.unit,
      archived: Boolean(created.archived),
      order: created.order_index,
      created_at: created.created_at,
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ error: "Failed to create activity" });
  }
};

export const updateActivity = (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, order, archived } = req.body;

    const existing = db
      .prepare("SELECT * FROM activities WHERE id = ?")
      .get(id);

    if (!existing) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const newName = name !== undefined ? String(name).trim() : existing.name;
    const newUnit =
      existing.type === "numeric"
        ? unit !== undefined
          ? unit
          : existing.unit
        : null;
    const newOrder = order !== undefined ? Number(order) : existing.order_index;
    const newArchived =
      archived !== undefined ? (archived ? 1 : 0) : existing.archived;

    db.prepare(
      "UPDATE activities SET name = ?, unit = ?, order_index = ?, archived = ? WHERE id = ?"
    ).run(newName, newUnit, newOrder, newArchived, id);

    const updated = db
      .prepare("SELECT * FROM activities WHERE id = ?")
      .get(id);

    res.json({
      id: updated.id,
      name: updated.name,
      type: updated.type,
      unit: updated.unit,
      archived: Boolean(updated.archived),
      order: updated.order_index,
      created_at: updated.created_at,
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ error: "Failed to update activity" });
  }
};

export const deleteActivity = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db
      .prepare("SELECT * FROM activities WHERE id = ?")
      .get(id);

    if (!existing) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Soft delete (archive)
    db.prepare("UPDATE activities SET archived = 1 WHERE id = ?").run(id);

    res.json({ message: "Activity archived successfully", id: Number(id) });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ error: "Failed to delete activity" });
  }
};
