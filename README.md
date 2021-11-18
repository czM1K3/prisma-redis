# prisma-redis

This package is a middleware for Prisma that caches its requests to a Redis database.
Based on the work done by [@Asjas](https://github.com/Asjas) on [prisma-redis-middleware](https://github.com/Asjas/prisma-redis-middleware)

This package requires [ioredis](https://www.npmjs.com/package/ioredis).

## Installation
```bash
npm i prisma-redis
```
or
```bash
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
In the 4th argument you can define object with property 'include' or 'exclude'. That property is an array of these strings: "findUnique", "findFirst", "findMany", "queryRaw", "aggregate", "count" and "groupBy". By default all of the above are cached. Include overrides all and cached are only the ones you include. Exclude excludes only the ones you exclude.
