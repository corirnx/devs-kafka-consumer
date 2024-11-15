import { ConsumedMessage } from "@/lib/types";
import handler, { ensureLatestMessage } from "@/pages/api/consumers";
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

describe("Handle consumed messages", () => {
  it("should remove the existing message if it exists", () => {
    const collectedMessages: ConsumedMessage[] = [
      { message: { key1: "value1", key2: "value2" } },
      { message: { key1: "value3", key2: "value4" } },
    ];
    const consumedMessage = { key1: "value1", key2: "value2" };

    ensureLatestMessage(collectedMessages, consumedMessage);

    expect(collectedMessages).toHaveLength(1);
    expect(collectedMessages).not.toContainEqual({ message: consumedMessage });
  });

  it("should not remove any message if it does not exist", () => {
    const collectedMessages: ConsumedMessage[] = [
      { message: { key1: "value1", key2: "value2" } },
      { message: { key1: "value3", key2: "value4" } },
    ];
    const consumedMessage = { key1: "value5", key2: "value6" };

    ensureLatestMessage(collectedMessages, consumedMessage);

    expect(collectedMessages).toHaveLength(2);
    expect(collectedMessages).toContainEqual({
      message: { key1: "value1", key2: "value2" },
    });
    expect(collectedMessages).toContainEqual({
      message: { key1: "value3", key2: "value4" },
    });
  });
});
