import { kafkaProducer } from "../config/kafka.config";

export async function sendEvent(topic: string, message: any) {
  await kafkaProducer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`📤 Event sent to ${topic}`, message);
}
