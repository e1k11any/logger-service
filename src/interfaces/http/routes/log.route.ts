import { Router } from 'express';
import { createLog, getLogs } from '../controllers/log.controller';

const router = Router();

// POST /api/v1/logs
router.post('/logs', createLog);

// GET /api/v1/logs
router.get('/logs', getLogs);

export default router;
