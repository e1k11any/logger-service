import { Producer } from "kafkajs";
import { kafka } from "./kafka.client";

/**
 * Holds the Kafka Producer instance.
 */
let producer: Producer;

/**
 * Connects the Producer to the Kafka broker.
 * @returns {Promise<void>}
 */
export const connectProducer = async (): Promise<void> => {
  try {
    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka Producer connected");
  } catch (error) {
    console.error("❌ Failed to connect Kafka Producer:", error);
    // We do not exit here, because the API can still work (just won't send logs)
    // or we might want to retry.
  }
};

/**
 * Sends a message to the specified Kafka topic.
 * @param {string} topic - The topic name (e.g., 'user-activity-logs').
 * @param {object} message - The JSON object to send.
 */
export const sendToKafka = async (
  topic: string,
  message: object
): Promise<void> => {
  if (!producer) {
    throw new Error("Producer is not connected");
  }

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};
