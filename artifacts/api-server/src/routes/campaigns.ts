import { Router, type IRouter, type Request, type Response } from "express";
import {
  db, campanhasTable, campanhaMembrosTable, usersTable,
  campanhaRolagensTable, campanhaPersonagensTable, personagensTable, classesTable,
} from "@workspace/db";
import { eq, and, inArray, desc } from "drizzle-orm";

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

function rolarPericia(qtdDadosBase: number, bonusPericia: number, modificadoresO: number) {
  const qtdTotal = qtdDadosBase + modificadoresO;
  const dados: number[] = [];
  let resultadoBase: number;
  let sucessoAutomatico = false;
  let modoPenalidade = false;

  if (qtdTotal > 0) {
    for (let i = 0; i < qtdTotal; i++) {
      const d = Math.floor(Math.random() * 20) + 1;
      dados.push(d);
      if (d === 20) sucessoAutomatico = true;
    }
    resultadoBase = Math.max(...dados);
  } else {
    modoPenalidade = true;
    const qtdPenalidade = 2 + Math.abs(qtdTotal);
    for (let i = 0; i < qtdPenalidade; i++) {
      dados.push(Math.floor(Math.random() * 20) + 1);
    }
    resultadoBase = Math.min(...dados);
  }

  return { dados, resultadoBase, resultadoFinal: resultadoBase + bonusPericia, sucessoAutomatico, modoPenalidade };
}

function rolarDano(expressao: string): { dados: number[]; resultadoBase: number; resultadoFinal: number } {
  const m = expressao.trim().toLowerCase().match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!m) throw new Error(`Expressão de dano inválida: "${expressao}"`);
  const qty = Math.min(parseInt(m[1]), 20);
  const faces = Math.min(parseInt(m[2]), 100);
  const bonus = m[3] ? parseInt(m[3]) : 0;
  const dados = Array.from({ length: qty }, () => Math.floor(Math.random() * faces) + 1);
  const soma = dados.reduce((a, b) => a + b, 0);
  return { dados, resultadoBase: soma, resultadoFinal: soma + bonus };
}

router.post("/campanhas/:id/rolagens", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;

  const membership = await getMembroship(req.params.id, userId);
  if (!membership) { res.status(403).json({ error: "Você não é membro desta campanha" }); return; }

  const { rolandoComo, label, tipo, atributo, qtdDadosBase, bonusPericia, modificadoresO, expressaoDano } = req.body;

  let rollResult: { dados: number[]; resultadoBase: number; resultadoFinal: number; sucessoAutomatico?: boolean; modoPenalidade?: boolean };

  try {
    if (tipo === "dano") {
      if (!expressaoDano) { res.status(400).json({ error: "expressaoDano required for tipo=dano" }); return; }
      rollResult = rolarDano(expressaoDano);
    } else {
      const base = typeof qtdDadosBase === "number" ? qtdDadosBase : 1;
      const bonus = typeof bonusPericia === "number" ? bonusPericia : 0;
      const mods = typeof modificadoresO === "number" ? modificadoresO : 0;
      rollResult = rolarPericia(base, bonus, mods);
    }
  } catch (e: any) {
    res.status(400).json({ error: e.message }); return;
  }

  const [rolagem] = await db
    .insert(campanhaRolagensTable)
    .values({
      campanhaId: req.params.id,
      userId,
      rolandoComo: rolandoComo ?? null,
      label: label ?? null,
      tipo: tipo ?? "pericia",
      atributo: atributo ?? null,
      qtdDadosBase: typeof qtdDadosBase === "number" ? qtdDadosBase : 1,
      bonusPericia: typeof bonusPericia === "number" ? bonusPericia : 0,
      modificadoresO: typeof modificadoresO === "number" ? modificadoresO : 0,
      expressaoDano: expressaoDano ?? null,
      dadosRolados: rollResult.dados,
      resultadoBase: rollResult.resultadoBase,
      resultadoFinal: rollResult.resultadoFinal,
      sucessoAutomatico: rollResult.sucessoAutomatico ?? false,
      modoPenalidade: rollResult.modoPenalidade ?? false,
    })
    .returning();

  const [user] = await db.select({ firstName: usersTable.firstName, email: usersTable.email })
    .from(usersTable).where(eq(usersTable.id, userId));

  res.status(201).json({ ...rolagem, user });
});

router.get("/campanhas/:id/rolagens", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;

  const membership = await getMembroship(req.params.id, userId);
  if (!membership) { res.status(403).json({ error: "Forbidden" }); return; }

  const rows = await db
    .select({
      id: campanhaRolagensTable.id,
      campanhaId: campanhaRolagensTable.campanhaId,
      userId: campanhaRolagensTable.userId,
      rolandoComo: campanhaRolagensTable.rolandoComo,
      label: campanhaRolagensTable.label,
      tipo: campanhaRolagensTable.tipo,
      atributo: campanhaRolagensTable.atributo,
      qtdDadosBase: campanhaRolagensTable.qtdDadosBase,
      bonusPericia: campanhaRolagensTable.bonusPericia,
      modificadoresO: campanhaRolagensTable.modificadoresO,
      expressaoDano: campanhaRolagensTable.expressaoDano,
      dadosRolados: campanhaRolagensTable.dadosRolados,
      resultadoBase: campanhaRolagensTable.resultadoBase,
      resultadoFinal: campanhaRolagensTable.resultadoFinal,
      sucessoAutomatico: campanhaRolagensTable.sucessoAutomatico,
      modoPenalidade: campanhaRolagensTable.modoPenalidade,
      createdAt: campanhaRolagensTable.createdAt,
      userFirstName: usersTable.firstName,
      userEmail: usersTable.email,
    })
    .from(campanhaRolagensTable)
    .innerJoin(usersTable, eq(campanhaRolagensTable.userId, usersTable.id))
    .where(eq(campanhaRolagensTable.campanhaId, req.params.id))
    .orderBy(desc(campanhaRolagensTable.createdAt))
    .limit(100);

  res.json(rows);
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

router.get("/campanhas/:id/personagens", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const membership = await getMembroship(req.params.id, userId);
  if (!membership) { res.status(403).json({ error: "Forbidden" }); return; }

  const rows = await db
    .select({
      id: campanhaPersonagensTable.id,
      campanhaId: campanhaPersonagensTable.campanhaId,
      personagemId: campanhaPersonagensTable.personagemId,
      userId: campanhaPersonagensTable.userId,
      addedAt: campanhaPersonagensTable.addedAt,
      personagemNome: personagensTable.nome,
      personagemNex: personagensTable.nex,
      personagemNivel: personagensTable.nivel,
      personagemPatente: personagensTable.patente,
      personagemForca: personagensTable.forca,
      personagemAgilidade: personagensTable.agilidade,
      personagemIntelecto: personagensTable.intelecto,
      personagemVigor: personagensTable.vigor,
      personagemPresenca: personagensTable.presenca,
      personagemDefesa: personagensTable.defesa,
      personagemPvAtual: personagensTable.pvAtual,
      personagemPvMaximo: personagensTable.pvMaximo,
      personagemPeAtual: personagensTable.peAtual,
      personagemPeMaximo: personagensTable.peMaximo,
      personagemSanAtual: personagensTable.sanAtual,
      personagemSanMaximo: personagensTable.sanMaximo,
      personagemPericias: personagensTable.pericias,
      classeNome: classesTable.nome,
      classeId: personagensTable.classeId,
      userFirstName: usersTable.firstName,
      userEmail: usersTable.email,
    })
    .from(campanhaPersonagensTable)
    .innerJoin(personagensTable, eq(campanhaPersonagensTable.personagemId, personagensTable.id))
    .leftJoin(classesTable, eq(personagensTable.classeId, classesTable.id))
    .innerJoin(usersTable, eq(campanhaPersonagensTable.userId, usersTable.id))
    .where(eq(campanhaPersonagensTable.campanhaId, req.params.id))
    .orderBy(campanhaPersonagensTable.addedAt);

  res.json(rows);
});

router.post("/campanhas/:id/personagens", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const membership = await getMembroship(req.params.id, userId);
  if (!membership) { res.status(403).json({ error: "Você não é membro desta campanha" }); return; }

  const { personagemId } = req.body;
  if (!personagemId) { res.status(400).json({ error: "personagemId required" }); return; }

  const [personagem] = await db.select().from(personagensTable).where(eq(personagensTable.id, personagemId));
  if (!personagem) { res.status(404).json({ error: "Personagem não encontrado" }); return; }

  const isMestr = await getMestreCampaign(req.params.id, userId);
  if (!isMestr && personagem.userId !== userId) {
    res.status(403).json({ error: "Você só pode adicionar seus próprios personagens" }); return;
  }

  const emQualquerCampanha = await db.select({
    campanhaId: campanhaPersonagensTable.campanhaId,
    campanhaNome: campanhasTable.nome,
  })
    .from(campanhaPersonagensTable)
    .innerJoin(campanhasTable, eq(campanhaPersonagensTable.campanhaId, campanhasTable.id))
    .where(eq(campanhaPersonagensTable.personagemId, personagemId));

  if (emQualquerCampanha.length > 0) {
    const nomeCampanha = emQualquerCampanha[0].campanhaNome;
    res.status(409).json({
      error: `Este agente já está em outra operação: "${nomeCampanha}". Um agente só pode participar de uma operação por vez.`,
    });
    return;
  }

  await db.insert(campanhaPersonagensTable).values({
    campanhaId: req.params.id,
    personagemId,
    userId: personagem.userId,
  });

  const [row] = await db.select({
    id: campanhaPersonagensTable.id,
    campanhaId: campanhaPersonagensTable.campanhaId,
    personagemId: campanhaPersonagensTable.personagemId,
    userId: campanhaPersonagensTable.userId,
    addedAt: campanhaPersonagensTable.addedAt,
    personagemNome: personagensTable.nome,
    personagemNex: personagensTable.nex,
    personagemNivel: personagensTable.nivel,
    personagemPatente: personagensTable.patente,
    personagemForca: personagensTable.forca,
    personagemAgilidade: personagensTable.agilidade,
    personagemIntelecto: personagensTable.intelecto,
    personagemVigor: personagensTable.vigor,
    personagemPresenca: personagensTable.presenca,
    personagemDefesa: personagensTable.defesa,
    personagemPvAtual: personagensTable.pvAtual,
    personagemPvMaximo: personagensTable.pvMaximo,
    personagemPeAtual: personagensTable.peAtual,
    personagemPeMaximo: personagensTable.peMaximo,
    personagemSanAtual: personagensTable.sanAtual,
    personagemSanMaximo: personagensTable.sanMaximo,
    personagemPericias: personagensTable.pericias,
    classeNome: classesTable.nome,
    classeId: personagensTable.classeId,
    userFirstName: usersTable.firstName,
    userEmail: usersTable.email,
  })
    .from(campanhaPersonagensTable)
    .innerJoin(personagensTable, eq(campanhaPersonagensTable.personagemId, personagensTable.id))
    .leftJoin(classesTable, eq(personagensTable.classeId, classesTable.id))
    .innerJoin(usersTable, eq(campanhaPersonagensTable.userId, usersTable.id))
    .where(and(eq(campanhaPersonagensTable.campanhaId, req.params.id), eq(campanhaPersonagensTable.personagemId, personagemId)));

  res.status(201).json(row);
});

router.delete("/campanhas/:id/personagens/:personagemId", async (req: Request, res: Response) => {
  if (!isMembro(req)) { res.status(401).json({ error: "Unauthorized" }); return; }
  const userId = req.user!.id;
  const membership = await getMembroship(req.params.id, userId);
  if (!membership) { res.status(403).json({ error: "Forbidden" }); return; }

  const [entry] = await db.select().from(campanhaPersonagensTable)
    .where(and(eq(campanhaPersonagensTable.campanhaId, req.params.id), eq(campanhaPersonagensTable.personagemId, req.params.personagemId)));
  if (!entry) { res.status(404).json({ error: "Personagem não encontrado nesta campanha" }); return; }

  const isMestr = await getMestreCampaign(req.params.id, userId);
  if (!isMestr && entry.userId !== userId) {
    res.status(403).json({ error: "Você só pode remover seus próprios personagens" }); return;
  }

  await db.delete(campanhaPersonagensTable)
    .where(and(eq(campanhaPersonagensTable.campanhaId, req.params.id), eq(campanhaPersonagensTable.personagemId, req.params.personagemId)));

  res.status(204).send();
});

export default router;
