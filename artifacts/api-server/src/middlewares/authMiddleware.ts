import { type Request, type Response, type NextFunction } from "express";
import { getSessionId, getSession, type SessionUser } from "../lib/auth";

declare global {
  namespace Express {
    interface User extends SessionUser {}

    interface Request {
      isAuthenticated(): this is AuthedRequest;
      user?: User | undefined;
    }

    export interface AuthedRequest extends Request {
      user: User;
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.isAuthenticated = function (this: Request) {
    return this.user != null;
  } as Request["isAuthenticated"];

  const sid = getSessionId(req);
  if (!sid) {
    next();
    return;
  }

  const session = await getSession(sid);
  if (!session?.user?.id) {
    next();
    return;
  }

  req.user = session.user;
  next();
}
