import { ConsumedMessage } from "./types";
import { IHeaders, KafkaMessage } from "kafkajs";

export function createConsumedMessage(
  message: KafkaMessage,
  partition: number
): ConsumedMessage {
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
