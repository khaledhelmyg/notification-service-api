import { env } from "./config/env.config";
import redis from "./config/redis.config";
import app, { initApp } from "./app";
import { Consul } from "consul/lib/consul.js";

const PORT = env.APP_PORT ? parseInt(env.APP_PORT) : 5001;

const consulClient = new Consul({
  host: env.CONSUL_HOST || "consul",
  port: env.CONSUL_PORT ? parseInt(env.CONSUL_PORT) : 8500,
});

interface ServiceRegistrationConfig {
  name: string;
  address: string;
  port: number;
  tags: string[];
  check: {
    name: string;
    http: string;
    interval: string;
    timeout: string;
  };
}
async function registerService(
  serviceName: string,
  port: number
): Promise<void> {
  const serviceConfig: ServiceRegistrationConfig = {
    name: serviceName,
    address: serviceName, // Container name
    port: port,
    tags: ["http"],
    check: {
      name: `${serviceName}-health-check`,
      http: `http://${serviceName}:${port}/health`,
      interval: "10s",
      timeout: "5s",
    },
  };

  try {
    await consulClient.agent.service.register(serviceConfig);
    console.log(`✅ ${serviceName} registered with Consul`);
  } catch (err) {
    console.error(`❌ Failed to register ${serviceName}:`, err);
  }
}

// Deregister on shutdown
async function deregisterService(serviceName: string) {
  try {
    await consulClient.agent.service.deregister(serviceName);
    console.log(`👋 ${serviceName} deregistered from Consul`);
  } catch (err) {
    console.error(`❌ Failed to deregister ${serviceName}:`, err);
  }
}

app.listen(PORT, async () => {
  await initApp();
  await registerService("notification-service", PORT);
  console.log(`🚀 Notification Service running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await redis.quit();
  await deregisterService("notification-service");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await deregisterService('notification-service');
  process.exit(0);
});