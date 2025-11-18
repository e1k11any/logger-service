import { Router } from "express";
import { createLog } from "../controllers/log.controller";

const router = Router();

// POST /api/v1/logs
router.post("/logs", createLog);

export default router;
