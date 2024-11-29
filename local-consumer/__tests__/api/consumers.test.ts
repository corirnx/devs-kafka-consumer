import { ConsumedMessage } from "@/lib/types";
import handler, {
  ensureLatestMessage,
  extractMessageKey,
} from "@/pages/api/consumers";
import { Kafka } from "kafkajs";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

// Set environment variables
process.env.KAFKA_USERNAME = "test-username";
process.env.KAFKA_PASSWORD = "test-password";
process.env.KAFKA_CLIENT_ID = "test-client-id";

// Mock the Kafka library
jest.mock("kafkajs", () => {
  const mKafka = {
    consumer: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
      disconnect: jest.fn(),
    }),
  };
  return { Kafka: jest.fn(() => mKafka), logLevel: { INFO: 1 } };
});

jest.setTimeout(30000); // 30 sec.

describe("Consumer Handler", () => {
  it("should handle errors and return 500", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        host: "localhost:9092",
        topic: "test-topic",
        consumerGroupId: "test-group",
      },
    });

    // Mock the Kafka constructor to throw an error
    jest.mocked(Kafka).mockImplementation(() => {
      throw new Error("Kafka error");
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      status: "Failed to consume messages",
      data: [],
      error: "Kafka error",
    });
  });
});

describe("ensureLatestMessage", () => {
  it("should update the existing message if the new message has a later timestamp", () => {
    const collectedMessages: ConsumedMessage[] = [
      {
        key: "key1",
        timestamp: 1000,
        message: { key: "key1", timestamp: 1000 },
        offset: 1,
        header: undefined,
        size: undefined,
      } as ConsumedMessage,
    ];
    const consumedMessage = {
      key: "key1",
      timestamp: 2000,
      message: { key: "key1", timestamp: 2000 },
      offset: 1,
      header: undefined,
      size: undefined,
    } as ConsumedMessage;

    const result = ensureLatestMessage(collectedMessages, consumedMessage);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(consumedMessage);
  });

  it("should not update the existing message if the new message has an earlier timestamp", () => {
    const collectedMessages: ConsumedMessage[] = [
      {
        key: "key1",
        timestamp: 2000,
        message: { key: "key1", timestamp: 2000 },
        offset: 2,
        header: undefined,
        size: undefined,
      } as ConsumedMessage,
    ];
    const consumedMessage = {
      key: "key1",
      timestamp: 1000,
      message: { key: "key1", timestamp: 1000 },
      offset: 1,
      header: undefined,
      size: undefined,
    } as ConsumedMessage;

    const result = ensureLatestMessage(collectedMessages, consumedMessage);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(collectedMessages[0]);
  });

  it("should add a new message if the message key does not exist in the collected messages", () => {
    const collectedMessages: ConsumedMessage[] = [
      {
        key: "key1",
        timestamp: 1000,
        message: { key: "key1", timestamp: 1000 },
        offset: 1,
        header: undefined,
        size: undefined,
      } as ConsumedMessage,
    ];
    const consumedMessage = {
      key: "key2",
      timestamp: 2000,
      message: { key: "key2", timestamp: 2000 },
      offset: 2,
      header: undefined,
      size: undefined,
    } as ConsumedMessage;

    const result = ensureLatestMessage(collectedMessages, consumedMessage);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(consumedMessage);
  });
});

describe("Handle consumed messages", () => {
  it("should extract message key", () => {
    const value = "21de2c33-51a6-41f7-a76c-f0f7c002533d";
    const messageKey: Buffer = Buffer.from(value);

    const extracted = extractMessageKey(messageKey);
    expect(extracted).toBe(value);
  });

  it("should no extract non existing message key", () => {
    const messageKey = null;

    const extracted = extractMessageKey(messageKey);
    expect(extracted).toBe("");
  });
});
