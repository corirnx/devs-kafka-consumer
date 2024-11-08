import handler from "@/pages/api/consumers";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

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
});