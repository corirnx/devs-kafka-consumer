import handler from "@/pages/api/consumers";
import { Kafka } from "kafkajs";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

process.env.KAFKA_USERNAME = "test-username";
process.env.KAFKA_PASSWORD = "test-password";
process.env.KAFKA_CLIENT_ID = "test-client-id";

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