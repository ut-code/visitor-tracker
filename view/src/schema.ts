import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const visitsTable = sqliteTable('visits', {
	id: int('id').primaryKey({ autoIncrement: true }),
	url: text('url').notNull(),
	at: integer('at', { mode: 'timestamp' }).notNull()
});