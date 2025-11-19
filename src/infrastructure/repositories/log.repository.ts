import {
  ILogRepository,
  LogFilterParams,
} from '../../domain/repositories/log.repository.interface';
import { LogModel } from '../database/schemas/log.schema';
import { LogEntity } from '../../domain/entities/log.entity';

export class MongoLogRepository implements ILogRepository {
  async findLogs(
    params: LogFilterParams
  ): Promise<{ logs: LogEntity[]; total: number }> {
    const { userId, startDate, endDate, page, limit } = params;
    const query: any = {};

    // Build Query
    if (userId) query.userId = userId;

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    // Execute Query with Pagination
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      LogModel.find(query)
        .sort({ timestamp: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .lean<LogEntity[]>(), // .lean() is faster for read-only
      LogModel.countDocuments(query),
    ]);

    return { logs, total };
  }
}
