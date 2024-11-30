import { createKafka } from "@/lib/kafkaProvider";
import PartitionService from "@/lib/partitionService";
import { validateRequest } from "@/lib/requestValidator";
import {
  ConsumerPayload,
  ConsumerResponse,
  PartitionedMessages,
} from "@/lib/types";
import { EachMessagePayload } from "kafkajs";
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
  const partitionService = new PartitionService([]);
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
        partitionService.processMessage(message, partition);
      },
    });

    // Simulate a delay to allow the consumer to process the message
    await new Promise((resolve) => setTimeout(resolve, 10000));

    res.status(200).json({
      status: createStatusSuccessfulMessage(
        partitionService.getPartitionedMessages()
      ),
      data: orderMessagesDesc(partitionService.getPartitionedMessages()),
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

function createStatusSuccessfulMessage(
  partitionedMessages: PartitionedMessages[]
): string {
  let resultMessage = `${new Date().toLocaleTimeString()}`;
  for (const partition of partitionedMessages) {
    resultMessage += ` | Partition ${partition.partition}: ${partition.messages.length} Messages`;
  }

  return resultMessage;
}

function orderMessagesDesc(
  partitionedMessages: PartitionedMessages[]
): PartitionedMessages[] {
  return partitionedMessages.map((partition) => {
    partition.messages = partition.messages.sort((a, b) => {
      return b.offset - a.offset;
    });
    return partition;
  });
}
