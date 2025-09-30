import redis from "./config/redis.config";
import app, { initApp } from "./app";

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  await initApp();
  console.log(`🚀 Auth Service running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await redis.quit();
  process.exit(0);
});
