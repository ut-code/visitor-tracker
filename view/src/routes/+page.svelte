<script lang="ts">
	import {
		DEFAULT_TIME_RANGE_KEY,
		HOUR,
		resolveTimeRangeByKey,
		TIME_RANGE_OPTIONS
	} from '~/lib/consts';
	import * as v from 'valibot';
	import Dashboard from '~/pages/Dashboard.svelte';
	import { type Kind, visit } from '~/share/schema';
	import type { Visit } from '~/db/schema';
	let visits: Promise<Visit[]> = $state(new Promise(() => {}));

	let kind: Kind | 'all' = $state('all');
	let rangeKey: string = $state(DEFAULT_TIME_RANGE_KEY);
	let duration: number = $state(12 * HOUR);
	let lastFetch: Date = $state(new Date());

	$effect(() => {
		const range = resolveTimeRangeByKey(rangeKey, new Date());
		if (!range) return;
		visits = fetch(`/visits?kind=${kind}&range=${rangeKey}`)
			.then((res) => res.json())
			.then((val) => {
				const parsed = v.safeParse(v.array(visit), val);
				if (!parsed.success) {
					console.error(val, parsed.issues);
					throw new Error(parsed.issues.toString());
				}
				return parsed.output;
			})
			.then((val) => {
				duration = range.duration;
				lastFetch = range.end;
				return val;
			});
	});
</script>

<header>
	<select name="range" bind:value={rangeKey} class="select select-bordered w-full max-w-sm">
		{#each TIME_RANGE_OPTIONS as option}
			<option value={option.key}>{option.label}</option>
		{/each}
	</select>
	<select name="kind" bind:value={kind} class="select select-bordered w-full max-w-sm">
		<option value="all">All</option>
		<option value="festival">Festival</option>
	</select>
</header>
{#await visits}
	<div class="flex h-full items-center justify-center text-center">
		<span class="loading loading-bars loading-lg"></span>
	</div>
{:then visits}
	<Dashboard data={visits} {duration} {kind} {lastFetch} />
{:catch err}
	error: {err.message}
{/await}
