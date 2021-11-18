import Redis from "ioredis";
import { parse, stringify } from "telejson";

type CacheMethod =
	| "findUnique"
	| "findFirst"
	| "findMany"
	| "queryRaw"
	| "aggregate"
	| "count"
	| "groupBy";

type Options = {
	include?: CacheMethod[];
	exclude?: CacheMethod[];
};

export const createPrismaRedisCache = (
	model: string[],
	cacheTime: number,
	redis: Redis.Redis,
	options?: Options
) => {
	return async function prismaCacheMiddleware(
		params: any,
		next: (params: any) => Promise<any>
	) {
		const cacheBeforeExclude: CacheMethod[] = options?.include ?? [
			"findUnique",
			"findFirst",
			"findMany",
			"queryRaw",
			"aggregate",
			"count",
			"groupBy",
		];
		const cacheAfterExclude: CacheMethod[] = options?.exclude
			? cacheBeforeExclude.filter((method) => !options!.exclude!.includes(method))
			: cacheBeforeExclude;
		if (
			model.includes(params.model) &&
			cacheAfterExclude.includes(params.action)
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
	};
};
