import { pgTable, text, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./auth";

export const campanhasTable = pgTable("campanhas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  codigoConvite: varchar("codigo_convite", { length: 12 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const campanhaMembrosTable = pgTable("campanha_membros", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campanhaId: varchar("campanha_id").notNull().references(() => campanhasTable.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  papel: varchar("papel", { length: 20 }).notNull().default("jogador"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique("campanha_membro_uniq").on(t.campanhaId, t.userId),
]);

export type Campanha = typeof campanhasTable.$inferSelect;
export type CampanhaMembro = typeof campanhaMembrosTable.$inferSelect;
