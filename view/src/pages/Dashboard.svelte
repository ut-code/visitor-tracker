<script lang="ts">
	import TotalVisits from '~/components/TotalVisits.svelte';
	import Line from '~/components/charts/Line.svelte';
	import PieChart from '~/components/charts/PieChart.svelte';
	import type { Visit } from '~/db/schema';
	import { HOUR } from '~/lib/consts';
	import { groupBy, groupByTime, stairs } from '~/lib/utils';
	import type { Kind } from '~/share/schema';

	const URL_LABELS = new Map([
		['maze.utcode.net', 'はじプロ/迷路'],
		['boardgame.utcode.net', 'オセロ'],
		['page8.utcode.net', '8番ページ'],
		['browser-hack.utcode.net', 'ブラウザハック入門'],
		['life-code.utcode.net', 'Life Code'],
		['plusoperatorgame.onrender.com', 'プラス演算子ゲーム']
	]);

	type Props = {
		data: Visit[];
		duration: number;
		lastFetch: Date;
		kind: Kind | 'all';
	};
	const { data, duration, lastFetch }: Props = $props();
	function clamp(target: number, min: number, max: number) {
		return Math.min(Math.max(target, min), max);
	}

	const SAMPLING_COUNT = $derived(clamp(duration / HOUR, 6, 20)); // limit sampling count to 20 if it's too big
	const start = $derived(new Date(lastFetch.getTime() - duration));
	const sanitizedData = $derived(
		data.map((item) => {
			const sanitized = item.url.split('://')[1]?.split('/')[0];
			if (sanitized) item.url = sanitized;
			return item;
		})
	);

	const grouped = $derived(
		groupBy(sanitizedData, (item) => {
			return item.url;
		}).sort((a, b) => {
			return b.val.length - a.val.length;
		})
	);
	const piedata = $derived(
		grouped.map((group) => {
			return {
				label: URL_LABELS.get(group.key) ?? group.key,
				data: group.val.length
			};
		})
	);

	const titles = $derived(
		stairs(SAMPLING_COUNT, lastFetch.getTime() - start.getTime()).map(
			(v) => new Date(v + start.getTime())
		)
	);
	const linedata = $derived(
		grouped.map((e) => ({
			name: URL_LABELS.get(e.key) ?? e.key,
			data: groupByTime(
				lastFetch,
				start,
				e.val.map((i) => i.at),
				SAMPLING_COUNT
			)
		}))
	);
</script>

<main class="mt-4">
	<TotalVisits total={data.length} {duration} />
	<PieChart dataset={piedata} />

	<Line dataset={linedata} {titles} />
</main>

<style>
	main {
		min-height: 100%;
	}
</style>
