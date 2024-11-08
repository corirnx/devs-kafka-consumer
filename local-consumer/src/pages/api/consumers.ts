import { ConsumerResponse } from "@/lib/types";
import {
  EachBatchPayload,
  EachMessagePayload,
  IHeaders,
  Kafka,
  logLevel,
} from "kafkajs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    const resultObj: ConsumerResponse = {
      status: "Consume failed",
      data: [],
      error: "Method Not Allowed",
    };
    res.status(405).json(resultObj);
    return;
  }

  const { host, topic, consumerGroupId } = req.body;
  if (!host || !topic || !consumerGroupId) {
    const resultObj: ConsumerResponse = {
      status: "Bad Request: Missing required fields",
      data: [],
      error: "Invalid request",
    };
    return res.status(400).json(resultObj);
  }

  const messages: any[] = []; // Array to collect messages
  let consumer;

  try {
    const kafka = createKafka(host);

    consumer = kafka.consumer({ groupId: consumerGroupId as string });
    await consumer.connect();
    await consumer.subscribe({
      topic: topic,
      fromBeginning: true,
    });

    // await consumer.run({
    //   eachMessage: async ({
    //     topic,
    //     partition,
    //     message,
    //   }: EachMessagePayload) => {
    //     console.trace(topic, partition, message.timestamp);
    //     const consumedObject = JSON.parse(message.value!.toString());
    //     // Convert headers to human-readable format
    //     if (message.headers) {
    //       const header = extractMessageHeaders(message.headers);
    //       messages.push({
    //         header: header,
    //         message: consumedObject,
    //       });
    //     } else {
    //       messages.push({ message: consumedObject });
    //     }
    //   },
    // });

    await consumer.run({
      eachBatch: async ({ batch }: EachBatchPayload) => {
        for (const message of batch.messages) {
          const consumedObject = JSON.parse(message.value!.toString());
          if (message.headers) {
            const header = extractMessageHeaders(message.headers);
            messages.push({ header: header, message: consumedObject });
          } else {
            messages.push({ message: consumedObject });
          }
        }
      },
    });

    // Simulate a delay to allow the consumer to process the message
    await new Promise((resolve) => setTimeout(resolve, 10000));

    const resultObj: ConsumerResponse = {
      status: `${new Date().toLocaleTimeString()} | ${
        messages.length
      } Messages consumed.`,
      data: messages.slice(0, 10),
      error: "",
    };
    res.status(200).json(resultObj);
  } catch (e: any) {
    const resultObj: ConsumerResponse = {
      status: "Failed to consume messages",
      data: [],
      error: e.message,
    };
    res.status(500).json(resultObj);
  } finally {
    try {
      if (consumer) {
        await consumer.disconnect();
      }
    } catch (disconnectError) {
      console.error("Error disconnecting consumer:", disconnectError);
    }
  }
}

function extractMessageHeaders(headers: IHeaders): Record<string, string> {
  const humanReadableHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    humanReadableHeaders[key] = value!.toString();
  }
  //console.trace("Headers:", humanReadableHeaders);
  return humanReadableHeaders;
}

export function createKafka(host: string): Kafka {
  const username = process.env.KAFKA_USERNAME || "";
  const password = process.env.KAFKA_PASSWORD || "";
  const brokers = host.split(",") || [];

  const kafka = new Kafka({
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

  return kafka;
}
