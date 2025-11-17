import { Kafka, logLevel } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const brokers = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");
const clientId = process.env.KAFKA_CLIENT_ID || "eyego-logger-service";

/**
 * Singleton Kafka client instance configured with environment variables.
 * Retries connection up to 8 times before failing.
 */
export const kafka = new Kafka({
  clientId,
  brokers,
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

/**
 * Verifies and logs the loaded Kafka configuration to the console.
 * Useful for debugging connectivity issues during startup.
 */
export const verifyKafkaConfig = (): void => {
  console.log(`🔌 Kafka Client configured for brokers: ${brokers.join(", ")}`);
};
