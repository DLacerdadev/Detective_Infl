import { Router, type IRouter, type Request, type Response } from "express";
import { db, campanhasTable, campanhaMembrosTable, usersTable } from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";

const router: IRouter = Router();

function randomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function isMembro(req: Request): boolean {
  return req.isAuthenticated();
}

async function getMestreCampaign(campanhaId: string, userId: string) {
  const [membro] = await db
    .select()
    .from(campanhaMembrosTable)
    .where(
      and(
        eq(campanhaMembrosTable.campanhaId, campanhaId),
        eq(campanhaMembrosTable.userId, userId),
        eq(campanhaMembrosTable.papel, "mestre"),
      ),
    );
  return membro ?? null;
}

async function getMembroship(campanhaId: string, userId: string) {
  const [membro] = await db
    .select()
    .from(campanhaMembrosTable)
    .where(
      and(
        eq(campanhaMembrosTable.campanhaId, campanhaId),
        eq(campanhaMembrosTable.userId, userId),
      ),
    );
  return membro ?? null;
}

async function buildCampanhaResponse(campanha: typeof campanhasTable.$inferSelect) {
  const membros = await db
    .select({
      id: campanhaMembrosTable.id,
      userId: campanhaMembrosTable.userId,
      papel: campanhaMembrosTable.papel,
      joinedAt: campanhaMembrosTable.joinedAt,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    })
    .from(campanhaMembrosTable)
    .innerJoin(usersTable, eq(campanhaMembrosTable.userId, usersTable.id))
    .where(eq(campanhaMembrosTable.campanhaId, campanha.id));

  return { ...campanha, membros };
}

router.get("/campanhas", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;

  const membroRows = await db
    .select({ campanhaId: campanhaMembrosTable.campanhaId })
    .from(campanhaMembrosTable)
    .where(eq(campanhaMembrosTable.userId, userId));

  if (membroRows.length === 0) { res.json([]); return; }

  const ids = membroRows.map(m => m.campanhaId);
  const campanhas = await db
    .select()
    .from(campanhasTable)
    .where(inArray(campanhasTable.id, ids));

  const result = await Promise.all(campanhas.map(buildCampanhaResponse));
  res.json(result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

router.post("/campanhas", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const { nome, descricao } = req.body;
  if (!nome) { res.status(400).json({ error: "nome required" }); return; }

  const codigo = randomCode();
  const [campanha] = await db
    .insert(campanhasTable)
    .values({ nome, descricao, codigoConvite: codigo })
    .returning();

  await db.insert(campanhaMembrosTable).values({ campanhaId: campanha.id, userId, papel: "mestre" });

  const response = await buildCampanhaResponse(campanha);
  res.status(201).json(response);
});

router.get("/campanhas/:id", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;

  const [campanha] = await db.select().from(campanhasTable).where(eq(campanhasTable.id, req.params.id));
  if (!campanha) { res.status(404).json({ error: "Not found" }); return; }

  const membership = await getMembroship(campanha.id, userId);
  if (!membership) { res.status(403).json({ error: "Forbidden" }); return; }

  const response = await buildCampanhaResponse(campanha);
  res.json(response);
});

router.put("/campanhas/:id", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;

  const isMestr = await getMestreCampaign(req.params.id, userId);
  if (!isMestr) { res.status(403).json({ error: "Apenas o mestre pode editar" }); return; }

  const { nome, descricao } = req.body;
  const [campanha] = await db
    .update(campanhasTable)
    .set({ nome, descricao })
    .where(eq(campanhasTable.id, req.params.id))
    .returning();

  if (!campanha) { res.status(404).json({ error: "Not found" }); return; }
  const response = await buildCampanhaResponse(campanha);
  res.json(response);
});

router.delete("/campanhas/:id", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;

  const isMestr = await getMestreCampaign(req.params.id, userId);
  if (!isMestr) { res.status(403).json({ error: "Apenas o mestre pode excluir" }); return; }

  await db.delete(campanhasTable).where(eq(campanhasTable.id, req.params.id));
  res.status(204).send();
});

router.post("/campanhas/entrar", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const { codigo } = req.body;
  if (!codigo) { res.status(400).json({ error: "codigo required" }); return; }

  const [campanha] = await db
    .select()
    .from(campanhasTable)
    .where(eq(campanhasTable.codigoConvite, codigo.toUpperCase()));

  if (!campanha) { res.status(404).json({ error: "Código inválido ou campanha não encontrada" }); return; }

  const existing = await getMembroship(campanha.id, userId);
  if (existing) { res.status(409).json({ error: "Você já é membro desta campanha" }); return; }

  await db.insert(campanhaMembrosTable).values({ campanhaId: campanha.id, userId, papel: "jogador" });
  const response = await buildCampanhaResponse(campanha);
  res.status(201).json(response);
});

router.put("/campanhas/:id/membros/:userId/papel", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const currentUserId = req.user!.id;

  const isMestr = await getMestreCampaign(req.params.id, currentUserId);
  if (!isMestr) { res.status(403).json({ error: "Apenas o mestre pode alterar papéis" }); return; }

  const { papel } = req.body;
  if (!["mestre", "jogador"].includes(papel)) {
    res.status(400).json({ error: "papel deve ser 'mestre' ou 'jogador'" }); return;
  }

  if (papel === "mestre" && req.params.userId !== currentUserId) {
    await db
      .update(campanhaMembrosTable)
      .set({ papel: "jogador" })
      .where(
        and(
          eq(campanhaMembrosTable.campanhaId, req.params.id),
          eq(campanhaMembrosTable.userId, currentUserId),
        ),
      );
  }

  const [updated] = await db
    .update(campanhaMembrosTable)
    .set({ papel })
    .where(
      and(
        eq(campanhaMembrosTable.campanhaId, req.params.id),
        eq(campanhaMembrosTable.userId, req.params.userId),
      ),
    )
    .returning();

  if (!updated) { res.status(404).json({ error: "Membro não encontrado" }); return; }
  res.json(updated);
});

router.delete("/campanhas/:id/membros/:userId", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const currentUserId = req.user!.id;

  const isSelf = req.params.userId === currentUserId;
  if (!isSelf) {
    const isMestr = await getMestreCampaign(req.params.id, currentUserId);
    if (!isMestr) { res.status(403).json({ error: "Sem permissão" }); return; }
  }

  const targetMembro = await getMembroship(req.params.id, req.params.userId);
  if (!targetMembro) { res.status(404).json({ error: "Membro não encontrado" }); return; }

  if (targetMembro.papel === "mestre" && isSelf) {
    const allMembros = await db
      .select()
      .from(campanhaMembrosTable)
      .where(eq(campanhaMembrosTable.campanhaId, req.params.id));
    if (allMembros.length > 1) {
      res.status(400).json({ error: "Transfira o cargo de mestre antes de sair" }); return;
    }
    await db.delete(campanhasTable).where(eq(campanhasTable.id, req.params.id));
    res.status(204).send(); return;
  }

  await db
    .delete(campanhaMembrosTable)
    .where(
      and(
        eq(campanhaMembrosTable.campanhaId, req.params.id),
        eq(campanhaMembrosTable.userId, req.params.userId),
      ),
    );

  res.status(204).send();
});

export default router;
