import express, { Request, Response } from "express";
import * as Sentry from "@sentry/node";

import apiRoutes from "./routes/index";
import { initKafka } from "./config/kafka.config";
import redis from "./config/redis.config";

const app = express();

Sentry.init({
  dsn: "https://fe690f2ee83e49a94bff1576d401ab08@o4510108716302336.ingest.de.sentry.io/4510108726722640",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

// Request handler (must be before all routes)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

app.use(express.json());

// Routes
app.use("/auth", apiRoutes);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Error handler (must be after all routes)
app.use(Sentry.Handlers.errorHandler());

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export async function initApp() {
  await initKafka();
  await redis.set("status", "running");
}

export default app;
