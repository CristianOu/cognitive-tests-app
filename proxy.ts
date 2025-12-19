// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname && pathname.startsWith('/dashboard')) {
    return handleDashboardAuth(req);
  }
}

function handleDashboardAuth(req: NextRequest) {
  if (!req) {
    console.log('❌ req is undefined');
    return NextResponse.redirect(new URL('/login'));
  }
  const token = req.cookies.get('auth_token')?.value;
  if (!token) {
    console.log('❌ token is undefined', req.url);
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("auth_redirect", "Dashboard", {
    maxAge: 10,
    sameSite: "lax",
    path: "/",
  });
  return res;
  }
  if (!process.env.JWT_SECRET) {
    console.log('❌ JWT_SECRET is not defined', req.url);
    return NextResponse.redirect(new URL('/', req.url));
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
