export interface ConsumerResponse {
  status: string;
  data?: PartitionedMessages[];
  error: string;
}

export interface ConsumerPayload {
  host: string;
  topic: string;
  consumerGroupId: string;
}

type Headers = Record<string, string>;
type MessageContent = Record<string, unknown>;

export interface ConsumedMessage {
  header?: Headers;
  key: string;
  offset: number;
  size?: string;
  timestamp: number;
  partition: number;
  message: MessageContent;
}

export interface PartitionedMessages {
  partition: number;
  messages: ConsumedMessage[];
}
