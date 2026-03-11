import { Router, type IRouter, type Request, type Response } from "express";
import { db, classesTable, origensTable, periciasTable, rituaisTable, itensTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function isAdmin(req: Request): boolean {
  return req.isAuthenticated() && req.user?.role === "admin";
}

router.get("/classes", async (_req: Request, res: Response) => {
  const rows = await db.select().from(classesTable).orderBy(classesTable.nome);
  res.json(rows.map(mapClass));
});

router.post("/classes", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, descricao, pvInicial = 8, pvPorNivel = 4, peInicial = 4, pePorNivel = 2, sanInicial = 12, sanPorNivel = 4, periciasTreindasBase = 3 } = req.body;
  if (!nome) { res.status(400).json({ error: "nome required" }); return; }
  const [row] = await db.insert(classesTable).values({ nome, descricao, pvInicial, pvPorNivel, peInicial, pePorNivel, sanInicial, sanPorNivel, periciasTreindasBase }).returning();
  res.status(201).json(mapClass(row));
});

router.put("/classes/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, descricao, pvInicial, pvPorNivel, peInicial, pePorNivel, sanInicial, sanPorNivel, periciasTreindasBase } = req.body;
  const [row] = await db.update(classesTable).set({ nome, descricao, pvInicial, pvPorNivel, peInicial, pePorNivel, sanInicial, sanPorNivel, periciasTreindasBase }).where(eq(classesTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapClass(row));
});

router.delete("/classes/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.delete(classesTable).where(eq(classesTable.id, req.params.id));
  res.status(204).send();
});

router.get("/origins", async (_req: Request, res: Response) => {
  const rows = await db.select().from(origensTable).orderBy(origensTable.nome);
  res.json(rows.map(mapOrigin));
});

router.post("/origins", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, descricao, periciasConcedidas = [], poderConcedido } = req.body;
  if (!nome) { res.status(400).json({ error: "nome required" }); return; }
  const [row] = await db.insert(origensTable).values({ nome, descricao, periciasConcedidas, poderConcedido }).returning();
  res.status(201).json(mapOrigin(row));
});

router.put("/origins/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, descricao, periciasConcedidas, poderConcedido } = req.body;
  const [row] = await db.update(origensTable).set({ nome, descricao, periciasConcedidas, poderConcedido }).where(eq(origensTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapOrigin(row));
});

router.delete("/origins/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.delete(origensTable).where(eq(origensTable.id, req.params.id));
  res.status(204).send();
});

router.get("/pericias", async (_req: Request, res: Response) => {
  const rows = await db.select().from(periciasTable).orderBy(periciasTable.nome);
  res.json(rows.map(mapPericia));
});

router.post("/pericias", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, atributoBase, somenteTrainada = false } = req.body;
  if (!nome || !atributoBase) { res.status(400).json({ error: "nome and atributoBase required" }); return; }
  const [row] = await db.insert(periciasTable).values({ nome, atributoBase, somenteTrainada }).returning();
  res.status(201).json(mapPericia(row));
});

router.put("/pericias/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, atributoBase, somenteTrainada } = req.body;
  const [row] = await db.update(periciasTable).set({ nome, atributoBase, somenteTrainada }).where(eq(periciasTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapPericia(row));
});

router.delete("/pericias/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.delete(periciasTable).where(eq(periciasTable.id, req.params.id));
  res.status(204).send();
});

router.get("/rituals", async (_req: Request, res: Response) => {
  const rows = await db.select().from(rituaisTable).orderBy(rituaisTable.circulo, rituaisTable.nome);
  res.json(rows.map(mapRitual));
});

router.post("/rituals", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, elemento, circulo = 1, execucao, alcance, alvo, duracao, resistencia, custoPe = 2, descricao } = req.body;
  if (!nome || !elemento) { res.status(400).json({ error: "nome and elemento required" }); return; }
  const [row] = await db.insert(rituaisTable).values({ nome, elemento, circulo, execucao, alcance, alvo, duracao, resistencia, custoPe, descricao }).returning();
  res.status(201).json(mapRitual(row));
});

router.put("/rituals/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, elemento, circulo, execucao, alcance, alvo, duracao, resistencia, custoPe, descricao } = req.body;
  const [row] = await db.update(rituaisTable).set({ nome, elemento, circulo, execucao, alcance, alvo, duracao, resistencia, custoPe, descricao }).where(eq(rituaisTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapRitual(row));
});

router.delete("/rituals/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.delete(rituaisTable).where(eq(rituaisTable.id, req.params.id));
  res.status(204).send();
});

router.get("/items", async (_req: Request, res: Response) => {
  const rows = await db.select().from(itensTable).orderBy(itensTable.tipo, itensTable.nome);
  res.json(rows.map(mapItem));
});

router.post("/items", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, tipo = "Utilitario", descricao, espacos = 1, categoria, peso, preco = 0, requisitos } = req.body;
  if (!nome) { res.status(400).json({ error: "nome required" }); return; }
  const [row] = await db.insert(itensTable).values({ nome, tipo, descricao, espacos, categoria, peso, preco, requisitos }).returning();
  res.status(201).json(mapItem(row));
});

router.put("/items/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { nome, tipo, descricao, espacos, categoria, peso, preco, requisitos } = req.body;
  const [row] = await db.update(itensTable).set({ nome, tipo, descricao, espacos, categoria, peso, preco, requisitos }).where(eq(itensTable.id, req.params.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapItem(row));
});

router.delete("/items/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  await db.delete(itensTable).where(eq(itensTable.id, req.params.id));
  res.status(204).send();
});

router.get("/admin/users", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const rows = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  res.json(rows.map(u => ({
    id: u.id,
    username: null,
    firstName: u.firstName,
    lastName: u.lastName,
    profileImage: u.profileImageUrl,
    role: u.role,
    createdAt: u.createdAt,
  })));
});

router.put("/admin/users/:id/role", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) { res.status(400).json({ error: "Invalid role" }); return; }
  const [updated] = await db.update(usersTable).set({ role }).where(eq(usersTable.id, req.params.id)).returning();
  if (!updated) { res.status(404).json({ error: "User not found" }); return; }
  res.json({
    id: updated.id,
    username: null,
    firstName: updated.firstName,
    lastName: updated.lastName,
    profileImage: updated.profileImageUrl,
    role: updated.role,
    createdAt: updated.createdAt,
  });
});

function mapClass(row: Record<string, unknown>) {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    pvInicial: row.pvInicial,
    pvPorNivel: row.pvPorNivel,
    peInicial: row.peInicial,
    pePorNivel: row.pePorNivel,
    sanInicial: row.sanInicial,
    sanPorNivel: row.sanPorNivel,
    periciasTreindasBase: row.periciasTreindasBase,
    createdAt: row.createdAt,
  };
}

function mapOrigin(row: Record<string, unknown>) {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    periciasConcedidas: row.periciasConcedidas,
    poderConcedido: row.poderConcedido,
    createdAt: row.createdAt,
  };
}

function mapPericia(row: Record<string, unknown>) {
  return {
    id: row.id,
    nome: row.nome,
    atributoBase: row.atributoBase,
    somenteTrainada: row.somenteTrainada,
    createdAt: row.createdAt,
  };
}

function mapRitual(row: Record<string, unknown>) {
  return {
    id: row.id,
    nome: row.nome,
    elemento: row.elemento,
    circulo: row.circulo,
    execucao: row.execucao,
    alcance: row.alcance,
    alvo: row.alvo,
    duracao: row.duracao,
    resistencia: row.resistencia,
    custoPe: row.custoPe,
    descricao: row.descricao,
    createdAt: row.createdAt,
  };
}

function mapItem(row: Record<string, unknown>) {
  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo,
    descricao: row.descricao,
    espacos: row.espacos,
    categoria: row.categoria,
    peso: row.peso,
    preco: row.preco,
    requisitos: row.requisitos,
    createdAt: row.createdAt,
  };
}

export default router;
