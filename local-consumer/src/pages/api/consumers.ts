import { createKafka } from "@/lib/kafkaProvider";
import { validateRequest } from "@/lib/requestValidator";
import {
  ConsumedMessage as CollectedMessage,
  ConsumerPayload,
  ConsumerResponse,
} from "@/lib/types";
import { EachMessagePayload, IHeaders, KafkaMessage } from "kafkajs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res = validateRequest(req, res);
  if (res.statusCode !== 200) {
    return;
  }
  await consumeMessages(req.body as ConsumerPayload, res);
}

async function consumeMessages(payload: ConsumerPayload, res: NextApiResponse) {
  const collectedMessages: CollectedMessage[] = [];
  let consumer;

  try {
    const kafka = createKafka(payload.host);
    consumer = kafka.consumer({ groupId: payload.consumerGroupId as string });

    await consumer.connect();
    await consumer.subscribe({
      topic: payload.topic,
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        //console.trace(topic, partition, message.timestamp);
        handleMessage(collectedMessages, message);
      },
    });

    // Simulate a delay to allow the consumer to process the message
    await new Promise((resolve) => setTimeout(resolve, 10000));

    res.status(200).json({
      status: `${new Date().toLocaleTimeString()} | ${
        collectedMessages.length
      } Messages consumed.`,
      data: collectedMessages,
      error: "",
    } as ConsumerResponse);
  } catch (e: any) {
    res.status(500).json({
      status: "Failed to consume messages",
      data: [],
      error: e.message,
    } as ConsumerResponse);
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
  // Convert headers to human-readable format
  for (const [key, value] of Object.entries(headers)) {
    humanReadableHeaders[key] = value!.toString();
  }
  return humanReadableHeaders;
}

export function handleMessage(
  collectedMessages: CollectedMessage[],
  message: KafkaMessage
): CollectedMessage[] {
  const consumedMessage = JSON.parse(message.value!.toString());
  ensureLatestMessage(collectedMessages, consumedMessage);

  if (message.headers) {
    const header = extractMessageHeaders(message.headers);
    collectedMessages.push({
      header: header,
      message: consumedMessage,
    } as CollectedMessage);
  } else {
    collectedMessages.push({ message: consumedMessage } as CollectedMessage);
  }

  return collectedMessages;
}

export function ensureLatestMessage(
  collectedMessages: CollectedMessage[],
  consumedMessage: Record<string, unknown>
) {
  const index = collectedMessages.findIndex(
    (msg) => JSON.stringify(msg.message) === JSON.stringify(consumedMessage)
  );

  if (index !== -1) {
    collectedMessages.splice(index, 1);
  }

  return collectedMessages;
}
