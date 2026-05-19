import type { ServerLoad } from '@sveltejs/kit';
import { and, eq, gte, lt } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { visitsTable } from '~/db/schema';
import { resolveTimeRangeByKey } from '~/lib/consts';

export const GET: ServerLoad = async ({ url, platform }) => {
	const now = new Date();
	const rangeKey = url.searchParams.get('range');
	let range = rangeKey ? resolveTimeRangeByKey(rangeKey, now) : null;
	if (!range) {
		const duration = Number.parseInt(url.searchParams.get('duration') ?? '');
		if (!duration)
			return new Response(
				`{"error": "failed to parse ${url.searchParams.get('duration')} to number"}`
			);
		range = {
			start: new Date(now.getTime() - duration),
			end: now,
			duration
		};
	}
	const kind = url.searchParams.get('kind') ?? 'all';

	if (!platform) return new Response('platform not found');
	const db = drizzle(platform.env.DB);
	const resp = await db
		.select()
		.from(visitsTable)
		.where(
			and(
				eq(visitsTable.kind, kind !== 'all' ? kind : visitsTable.kind),
				gte(visitsTable.at, range.start),
				lt(visitsTable.at, range.end)
			)
		)
		.all();
	return new Response(JSON.stringify(resp));
};
