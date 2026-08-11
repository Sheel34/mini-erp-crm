import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface AuthUser {
  userId: string;
  role: string;
}

export function requireAuth(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = _req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = header.substring(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "JWT secret is not configured",
    });
  }

  try {
    const payload = jwt.verify(token, secret) as AuthUser;

    res.locals.user = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as AuthUser | undefined;

    if (!user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
      });
    }

    next();
  };
}