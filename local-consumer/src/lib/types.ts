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

export interface ConsumedMessage {
  header?: Record<string, string>;
  key: string;
  offset: number;
  size?: string;
  timestamp: number;
  partition: number;
  message: Record<string, unknown>;
}

// export interface ConsumerResponse {
//   status: string;
//   data?: ConsumedMessage[];
//   error: string;
// }
export interface PartitionedMessages {
  partition: number;
  data: ConsumedMessage[];
}
