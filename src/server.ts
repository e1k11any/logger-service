import app from './app';
import dotenv from 'dotenv';
import { connectToMongoDB } from './infrastructure/database/mongo';
import { verifyKafkaConfig } from './infrastructure/kafka/kafka.client';
import { connectProducer } from './infrastructure/kafka/producer';
import { connectConsumer } from './infrastructure/kafka/consumer';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Initialize Infrastructure
  await connectToMongoDB();

  // Verify Kafka Configuration
  verifyKafkaConfig();

  await connectProducer();
  await connectConsumer();

  // Start HTTP Server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // Graceful Shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
};

startServer();
