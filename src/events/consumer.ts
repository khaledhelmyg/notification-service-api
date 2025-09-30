import  {kafkaConsumer}  from "../config/kafka.config";

export async function consumeEvents(topic: string, handler: (msg: any) => void) {
  await kafkaConsumer.subscribe({ topic, fromBeginning: true });

  await kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const data = JSON.parse(message.value.toString());
        console.log(`📥 Event received on ${topic}`, data);
        handler(data);
      }
    },
  });
}
