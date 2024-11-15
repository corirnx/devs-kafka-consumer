import { NextApiRequest, NextApiResponse } from "next";
import { ConsumerPayload, ConsumerResponse } from "./types";

export function validateRequest(
  req: NextApiRequest,
  res: NextApiResponse
): NextApiResponse {
  if (req.method !== "POST") {
    res.status(405).json({
      status: "Consume failed",
      data: [],
      error: "Method Not Allowed",
    } as ConsumerResponse);
    return res;
  }

  const payload = req.body as ConsumerPayload;
  if (!payload || payload.consumerGroupId === undefined) {
    res.status(400).json({
      status: "Bad Request: Missing required fields",
      data: [],
      error: "Invalid request",
    } as ConsumerResponse);
    return res;
  }

  res.status(200);
  return res;
}
