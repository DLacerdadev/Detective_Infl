import { pgTable, text, integer, boolean, real, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";

export type HabilidadeProgressao = {
  nex: string;
  nome: string;
  descricao: string;
};

export const classesTable = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  pvInicial: integer("pv_inicial").notNull().default(8),
  pvPorNivel: integer("pv_por_nivel").notNull().default(4),
  peInicial: integer("pe_inicial").notNull().default(4),
  pePorNivel: integer("pe_por_nivel").notNull().default(2),
  sanInicial: integer("san_inicial").notNull().default(12),
  sanPorNivel: integer("san_por_nivel").notNull().default(4),
  periciasTreindasBase: integer("pericias_treindas_base").notNull().default(3),
  habilidadesBase: jsonb("habilidades_base").$type<HabilidadeProgressao[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const origensTable = pgTable("origens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  periciasConcedidas: jsonb("pericias_concedidas").$type<string[]>().default([]),
  poderConcedido: text("poder_concedido"),
  poderDescricao: text("poder_descricao"),
  fonte: text("fonte"),
  criador: text("criador"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const periciasTable = pgTable("pericias", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  atributoBase: text("atributo_base").notNull(),
  somenteTrainada: boolean("somente_trainada").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const trilhasTable = pgTable("trilhas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classeId: varchar("classe_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  fonte: text("fonte").notNull().default("Livro Base"),
  habilidades: jsonb("habilidades").$type<HabilidadeProgressao[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rituaisTable = pgTable("rituais", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  elemento: text("elemento").notNull(),
  circulo: integer("circulo").notNull().default(1),
  execucao: text("execucao"),
  alcance: text("alcance"),
  alvo: text("alvo"),
  duracao: text("duracao"),
  resistencia: text("resistencia"),
  custoPe: integer("custo_pe").notNull().default(0),
  descricao: text("descricao"),
  discente: text("discente"),
  verdadeiro: text("verdadeiro"),
  dados: text("dados"),
  dadosDiscente: text("dados_discente"),
  dadosVerdadeiro: text("dados_verdadeiro"),
  fonte: text("fonte"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const itensTable = pgTable("itens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull().default("Utilitario"),
  descricao: text("descricao"),
  espacos: real("espacos").default(1),
  categoria: text("categoria"),
  peso: real("peso"),
  preco: integer("preco").default(0),
  requisitos: jsonb("requisitos"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const personagensTable = pgTable("personagens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  classeId: varchar("classe_id").references(() => classesTable.id),
  origemId: varchar("origem_id").references(() => origensTable.id),
  trilhaId: varchar("trilha_id").references(() => trilhasTable.id),
  nivel: integer("nivel").notNull().default(1),
  nex: integer("nex").notNull().default(0),
  patente: text("patente").default("Recruta"),
  pvAtual: integer("pv_atual").default(10),
  pvMaximo: integer("pv_maximo").default(10),
  peAtual: integer("pe_atual").default(4),
  peMaximo: integer("pe_maximo").default(4),
  sanAtual: integer("san_atual").default(12),
  sanMaximo: integer("san_maximo").default(12),
  forca: integer("forca").notNull().default(1),
  agilidade: integer("agilidade").notNull().default(1),
  intelecto: integer("intelecto").notNull().default(1),
  vigor: integer("vigor").notNull().default(1),
  presenca: integer("presenca").notNull().default(1),
  defesa: integer("defesa").notNull().default(10),
  historia: text("historia"),
  pericias: jsonb("pericias").$type<string[]>().default([]),
  rituals: jsonb("rituals").$type<string[]>().default([]),
  inventario: jsonb("inventario").$type<Record<string, unknown>[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const habilidadesTable = pgTable("habilidades", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  classe: text("classe").notNull().default("GERAL"),
  descricao: text("descricao"),
  fonte: text("fonte").notNull().default("LIVRO_BASE"),
  alterada: boolean("alterada").notNull().default(false),
  nex: integer("nex"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertClasseSchema = createInsertSchema(classesTable).omit({ id: true, createdAt: true });
export const insertOrigemSchema = createInsertSchema(origensTable).omit({ id: true, createdAt: true });
export const insertPericiaSchema = createInsertSchema(periciasTable).omit({ id: true, createdAt: true });
export const insertTrilhaSchema = createInsertSchema(trilhasTable).omit({ id: true, createdAt: true });
export const insertRitualSchema = createInsertSchema(rituaisTable).omit({ id: true, createdAt: true });
export const insertItemSchema = createInsertSchema(itensTable).omit({ id: true, createdAt: true });
export const insertPersonagemSchema = createInsertSchema(personagensTable).omit({ id: true, createdAt: true, updatedAt: true });

export type Classe = typeof classesTable.$inferSelect;
export type Origem = typeof origensTable.$inferSelect;
export type Pericia = typeof periciasTable.$inferSelect;
export type Trilha = typeof trilhasTable.$inferSelect;
export type Ritual = typeof rituaisTable.$inferSelect;
export type Item = typeof itensTable.$inferSelect;
export type Personagem = typeof personagensTable.$inferSelect;
export type Habilidade = typeof habilidadesTable.$inferSelect;
export type InsertPersonagem = z.infer<typeof insertPersonagemSchema>;
