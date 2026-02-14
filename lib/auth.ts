import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { env } from "@/lib/env";

const TOKEN_NAME = "benclo_token";

type TokenPayload = {
  sub: string;
  role: Role;
  email: string;
};

export function signJwt(payload: TokenPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyJwt(token: string): TokenPayload {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}

export async function getServerAuth() {
  const token = cookies().get(TOKEN_NAME)?.value;
  if (!token) return null;

  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie() {
  cookies().delete(TOKEN_NAME);
}

export function getRequestAuth(request: NextRequest) {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  if (!token) return null;

  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}

export function assertRole(role: Role, allowed: Role[]) {
  return allowed.includes(role);
}
