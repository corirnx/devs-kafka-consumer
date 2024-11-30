import { createConsumedMessage } from "@/lib/consumedMessageCreator";
import { ConsumedMessage } from "@/lib/types";
import { KafkaMessage } from "kafkajs";

describe("createConsumedMessage", () => {
  it("should create a consumed message from a Kafka message with headers", () => {
    const message: KafkaMessage = {
      key: Buffer.from("key1"),
      value: Buffer.from(JSON.stringify({ key: "key1", value: "value" })),
      timestamp: "1627848284000",
      offset: "1",
      headers: { header1: Buffer.from("value1") },
    } as unknown as KafkaMessage;

    const partition = 0;
    const result = createConsumedMessage(message, partition);

    const expected: ConsumedMessage = {
      header: { "header1": "value1" },
      message: { "key": "key1", value: "value" },
      key: "key1",
      offset: 1,
      timestamp: 1627848284000,
      partition,
    };

    expect(result).toEqual(expected);
  });

  it("should create a consumed message from a Kafka message without headers", () => {
    const message: KafkaMessage = {
      key: Buffer.from("key1"),
      value: Buffer.from(JSON.stringify({ key: "key1", value: "value" })),
      timestamp: "1627848284000",
      offset: "1",
      headers: undefined,
    } as unknown as KafkaMessage;

    const partition = 0;
    const result = createConsumedMessage(message, partition);

    const expected: ConsumedMessage = {
      header: {},
      message: { key: "key1", value: "value" },
      key: "key1",
      offset: 1,
      timestamp: 1627848284000,
      partition,
    };

    expect(result).toEqual(expected);
  });

  it("should create a consumed message from a Kafka message with null key", () => {
    const message: KafkaMessage = {
      key: null,
      value: Buffer.from(JSON.stringify({ key: "key1", value: "value" })),
      timestamp: "1627848284000",
      offset: "1",
      headers: { header1: Buffer.from("value1") },
    } as unknown as KafkaMessage;

    const partition = 0;
    const result = createConsumedMessage(message, partition);

    const expected: ConsumedMessage = {
      header: { header1: "value1" },
      message: { key: "key1", value: "value" },
      key: "",
      offset: 1,
      timestamp: 1627848284000,
      partition,
    };

    expect(result).toEqual(expected);
  });
});
