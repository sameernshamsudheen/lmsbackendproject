const Redis = require("ioredis");
require("dotenv").config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("RedisConnected");
    return process.env.REDIS_URL;
  }
  throw new Error(`Redis Connection Failed`);
};


const redis = new Redis(redisClient());

// Exporting the Redis client instance
module.exports = { redis };