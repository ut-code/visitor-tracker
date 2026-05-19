import type { ServerLoad } from '@sveltejs/kit';
import { and, eq, gte, lt } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { visitsTable } from '~/db/schema';
import { resolveTimeRangeByKey } from '~/lib/consts';

export const GET: ServerLoad = async ({ url, platform }) => {
	const now = new Date();
	const rangeKey = url.searchParams.get('range');
	if (!rangeKey) return new Response('{"error":"range is required"}', { status: 400 });
	const range = resolveTimeRangeByKey(rangeKey, now);
	if (!range) return new Response(`{"error":"invalid range: ${rangeKey}"}`, { status: 400 });
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
