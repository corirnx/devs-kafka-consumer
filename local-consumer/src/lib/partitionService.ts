import { ConsumedMessage, PartitionedMessages } from "./types";
import { KafkaMessage } from "kafkajs";
import { createConsumedMessage } from "./consumedMessageCreator";

class PartitionService {
  private partitionedMessages: PartitionedMessages[] = [];

  constructor(partitionedMessages: PartitionedMessages[] = []) {
    this.partitionedMessages = partitionedMessages;
  }

  public getPartitionedMessages(): PartitionedMessages[] {
    return this.partitionedMessages;
  }

  public processMessage(message: KafkaMessage, partition: number) {
    const consumedMesssage = createConsumedMessage(message, partition);

    const partitionIndex = this.partitionedMessages.findIndex(
      (prt) => prt.partition === consumedMesssage.partition
    );

    if (this.isIndexExisting(partitionIndex) === false) {
      return this.addMessageToNewPartition(
        consumedMesssage,
        this.partitionedMessages
      );
    }

    const existingMessages = this.partitionedMessages[partitionIndex].messages;
    const index = existingMessages.findLastIndex(
      (msg) => msg.key === consumedMesssage.key
    );

    if (this.isIndexExisting(index) === false) {
      return this.addNewMessage(
        consumedMesssage,
        this.partitionedMessages,
        partitionIndex
      );
    }

    const existingMessage = existingMessages[index];
    this.partitionedMessages = this.handleExistingMessage(
      this.partitionedMessages,
      existingMessages,
      consumedMesssage,
      existingMessage,
      partitionIndex
    );
  }
  private isIndexExisting(index: number): boolean {
    return index !== -1;
  }
  private addMessageToNewPartition(
    consumedMessage: ConsumedMessage,
    partitionedMessages: PartitionedMessages[]
  ): PartitionedMessages[] {
    const partitionMessages: PartitionedMessages = {
      partition: consumedMessage.partition,
      messages: [consumedMessage],
    };
    partitionedMessages.push(partitionMessages);
    return partitionedMessages;
  }

  private addNewMessage(
    consumedMessage: ConsumedMessage,
    partitionedMessages: PartitionedMessages[],
    partitionIndex: number
  ): PartitionedMessages[] {
    partitionedMessages[partitionIndex].messages.push(consumedMessage);
    return partitionedMessages;
  }

  private handleExistingMessage(
    partitionedMessages: PartitionedMessages[],
    collectedMessages: ConsumedMessage[],
    consumedMessage: ConsumedMessage,
    existingMessage: ConsumedMessage,
    partitionIndex: number
  ): PartitionedMessages[] {
    if (this.isLatestMessage(consumedMessage, existingMessage) === false) {
      return partitionedMessages;
    }

    const reducesMessages = collectedMessages.filter(
      (msg) => msg.key !== consumedMessage.key
    );
    reducesMessages.push(consumedMessage);
    partitionedMessages[partitionIndex].messages = reducesMessages;
    return partitionedMessages;
  }

  private isLatestMessage(
    consumedMessage: ConsumedMessage,
    existingMessage: ConsumedMessage
  ): boolean {
    return (
      consumedMessage.timestamp > existingMessage.timestamp ||
      consumedMessage.offset > existingMessage.offset
    );
  }
}

export default PartitionService;
