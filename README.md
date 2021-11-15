# prisma-redis

This package is middleware for Prisma that caches requests to Redis.
Based on the work done by @Asjas on [prisma-redis-middleware](https://github.com/Asjas/prisma-redis-middleware)

This package requires [ioredis](https://www.npmjs.com/package/ioredis)

## Installation
```bash
npm i prisma-redis
```
or
```base
yarn add prisma-redis
```

## Implementation
```ts
import { PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis";
import Redis from "ioredis";

const prisma = new PrismaClient();

const redis = new Redis();
prisma.$use(createPrismaRedisCache(["Objects","to","cache"], 60, redis));

...
```
In 4th argument you can define which command to cache.