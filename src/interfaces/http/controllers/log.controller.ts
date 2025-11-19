import { Request, Response } from 'express';
import { sendToKafka } from '../../../infrastructure/kafka/producer';
import { MongoLogRepository } from '../../../infrastructure/repositories/log.repository';

// Dependency Injection (Simple version for this task)
const logRepository = new MongoLogRepository();

/**
 * HTTP Controller to handle log ingestion.
 * Receives a log, validates it, and pushes to Kafka.
 */
export const createLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, action, meta } = req.body;

    // Simple Validation
    if (!userId || !action) {
      res
        .status(400)
        .json({ error: 'Missing required fields: userId, action' });
      return;
    }

    // Construct the Log Event
    const logEvent = {
      userId,
      action,
      meta: meta || {},
      timestamp: new Date().toISOString(),
    };

    // Send to Kafka (Topic name from ENV or hardcoded for simplicity)
    await sendToKafka('user-activity-logs', logEvent);

    // Return Success (202 Accepted - because we are processing it async)
    res.status(202).json({
      message: 'Log received and queued for processing',
      data: logEvent,
    });
  } catch (error) {
    console.error('Error in createLog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * GET /api/v1/logs
 * Fetch logs with filters and pagination.
 */
export const getLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parse Query Params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query.userId as string;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    // Call Repository
    const result = await logRepository.findLogs({
      page,
      limit,
      userId,
      startDate,
      endDate,
    });

    // Return Response
    res.status(200).json({
      data: result.logs,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    console.error('Error getting logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
