import { Router } from "express";
import { getEntries, upsertEntry } from "../controllers/entriesController.js";

const router = Router();

router.get("/", getEntries);
router.put("/", upsertEntry);

export default router;
