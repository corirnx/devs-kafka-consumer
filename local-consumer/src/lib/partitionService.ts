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
      return this.addMessageToNewPartition(consumedMesssage);
    }

    const existingMessages = this.partitionedMessages[partitionIndex].messages;
    const index = existingMessages.findLastIndex(
      (msg) => msg.key === consumedMesssage.key
    );

    if (this.isIndexExisting(index) === false) {
      return this.addNewMessage(consumedMesssage, partitionIndex);
    }

    const existingMessage = existingMessages[index];
    this.handleExistingMessage(
      existingMessages,
      consumedMesssage,
      existingMessage,
      partitionIndex
    );
  }

  private isIndexExisting(index: number): boolean {
    return index !== -1;
  }

  private handleExistingMessage(
    collectedMessages: ConsumedMessage[],
    consumedMessage: ConsumedMessage,
    existingMessage: ConsumedMessage,
    partitionIndex: number
  ) {
    if (this.isLatestMessage(consumedMessage, existingMessage) === false) {
      return;
    }

    const reducesMessages = collectedMessages.filter(
      (msg) => msg.key !== consumedMessage.key
    );
    reducesMessages.push(consumedMessage);
    this.partitionedMessages[partitionIndex].messages = reducesMessages;
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

  private addMessageToNewPartition(consumedMessage: ConsumedMessage) {
    this.partitionedMessages.push({
      partition: consumedMessage.partition,
      messages: [consumedMessage],
    });
  }

  private addNewMessage(
    consumedMessage: ConsumedMessage,
    partitionIndex: number
  ) {
    this.partitionedMessages[partitionIndex].messages.push(consumedMessage);
  }
}

export default PartitionService;
