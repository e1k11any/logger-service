import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

export default app;
