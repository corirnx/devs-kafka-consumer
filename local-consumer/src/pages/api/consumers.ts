import { createKafka } from "@/lib/kafkaProvider";
import { validateRequest } from "@/lib/requestValidator";
import {
  ConsumedMessage,
  ConsumerPayload,
  ConsumerResponse,
  PartitionedMessages,
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
  const partitionedMessages: PartitionedMessages[] = [];
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
        handleMessage(partitionedMessages, message, partition);
      },
    });

    // Simulate a delay to allow the consumer to process the message
    await new Promise((resolve) => setTimeout(resolve, 10000));

    res.status(200).json({
      status: `${new Date().toLocaleTimeString()} | ${
        partitionedMessages.length
      } Messages consumed.`,
      data: partitionedMessages,
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
  partitionedMessages: PartitionedMessages[],
  message: KafkaMessage,
  partition: number
): PartitionedMessages[] {
  const consumedValue = JSON.parse(message.value!.toString());
  const consumedMesssage = {
    header: extractMessageHeaders(message.headers),
    message: consumedValue,
    key: extractMessageKey(message.key),
    offset: Number(message.offset),
    timestamp: Number(message.timestamp),
    size: message.size,
    partition,
  } as ConsumedMessage;

  handleConsumedMessage(partitionedMessages, consumedMesssage);

  return partitionedMessages;
}

export function extractMessageKey(key: Buffer | null): string {
  let value = "";
  try {
    value = key!.toString("utf8");
  } catch (e) {
    console.log(e);
  }
  return value;
}

export function handleConsumedMessage(
  partitionedMessages: PartitionedMessages[],
  consumedMessage: ConsumedMessage
) {
  const partitionIndex = partitionedMessages.findIndex(
    (prt) => prt.partition === consumedMessage.partition
  );

  if (isIndexExisting(partitionIndex) === false) {
    return addMessageToNewPartition(consumedMessage, partitionedMessages);
  }

  const existingMessages = partitionedMessages[partitionIndex].data;
  const index = existingMessages.findLastIndex(
    (msg) => msg.key === consumedMessage.key
  );

  if (isIndexExisting(index) === false) {
    return addNewMessage(consumedMessage, partitionedMessages, partitionIndex);
  }

  const existingMessage = existingMessages[index];
  partitionedMessages = handleExistingMessage(
    partitionedMessages,
    existingMessages,
    consumedMessage,
    existingMessage,
    partitionIndex
  );

  return partitionedMessages;
}

function isIndexExisting(index: number): boolean {
  return index !== -1;
}

function handleExistingMessage(
  partitionedMessages: PartitionedMessages[],
  collectedMessages: ConsumedMessage[],
  consumedMessage: ConsumedMessage,
  existingMessage: ConsumedMessage,
  partitionIndex: number
): PartitionedMessages[] {
  if (isLatestMessage(consumedMessage, existingMessage) === false) {
    return partitionedMessages;
  }

  const reducesMessages = collectedMessages.filter(
    (msg) => msg.key !== consumedMessage.key
  );
  reducesMessages.push(consumedMessage);
  partitionedMessages[partitionIndex].data = reducesMessages;
  return partitionedMessages;
}

function isLatestMessage(
  consumedMessage: ConsumedMessage,
  existingMessage: ConsumedMessage
): boolean {
  return (
    consumedMessage.timestamp > existingMessage.timestamp ||
    consumedMessage.offset > existingMessage.offset
  );
}

function addMessageToNewPartition(
  consumedMessage: ConsumedMessage,
  partitionedMessages: PartitionedMessages[]
): PartitionedMessages[] {
  const partitionMessages: PartitionedMessages = {
    partition: consumedMessage.partition,
    data: [consumedMessage],
  };
  partitionedMessages.push(partitionMessages);
  return partitionedMessages;
}

function addNewMessage(
  consumedMessage: ConsumedMessage,
  partitionedMessages: PartitionedMessages[],
  partitionIndex: number
): PartitionedMessages[] {
  partitionedMessages[partitionIndex].data.push(consumedMessage);
  return partitionedMessages;
}
