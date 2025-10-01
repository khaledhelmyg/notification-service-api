import { Kafka } from "kafkajs";
import {env} from "./env.config";

const kafka = new Kafka({
  clientId: "notification-service", // غير الاسم لكل service
  brokers: [`${env.KAFKA_BROKER}`], // من docker-compose
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: "notification-group" });

export async function initKafka() {
  await kafkaProducer.connect();
  await kafkaConsumer.connect();
  console.log("✅ Kafka connected");
}
