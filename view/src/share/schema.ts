import * as v from 'valibot';

export const kind = v.union([v.literal('festival')]);
export type Kind = v.InferOutput<typeof kind>;
export const visit = v.object({
	id: v.pipe(v.number(), v.integer()),
	url: v.string(),
	kind: v.string(),
	at: v.date()
});
export type Visit = v.InferOutput<typeof visit>;