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
  key: string;
  offset: number;
  size?: string;
  timestamp: number;    
  message: Record<string, unknown>;
}
