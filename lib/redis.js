import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",  // or your Redis hostname
  port: 6379,
});

export default redis;
