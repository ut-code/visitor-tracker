export const DAY = 24 * 60 * 60 * 1000;
export const HOUR = 60 * 60 * 1000;

type RelativeTimeRangeOption = {
	key: string;
	label: string;
	type: 'relative';
	duration: number;
};

type FixedTimeRangeOption = {
	key: string;
	label: string;
	type: 'fixed';
	startAt: string;
	endAt: string;
};

export type TimeRangeOption = RelativeTimeRangeOption | FixedTimeRangeOption;

export const DEFAULT_TIME_RANGE_KEY = '12h';

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
	{ key: '3h', label: '3 hours', type: 'relative', duration: 3 * HOUR },
	{ key: '6h', label: '6 hours', type: 'relative', duration: 6 * HOUR },
	{ key: '12h', label: '12 hours', type: 'relative', duration: 12 * HOUR },
	{ key: '1d', label: '1 day', type: 'relative', duration: 1 * DAY },
	{ key: '3d', label: '3 days', type: 'relative', duration: 3 * DAY },
	{ key: '6d', label: '6 days', type: 'relative', duration: 6 * DAY },
	{
		key: 'kf75',
		label: 'kf75',
		type: 'fixed',
		startAt: '2024-11-22T00:00:00+09:00',
		endAt: '2024-11-25T00:00:00+09:00'
	},
	{
		key: 'kf76',
		label: 'kf76',
		type: 'fixed',
		startAt: '2025-11-22T00:00:00+09:00',
		endAt: '2025-11-25T00:00:00+09:00'
	},
	{
		key: 'mf98',
		label: 'mf98',
		type: 'fixed',
		startAt: '2025-05-24T00:00:00+09:00',
		endAt: '2025-05-26T00:00:00+09:00'
	},
	{
		key: 'mf99',
		label: 'mf99',
		type: 'fixed',
		startAt: '2026-05-16T00:00:00+09:00',
		endAt: '2026-05-18T00:00:00+09:00'
	}
];

export function resolveTimeRangeByKey(key: string, now: Date): {
	start: Date;
	end: Date;
	duration: number;
} | null {
	const option = TIME_RANGE_OPTIONS.find((item) => item.key === key);
	if (!option) return null;
	if (option.type === 'relative') {
		return {
			start: new Date(now.getTime() - option.duration),
			end: now,
			duration: option.duration
		};
	}
	const start = new Date(option.startAt);
	const end = new Date(option.endAt);
	return {
		start,
		end,
		duration: end.getTime() - start.getTime()
	};
}
