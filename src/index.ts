import Redis from "ioredis";
import { parse, stringify } from "telejson";

type CacheMethod = "findUnique" | "findFirst" | "findMany" | "queryRaw" | "aggregate" | "count" | "groupBy";

export const createPrismaRedisCache = (model: string[], cacheTime: number, redis: Redis.Redis, cacheMethods?: CacheMethod[]) => {
	return async function prismaCacheMiddleware(params: any, next: (params: any) => Promise<any>) {
		if (
			model.includes(params.model) &&
				cacheMethods ? cacheMethods.includes(params.actions) : ["findUnique", "findFirst", "findMany", "queryRaw", "aggregate", "count", "groupBy"].includes(params.action)
		) {
			const args = stringify(params.args);
			const cacheKey = `${params.model}_${params.action}_${args}`;

			let result = parse((await redis.get(cacheKey))!);

			if (!result) {
				result = await next(params);
				await redis.setex(cacheKey, cacheTime, stringify(result));
			}
			return result;
		} else {
			return await next(params);
		}
	}
}
