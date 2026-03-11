import { relations } from "drizzle-orm";
import { usersTable } from "./auth";
import { personagensTable, classesTable, origensTable } from "./game";

export const usersRelations = relations(usersTable, ({ many }) => ({
  personagens: many(personagensTable),
}));

export const personagensRelations = relations(personagensTable, ({ one }) => ({
  classe: one(classesTable, {
    fields: [personagensTable.classeId],
    references: [classesTable.id],
  }),
  origem: one(origensTable, {
    fields: [personagensTable.origemId],
    references: [origensTable.id],
  }),
}));

export const classesRelations = relations(classesTable, ({ many }) => ({
  personagens: many(personagensTable),
}));

export const origensRelations = relations(origensTable, ({ many }) => ({
  personagens: many(personagensTable),
}));
