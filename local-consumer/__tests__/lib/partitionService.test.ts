import PartitionService from "@/lib/partitionService";
import { createConsumedMessage } from "@/lib/consumedMessageCreator";
import { ConsumedMessage, PartitionedMessages } from "@/lib/types";
import { KafkaMessage } from "kafkajs";

describe("PartitionService", () => {
  let partitionService: PartitionService;

  beforeEach(() => {
    partitionService = new PartitionService([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add a new partition if the partition does not exist", () => {
    const message: KafkaMessage = {
      key: Buffer.from("key1"),
      value: Buffer.from(JSON.stringify({ key: "key1", value: "value" })),
      timestamp: "1627848284000",
      offset: "1",
      headers: { header1: Buffer.from("value1") },
      size: 100,
    } as unknown as KafkaMessage;

    const consumedMessage = createConsumedMessage(message, 0);
    partitionService.processMessage(message, 0);

    const partitionedMessages = partitionService.getPartitionedMessages();
    expect(partitionedMessages).toHaveLength(1);
    expect(partitionedMessages[0].partition).toBe(0);
    expect(partitionedMessages[0].messages).toHaveLength(1);
    expect(partitionedMessages[0].messages[0]).toEqual(consumedMessage);
  });

  it("should add a new message to an existing partition", () => {
    const initialPartitionedMessages: PartitionedMessages[] = [
      {
        partition: 0,
        messages: [
          {
            key: "key1",
            partition: 0,
            timestamp: 1620000000000,
            offset: 1,
          } as ConsumedMessage,
        ],
      },
    ];

    partitionService = new PartitionService(initialPartitionedMessages);

    const message: KafkaMessage = {
      key: Buffer.from("key2"),
      value: Buffer.from(JSON.stringify({ key: "key2", value: "value" })),
      timestamp: "1627848284000",
      offset: "2",
      headers: { header1: Buffer.from("value1") },
      size: 100,
    } as unknown as KafkaMessage;

    const consumedMessage = createConsumedMessage(message, 0);
    partitionService.processMessage(message, 0);

    const partitionedMessages = partitionService.getPartitionedMessages();
    expect(partitionedMessages).toHaveLength(1);
    expect(partitionedMessages[0].partition).toBe(0);
    expect(partitionedMessages[0].messages).toHaveLength(2);
    expect(partitionedMessages[0].messages[1]).toEqual(consumedMessage);
  });

  it("should update an existing message with a later timestamp", () => {
    const initialPartitionedMessages: PartitionedMessages[] = [
      {
        partition: 0,
        messages: [
          {
            key: "key1",
            partition: 0,
            timestamp: 1620000000000,
            offset: 1,
          } as ConsumedMessage,
        ],
      },
    ];

    partitionService = new PartitionService(initialPartitionedMessages);

    const message: KafkaMessage = {
      key: Buffer.from("key1"),
      value: Buffer.from(JSON.stringify({ key: "key1", value: "new value" })),
      timestamp: "1627848284000",
      offset: "2",
      headers: { header1: Buffer.from("new value1") },
      size: 100,
    } as unknown as KafkaMessage;

    const consumedMessage = createConsumedMessage(message, 0);
    partitionService.processMessage(message, 0);

    const partitionedMessages = partitionService.getPartitionedMessages();
    expect(partitionedMessages).toHaveLength(1);
    expect(partitionedMessages[0].partition).toBe(0);
    expect(partitionedMessages[0].messages).toHaveLength(1);
    expect(partitionedMessages[0].messages[0]).toEqual(consumedMessage);
  });

  it("should not update an existing message with an earlier timestamp", () => {
    const initialPartitionedMessages: PartitionedMessages[] = [
      {
        partition: 0,
        messages: [
          {
            key: "key1",
            partition: 0,
            timestamp: 1627848284000,
            offset: 2,
          } as ConsumedMessage,
        ],
      },
    ];

    partitionService = new PartitionService(initialPartitionedMessages);

    const message: KafkaMessage = {
      key: Buffer.from("key1"),
      value: Buffer.from(JSON.stringify({ key: "key1", value: "old value" })),
      timestamp: "1620000000000",
      offset: "1",
      headers: { header1: Buffer.from("old value1") },
      size: 100,
    } as unknown as KafkaMessage;

    partitionService.processMessage(message, 0);

    const partitionedMessages = partitionService.getPartitionedMessages();
    expect(partitionedMessages).toHaveLength(1);
    expect(partitionedMessages[0].partition).toBe(0);
    expect(partitionedMessages[0].messages).toHaveLength(1);
    expect(partitionedMessages[0].messages[0]).toEqual({
      key: "key1",
      partition: 0,
      timestamp: 1627848284000,
      offset: 2,
    });
  });
});
