import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import * as Sentry from "@sentry/node";
import { Prisma } from "@prisma/client";
import { 
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError
} from '@prisma/client/runtime/library';

import apiRoutes from "./routes/index";
import { initKafka } from "./config/kafka.config";
import redis from "./config/redis.config";

const app = express();

// Sentry.init({
//   dsn: "https://fe690f2ee83e49a94bff1576d401ab08@o4510108716302336.ingest.de.sentry.io/4510108726722640",
//   integrations: [
//     new Sentry.Integrations.Http({ tracing: true }),
//     new Sentry.Integrations.Express({ app }),
//   ],
//   tracesSampleRate: 1.0,
//   // For example, automatic IP address collection on events
//   sendDefaultPii: true,
// });

// Request handler (must be before all routes)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// app.js or server.js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});


app.use(express.json());

// Routes
app.use("/api/v1", apiRoutes);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Error handler (must be after all routes)
app.use(Sentry.Handlers.errorHandler());

// Global error handler
app.use(
  async (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    // ✅ Prisma validation error (schema mismatch, invalid field)
    if (err instanceof PrismaClientValidationError) {
      return res.status(400).json({
        status: 400,
        message: "Validation Error: " + err.message,
      });
    }

    // ✅ Prisma known request errors
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case "P2002": // Unique constraint failed
          return res.status(409).json({
            status: 409,
            message: `Duplicate value: ${err.meta?.target}`,
          });
        case "P2025": // Record not found
          return res.status(404).json({
            status: 404,
            message: "Record not found",
          });
        default:
          return res.status(400).json({
            status: 400,
            message: `Prisma error (${err.code}): ${err.message}`,
          });
      }
    }

    // ✅ Prisma initialization/connection error
    if (err instanceof PrismaClientInitializationError) {
      return res.status(503).json({
        status: 503,
        message: "Database unavailable: " + err.message,
      });
    }

    // ✅ Prisma transaction error
    if (err instanceof PrismaClientRustPanicError) {
      return res.status(500).json({
        status: 500,
        message: "Database engine panic",
      });
    }

    // ✅ Fall back for other errors
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || "Internal server error",
    });
  }
);

export async function initApp() {
  await initKafka();
  await redis.set("status", "running");
}

export default app;
