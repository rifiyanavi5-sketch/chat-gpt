import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { assertRole, getRequestAuth } from "@/lib/auth";

const roleMap: Record<string, Role[]> = {
  "/api/admin": [Role.ADMIN],
  "/api/operator": [Role.OPERATOR, Role.ADMIN],
  "/api/stock/transfer": [Role.ADMIN, Role.OPERATOR],
  "/admin": [Role.ADMIN],
  "/operator": [Role.OPERATOR, Role.ADMIN]
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const matchedPrefix = Object.keys(roleMap).find((prefix) => pathname.startsWith(prefix));

  if (!matchedPrefix) {
    return NextResponse.next();
  }

  const auth = getRequestAuth(request);
  if (!auth) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!assertRole(auth.role, roleMap[matchedPrefix])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/operator/:path*"]
};
