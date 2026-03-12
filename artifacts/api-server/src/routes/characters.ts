import { Router, type IRouter, type Request, type Response } from "express";
import { db, personagensTable, classesTable, origensTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/characters", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const chars = await db.query.personagensTable.findMany({
    where: eq(personagensTable.userId, req.user.id),
    with: {
      classe: true,
      origem: true,
    },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  res.json(chars.map(mapCharacter));
});

router.post("/characters", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const {
    nome, classeId, origemId, nivel = 1, nex = 0,
    patente = "Recruta", forca = 1, agilidade = 1,
    intelecto = 1, vigor = 1, presenca = 1, historia, pericias = [],
  } = req.body;

  if (!nome) {
    res.status(400).json({ error: "nome is required" });
    return;
  }

  let pvMaximo = 10;
  let peMaximo = 4;
  let sanMaximo = 12;

  if (classeId) {
    const [classe] = await db.select().from(classesTable).where(eq(classesTable.id, classeId));
    if (classe) {
      pvMaximo  = classe.pvInicial  + (classe.pvPorNivel  * (nivel - 1)) + vigor;
      peMaximo  = classe.peInicial  + (classe.pePorNivel  * (nivel - 1)) + presenca;
      sanMaximo = classe.sanInicial + (classe.sanPorNivel * (nivel - 1)) + presenca;
    }
  }

  const defesa = 10 + agilidade;

  const [char] = await db.insert(personagensTable).values({
    userId: req.user.id,
    nome,
    classeId: classeId || null,
    origemId: origemId || null,
    nivel,
    nex,
    patente,
    pvAtual: pvMaximo,
    pvMaximo,
    peAtual: peMaximo,
    peMaximo,
    sanAtual: sanMaximo,
    sanMaximo,
    forca,
    agilidade,
    intelecto,
    vigor,
    presenca,
    defesa,
    historia: historia || null,
    pericias,
    rituals: [],
    inventario: [],
  }).returning();

  const full = await db.query.personagensTable.findFirst({
    where: eq(personagensTable.id, char.id),
    with: { classe: true, origem: true },
  });

  res.status(201).json(mapCharacter(full!));
});

router.get("/characters/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const char = await db.query.personagensTable.findFirst({
    where: eq(personagensTable.id, req.params.id),
    with: { classe: true, origem: true },
  });

  if (!char || (char.userId !== req.user.id && req.user.role !== "admin")) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.json(mapCharacter(char));
});

router.put("/characters/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const existing = await db.query.personagensTable.findFirst({
    where: eq(personagensTable.id, req.params.id),
  });

  if (!existing || (existing.userId !== req.user.id && req.user.role !== "admin")) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const updateData: Record<string, unknown> = {};
  const allowed = [
    "nome", "classeId", "origemId", "nivel", "nex", "patente",
    "pvAtual", "pvMaximo", "peAtual", "peMaximo", "sanAtual", "sanMaximo",
    "forca", "agilidade", "intelecto", "vigor", "presenca", "defesa",
    "historia", "pericias", "rituals", "inventario",
  ];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      const dbKey = camelToSnake(key);
      updateData[dbKey === key ? key : dbKey] = req.body[key];
    }
  }

  const [updated] = await db
    .update(personagensTable)
    .set(req.body)
    .where(eq(personagensTable.id, req.params.id))
    .returning();

  const full = await db.query.personagensTable.findFirst({
    where: eq(personagensTable.id, updated.id),
    with: { classe: true, origem: true },
  });

  res.json(mapCharacter(full!));
});

router.delete("/characters/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const existing = await db.query.personagensTable.findFirst({
    where: eq(personagensTable.id, req.params.id),
  });

  if (!existing || (existing.userId !== req.user.id && req.user.role !== "admin")) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  await db.delete(personagensTable).where(eq(personagensTable.id, req.params.id));
  res.status(204).send();
});

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function mapCharacter(char: Record<string, unknown>) {
  return {
    id: char.id,
    userId: char.userId,
    nome: char.nome,
    classeId: char.classeId,
    origemId: char.origemId,
    nivel: char.nivel,
    nex: char.nex,
    patente: char.patente,
    pvAtual: char.pvAtual,
    pvMaximo: char.pvMaximo,
    peAtual: char.peAtual,
    peMaximo: char.peMaximo,
    sanAtual: char.sanAtual,
    sanMaximo: char.sanMaximo,
    forca: char.forca,
    agilidade: char.agilidade,
    intelecto: char.intelecto,
    vigor: char.vigor,
    presenca: char.presenca,
    defesa: char.defesa,
    historia: char.historia,
    pericias: char.pericias,
    rituals: char.rituals,
    inventario: char.inventario,
    classe: char.classe,
    origem: char.origem,
    createdAt: char.createdAt,
    updatedAt: char.updatedAt,
  };
}

export default router;
