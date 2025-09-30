import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth-service", // غير الاسم لكل service
  brokers: ["localhost:9092"], // من docker-compose
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: "auth-group" });

export async function initKafka() {
  await kafkaProducer.connect();
  await kafkaConsumer.connect();
  console.log("✅ Kafka connected");
}
