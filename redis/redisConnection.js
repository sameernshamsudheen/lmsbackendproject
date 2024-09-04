const Redis = require("ioredis");
require("dotenv").config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("Connecting to Redis...");
    return new Redis(process.env.REDIS_URL, {
      reconnectOnError: (err) => {
        console.error("Reconnect on error:", err);
        return true; // Automatically reconnect on errors
      },
      retryStrategy: (times) => {
        console.log(`Attempt ${times} to reconnect...`);
        return Math.min(times * 100, 5000); // Reconnect after a delay (up to 5 seconds)
      },
      maxRetriesPerRequest: null, // Retry indefinitely
      keepAlive: 10000, // Send a keep-alive packet every 10 seconds
      tls: {}, // Enable TLS/SSL if required
    });
  }
  throw new Error("Redis Connection Failed");
};

const redis = redisClient();

// Handling unhandled errors explicitly
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Export the Redis client instance
module.exports = { redis };
