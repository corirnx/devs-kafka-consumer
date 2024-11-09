import handler from "@/pages/api/consumers";
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

describe("API Handler", () => {
  it("should return 405 if method is not POST", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({
      status: "Consume failed",
      data: [],
      error: "Method Not Allowed",
    });
  });

  it("should return 400 if required fields are missing", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      status: "Bad Request: Missing required fields",
      data: [],
      error: "Invalid request",
    });
  });

  it("should consume messages and return 200", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        host: "localhost:9092",
        topic: "test-topic",
        consumerGroupId: "test-group",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        status: expect.stringContaining("Messages consumed."),
        data: expect.any(Array),
        error: "",
      })
    );
  });

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
