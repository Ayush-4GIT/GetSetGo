import { Router } from "express";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activitiesController.js";

const router = Router();

router.get("/", getActivities);
router.post("/", createActivity);
router.patch("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;
