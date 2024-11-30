import { Kafka, logLevel } from "kafkajs";

const DEFAULT_VALUE = "";
const CONNECTION_TIMEOUT = 30000;
const SASL_MECHANISM = "plain";

/**
 * Creates a Kafka instance with the given host.
 * @param host - A comma-separated list of Kafka broker addresses.
 * @returns A configured Kafka instance.
 */
export function createKafka(host: string): Kafka {
  const username = process.env.KAFKA_USERNAME || DEFAULT_VALUE;
  const password = process.env.KAFKA_PASSWORD || DEFAULT_VALUE;
  const brokers = host.split(",") || [];

  return new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: brokers,
    logLevel: logLevel.INFO,
    sasl: {
      mechanism: SASL_MECHANISM,
      username: username,
      password: password,
    },
    ssl: true,
    connectionTimeout: CONNECTION_TIMEOUT,
  });
}
