import { LogEntity } from '../entities/log.entity';

export interface LogFilterParams {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}

export interface ILogRepository {
  findLogs(
    filters: LogFilterParams
  ): Promise<{ logs: LogEntity[]; total: number }>;
}
