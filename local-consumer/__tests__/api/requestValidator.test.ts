import { validateRequest } from "@/lib/requestValidator";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

describe("Request Validator", () => {
  it("should return 405 if method is not POST", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    validateRequest(req, res);

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

    validateRequest(req, res);

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

    validateRequest(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
});
