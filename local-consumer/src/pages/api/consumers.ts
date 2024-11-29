import { createKafka } from "@/lib/kafkaProvider";
import { validateRequest } from "@/lib/requestValidator";
import {
  ConsumedMessage,
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
  const collectedMessages: ConsumedMessage[] = [];
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
        //console.log(topic, partition, message.timestamp);
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

function extractMessageHeaders(
  headers: IHeaders | undefined
): Record<string, string> {
  const humanReadableHeaders: Record<string, string> = {};
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      humanReadableHeaders[key] = value!.toString();
    }
  }
  return humanReadableHeaders;
}

export function handleMessage(
  collectedMessages: ConsumedMessage[],
  message: KafkaMessage
): ConsumedMessage[] {
  const consumedMessage = JSON.parse(message.value!.toString());
  try {
    console.log(message.key);
    const keyString = message.key!.toString("utf8");
    console.log(keyString);
  } catch (e) {
    console.log(message.key);
    console.log(e);
  }

  ensureLatestMessage(collectedMessages, consumedMessage);

  collectedMessages.push({
    header: extractMessageHeaders(message.headers),
    message: consumedMessage,
    key: extractMessageKey(message.key),
    offset: Number(message.offset),
    timestamp: Number(message.timestamp),
    size: message.size,
  } as ConsumedMessage);

  return collectedMessages;
}

export function extractMessageKey(key: Buffer | null): string {
  return key ? key.toString("utf8") : "";
}

export function ensureLatestMessage(
  collectedMessages: ConsumedMessage[],
  consumedMessage: ConsumedMessage
) {
  const consumedMessageKey = consumedMessage.key;
  const consumedMessageTimestamp = consumedMessage.timestamp;

  const index = collectedMessages.findIndex(
    (msg) => msg.message.key === consumedMessageKey
  );

  if (index !== -1) {
    const existingMessageTimestamp = collectedMessages[index].message.timestamp;
    if (consumedMessageTimestamp > Number(existingMessageTimestamp)) {
      collectedMessages[index] = consumedMessage as ConsumedMessage;
    }
  } else {
    collectedMessages.push(consumedMessage);
  }

  return collectedMessages;
}
