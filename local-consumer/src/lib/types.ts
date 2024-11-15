export interface ConsumerResponse {
    status: string;
    data?: any[];
    error: string;
  }

export interface ConsumerPayload {
    host: string;
    topic: string;
    consumerGroupId: string;
}

export interface ConsumedMessage {
  header?: Record<string, string>;
  message: Record<string, unknown>;
}
