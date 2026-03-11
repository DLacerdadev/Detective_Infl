import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  createSession,
  deleteSession,
  getSessionId,
  clearSession,
  setSessionCookie,
  type SessionUser,
} from "../lib/auth";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router: IRouter = Router();

router.get("/auth/user", (req: Request, res: Response) => {
  const isAuthenticated = req.isAuthenticated();
  res.json({
    isAuthenticated,
    user: isAuthenticated ? req.user : undefined,
  });
});

router.post("/auth/register", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres" });
    return;
  }

  const emailLower = String(email).toLowerCase().trim();

  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, emailLower));

  if (existing) {
    res.status(409).json({ error: "Este email já está em uso" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(usersTable)
    .values({
      email: emailLower,
      firstName: firstName || null,
      lastName: lastName || null,
      passwordHash,
      role: "user",
    })
    .returning();

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    role: user.role as "user" | "admin",
  };

  const sid = await createSession({ user: sessionUser });
  setSessionCookie(res, sid);

  res.status(201).json({
    isAuthenticated: true,
    user: sessionUser,
  });
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email e senha são obrigatórios" });
    return;
  }

  const emailLower = String(email).toLowerCase().trim();

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, emailLower));

  if (!user || !user.passwordHash) {
    res.status(401).json({ error: "Email ou senha inválidos" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Email ou senha inválidos" });
    return;
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    role: user.role as "user" | "admin",
  };

  const sid = await createSession({ user: sessionUser });
  setSessionCookie(res, sid);

  res.json({
    isAuthenticated: true,
    user: sessionUser,
  });
});

router.post("/auth/google", async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400).json({ error: "Credencial do Google não fornecida" });
    return;
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(500).json({ error: "Google OAuth não está configurado no servidor" });
    return;
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    res.status(401).json({ error: "Token do Google inválido" });
    return;
  }

  if (!payload?.email) {
    res.status(401).json({ error: "Não foi possível obter o email do Google" });
    return;
  }

  const emailLower = payload.email.toLowerCase();

  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, emailLower));

  if (!user) {
    const [created] = await db
      .insert(usersTable)
      .values({
        email: emailLower,
        firstName: payload.given_name || null,
        lastName: payload.family_name || null,
        role: "user",
      })
      .returning();
    user = created;
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    role: user.role as "user" | "admin",
  };

  const sid = await createSession({ user: sessionUser });
  setSessionCookie(res, sid);

  res.json({
    isAuthenticated: true,
    user: sessionUser,
  });
});

router.post("/auth/logout", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  await clearSession(res, sid);
  res.json({ success: true });
});

export default router;
