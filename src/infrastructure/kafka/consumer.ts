import { Consumer } from 'kafkajs';
import { kafka } from './kafka.client';
import { LogModel } from '../database/schemas/log.schema';

let consumer: Consumer;

/**
 * Connects the Consumer and starts listening to the topic.
 */
export const connectConsumer = async (): Promise<void> => {
  const groupId = process.env.KAFKA_GROUP_ID || 'log-processing-group';

  // Initialize Consumer
  consumer = kafka.consumer({ groupId });

  try {
    await consumer.connect();
    console.log('✅ Kafka Consumer connected');

    // Subscribe to Topic (from Beginning ensures we don't miss logs while developing)
    await consumer.subscribe({
      topic: 'user-activity-logs',
      fromBeginning: true,
    });

    // Run the Processing Loop
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString();
          if (!value) return;

          const logData = JSON.parse(value);

          // --- BUSINESS LOGIC: Save to Mongo ---
          console.log(`📥 Processing log for user: ${logData.userId}`);

          // Create and Save
          const newLog = new LogModel({
            ...logData,
            processedAt: new Date(), // Mark as processed
          });

          await newLog.save();
          console.log(`💾 Saved to MongoDB ID: ${newLog._id}`);
        } catch (error) {
          console.error('❌ Error processing message:', error);
        }
      },
    });
  } catch (error) {
    console.error('❌ Failed to start Consumer:', error);
  }
};
