import { Kafka, logLevel } from "kafkajs";

export function createKafka(host: string): Kafka {
  const username = process.env.KAFKA_USERNAME || "";
  const password = process.env.KAFKA_PASSWORD || "";
  const brokers = host.split(",") || [];

  return new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: brokers,
    logLevel: logLevel.INFO,
    sasl: {
      mechanism: "plain",
      username: username,
      password: password,
    },
    ssl: true,
    connectionTimeout: 30000,
  });
}
