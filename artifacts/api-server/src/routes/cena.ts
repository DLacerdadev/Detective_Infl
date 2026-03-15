import { Router, type IRouter, type Request, type Response } from "express";
import {
  db, campanhaEmCenaTable, campanhaMembrosTable,
} from "@workspace/db";
import type { EmCenaPista, EmCenaCombatente, EmCenaToken } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

function isAuth(req: Request): boolean {
  return req.isAuthenticated();
}

async function getMembership(campanhaId: string, userId: string) {
  const [m] = await db
    .select()
    .from(campanhaMembrosTable)
    .where(and(eq(campanhaMembrosTable.campanhaId, campanhaId), eq(campanhaMembrosTable.userId, userId)));
  return m ?? null;
}

async function requireMestre(campanhaId: string, userId: string) {
  const m = await getMembership(campanhaId, userId);
  if (!m || m.papel !== "mestre") return null;
  return m;
}

async function getOrCreateEmCena(campanhaId: string) {
  const [existing] = await db.select().from(campanhaEmCenaTable).where(eq(campanhaEmCenaTable.campanhaId, campanhaId));
  if (existing) return existing;
  try {
    const [created] = await db.insert(campanhaEmCenaTable).values({ campanhaId }).returning();
    return created;
  } catch (_e: unknown) {
    const [row] = await db.select().from(campanhaEmCenaTable).where(eq(campanhaEmCenaTable.campanhaId, campanhaId));
    if (row) return row;
    throw _e;
  }
}

function filterForPlayer(row: typeof campanhaEmCenaTable.$inferSelect) {
  const pistas = ((row.pistas ?? []) as EmCenaPista[]).filter((p) => p.visivel);
  const combatentes = ((row.combatentes ?? []) as EmCenaCombatente[])
    .filter((c) => c.visivelParaJogadores)
    .map(({ notas, ...rest }) => rest);

  const visibleCombatenteIds = new Set(combatentes.map((c) => c.id));
  const tokens = ((row.tokens ?? []) as EmCenaToken[]).filter((t) => {
    if (!t.combatenteId) return true;
    return visibleCombatenteIds.has(t.combatenteId);
  });
  const ordemIniciativa = ((row.ordemIniciativa ?? []) as string[]).filter((id) => visibleCombatenteIds.has(id));

  return {
    id: row.id,
    campanhaId: row.campanhaId,
    ativa: row.ativa,
    imagemCena: row.imagemCena,
    notasMestre: null,
    pistas,
    combatentes,
    tokens,
    ordemIniciativa,
    turnoAtual: row.turnoAtual,
    updatedAt: row.updatedAt,
  };
}

router.get("/campanhas/:id/emcena", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const membership = await getMembership(req.params.id, userId);
  if (!membership) { res.status(403).json({ error: "Forbidden" }); return; }

  const row = await getOrCreateEmCena(req.params.id);
  if (membership.papel === "mestre") {
    res.json(row);
  } else {
    res.json(filterForPlayer(row));
  }
});

router.put("/campanhas/:id/emcena", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode atualizar a cena" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const { ativa, imagemCena, notasMestre } = req.body;

  const updates: Record<string, unknown> = {};
  if (typeof ativa === "boolean") updates.ativa = ativa;
  if (typeof imagemCena === "string" || imagemCena === null) updates.imagemCena = imagemCena;
  if (typeof notasMestre === "string") updates.notasMestre = notasMestre;

  if (Object.keys(updates).length === 0) { res.json(existing); return; }

  const [updated] = await db
    .update(campanhaEmCenaTable)
    .set(updates)
    .where(eq(campanhaEmCenaTable.id, existing.id))
    .returning();

  res.json(updated);
});

router.put("/campanhas/:id/emcena/tokens", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode mover tokens" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const { tokens } = req.body;
  if (!Array.isArray(tokens)) { res.status(400).json({ error: "tokens must be an array" }); return; }

  const validated: EmCenaToken[] = tokens.map((t: EmCenaToken) => ({
    id: t.id || randomUUID(),
    nome: t.nome ?? "",
    tipo: t.tipo ?? "neutro",
    personagemId: t.personagemId ?? null,
    combatenteId: t.combatenteId ?? null,
    x: typeof t.x === "number" ? t.x : 0,
    y: typeof t.y === "number" ? t.y : 0,
  }));

  const [updated] = await db
    .update(campanhaEmCenaTable)
    .set({ tokens: validated })
    .where(eq(campanhaEmCenaTable.id, existing.id))
    .returning();

  res.json(updated);
});

router.post("/campanhas/:id/emcena/pistas", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode criar pistas" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const { titulo, descricao, tipo, visivel } = req.body;
  if (!titulo) { res.status(400).json({ error: "titulo required" }); return; }

  const validTipos = ["pista", "anotacao", "local", "pessoa", "objeto"];
  const pista: EmCenaPista = {
    id: randomUUID(),
    titulo,
    descricao: descricao ?? "",
    tipo: validTipos.includes(tipo) ? tipo : "pista",
    visivel: visivel === true,
    criadoEm: new Date().toISOString(),
  };

  const pistas = [...((existing.pistas ?? []) as EmCenaPista[]), pista];
  const [updated] = await db
    .update(campanhaEmCenaTable)
    .set({ pistas })
    .where(eq(campanhaEmCenaTable.id, existing.id))
    .returning();

  res.status(201).json({ pista, emCena: updated });
});

router.put("/campanhas/:id/emcena/pistas/:pistaId", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode editar pistas" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const pistas = [...((existing.pistas ?? []) as EmCenaPista[])];
  const idx = pistas.findIndex((p) => p.id === req.params.pistaId);
  if (idx === -1) { res.status(404).json({ error: "Pista não encontrada" }); return; }

  const { titulo, descricao, tipo, visivel } = req.body;
  const validTipos = ["pista", "anotacao", "local", "pessoa", "objeto"];

  if (typeof titulo === "string") pistas[idx].titulo = titulo;
  if (typeof descricao === "string") pistas[idx].descricao = descricao;
  if (typeof tipo === "string" && validTipos.includes(tipo)) pistas[idx].tipo = tipo as EmCenaPista["tipo"];
  if (typeof visivel === "boolean") pistas[idx].visivel = visivel;

  const [updated] = await db
    .update(campanhaEmCenaTable)
    .set({ pistas })
    .where(eq(campanhaEmCenaTable.id, existing.id))
    .returning();

  res.json({ pista: pistas[idx], emCena: updated });
});

router.delete("/campanhas/:id/emcena/pistas/:pistaId", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode remover pistas" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const pistas = ((existing.pistas ?? []) as EmCenaPista[]).filter((p) => p.id !== req.params.pistaId);

  await db
    .update(campanhaEmCenaTable)
    .set({ pistas })
    .where(eq(campanhaEmCenaTable.id, existing.id));

  res.status(204).send();
});

router.post("/campanhas/:id/emcena/combatentes", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode adicionar combatentes" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const { nome, tipo, personagemId, iniciativa, pvAtual, pvMaximo, defesa, ataque, notas, visivelParaJogadores } = req.body;
  if (!nome) { res.status(400).json({ error: "nome required" }); return; }

  const validTipos = ["jogador", "monstro", "aliado", "neutro"];
  const combatente: EmCenaCombatente = {
    id: randomUUID(),
    nome,
    tipo: validTipos.includes(tipo) ? tipo : "monstro",
    personagemId: personagemId ?? null,
    iniciativa: typeof iniciativa === "number" ? iniciativa : 0,
    pvAtual: typeof pvAtual === "number" ? pvAtual : (typeof pvMaximo === "number" ? pvMaximo : 10),
    pvMaximo: typeof pvMaximo === "number" ? pvMaximo : 10,
    defesa: typeof defesa === "number" ? defesa : null,
    ataque: typeof ataque === "string" ? ataque : null,
    notas: typeof notas === "string" ? notas : null,
    visivelParaJogadores: visivelParaJogadores !== false,
  };

  const combatentes = [...((existing.combatentes ?? []) as EmCenaCombatente[]), combatente];
  const ordemIniciativa = [...((existing.ordemIniciativa ?? []) as string[]), combatente.id];

  const [updated] = await db
    .update(campanhaEmCenaTable)
    .set({ combatentes, ordemIniciativa })
    .where(eq(campanhaEmCenaTable.id, existing.id))
    .returning();

  res.status(201).json({ combatente, emCena: updated });
});

router.put("/campanhas/:id/emcena/combatentes/:combatenteId", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode editar combatentes" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const combatentes = [...((existing.combatentes ?? []) as EmCenaCombatente[])];
  const idx = combatentes.findIndex((c) => c.id === req.params.combatenteId);
  if (idx === -1) { res.status(404).json({ error: "Combatente não encontrado" }); return; }

  const { nome, tipo, personagemId, iniciativa, pvAtual, pvMaximo, defesa, ataque, notas, visivelParaJogadores } = req.body;
  const validTipos = ["jogador", "monstro", "aliado", "neutro"];

  if (typeof nome === "string") combatentes[idx].nome = nome;
  if (typeof tipo === "string" && validTipos.includes(tipo)) combatentes[idx].tipo = tipo as EmCenaCombatente["tipo"];
  if (typeof personagemId === "string" || personagemId === null) combatentes[idx].personagemId = personagemId;
  if (typeof iniciativa === "number") combatentes[idx].iniciativa = iniciativa;
  if (typeof pvAtual === "number") combatentes[idx].pvAtual = pvAtual;
  if (typeof pvMaximo === "number") combatentes[idx].pvMaximo = pvMaximo;
  if (typeof defesa === "number" || defesa === null) combatentes[idx].defesa = defesa;
  if (typeof ataque === "string" || ataque === null) combatentes[idx].ataque = ataque;
  if (typeof notas === "string" || notas === null) combatentes[idx].notas = notas;
  if (typeof visivelParaJogadores === "boolean") combatentes[idx].visivelParaJogadores = visivelParaJogadores;

  const [updated] = await db
    .update(campanhaEmCenaTable)
    .set({ combatentes })
    .where(eq(campanhaEmCenaTable.id, existing.id))
    .returning();

  res.json({ combatente: combatentes[idx], emCena: updated });
});

router.delete("/campanhas/:id/emcena/combatentes/:combatenteId", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode remover combatentes" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const combatentes = ((existing.combatentes ?? []) as EmCenaCombatente[]).filter((c) => c.id !== req.params.combatenteId);
  const ordemIniciativa = ((existing.ordemIniciativa ?? []) as string[]).filter((id) => id !== req.params.combatenteId);

  await db
    .update(campanhaEmCenaTable)
    .set({ combatentes, ordemIniciativa })
    .where(eq(campanhaEmCenaTable.id, existing.id));

  res.status(204).send();
});

router.put("/campanhas/:id/emcena/iniciativa", async (req: Request, res: Response) => {
  if (!isAuth(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const mestre = await requireMestre(req.params.id, userId);
  if (!mestre) { res.status(403).json({ error: "Apenas o mestre pode alterar a iniciativa" }); return; }

  const existing = await getOrCreateEmCena(req.params.id);
  const { ordemIniciativa, turnoAtual } = req.body;

  const updates: Record<string, unknown> = {};
  if (Array.isArray(ordemIniciativa)) updates.ordemIniciativa = ordemIniciativa;
  if (typeof turnoAtual === "number") updates.turnoAtual = turnoAtual;

  if (Object.keys(updates).length === 0) { res.json(existing); return; }

  const [updated] = await db
    .update(campanhaEmCenaTable)
    .set(updates)
    .where(eq(campanhaEmCenaTable.id, existing.id))
    .returning();

  res.json(updated);
});

export default router;
