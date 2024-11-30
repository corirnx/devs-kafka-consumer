import { ConsumedMessage } from "./types";
import { IHeaders, KafkaMessage } from "kafkajs";

/**
 * Creates a consumed message from a Kafka message.
 * @param message - The Kafka message.
 * @param partition - The partition number.
 * @returns A consumed message.
 */
export function createConsumedMessage(
  message: KafkaMessage,
  partition: number
): ConsumedMessage {
  const consumedValue = message.value ? JSON.parse(message.value.toString()) : {};
  const consumedMesssage = {
    header: extractMessageHeaders(message.headers),
    message: consumedValue,
    key: extractMessageKey(message.key),
    offset: Number(message.offset),
    timestamp: Number(message.timestamp),
    size: message.size,
    partition,
  } as ConsumedMessage;

  return consumedMesssage;
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

function extractMessageKey(key: Buffer | null): string {
  try {
    return key?.toString("utf8") || "";
  } catch (e) {
    console.log(e);
    return "";
  }
}
