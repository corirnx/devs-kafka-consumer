import { Kafka, logLevel } from "kafkajs";
import { createKafka } from "@/lib/kafkaProvider";

jest.mock("kafkajs", () => {
  const actualKafkaJs = jest.requireActual("kafkajs");
  return {
    ...actualKafkaJs,
    Kafka: jest.fn().mockImplementation(() => ({
      config: {
        brokers: [],
        clientId: "",
        logLevel: logLevel.INFO,
        sasl: undefined,
        ssl: true,
        connectionTimeout: 30000,
      },
    })),
  };
});

describe("createKafka", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should create a Kafka instance with the given host", () => {
    process.env.KAFKA_USERNAME = "test-username";
    process.env.KAFKA_PASSWORD = "test-password";
    process.env.KAFKA_CLIENT_ID = "test-client-id";

    const host = "localhost:9092,localhost:9093";
    createKafka(host);

    expect(Kafka).toHaveBeenCalledWith({
      brokers: ["localhost:9092", "localhost:9093"],
      clientId: "test-client-id",
      logLevel: logLevel.INFO,
      sasl: {
        mechanism: "plain",
        username: "test-username",
        password: "test-password",
      },
      ssl: true,
      connectionTimeout: 30000,
    });
  });

  it("should use default values for missing environment variables", () => {
    delete process.env.KAFKA_USERNAME;
    delete process.env.KAFKA_PASSWORD;
    delete process.env.KAFKA_CLIENT_ID;

    const host = "localhost:9092";
    createKafka(host);

    expect(Kafka).toHaveBeenCalledWith({
      brokers: ["localhost:9092"],
      clientId: undefined,
      logLevel: logLevel.INFO,
      sasl: {
        mechanism: "plain",
        username: "",
        password: "",
      },
      ssl: true,
      connectionTimeout: 30000,
    });
  });
});
