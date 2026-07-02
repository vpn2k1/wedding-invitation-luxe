import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';
const protectedPaths = ['/admin', '/api/admin'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === '/admin/login';
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtectedPath || isLoginPage) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }

    return pathname.startsWith('/api/')
      ? NextResponse.json({ success: false, message: 'Admin auth is not configured.' }, { status: 503 })
      : NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const expectedSession = encodeURIComponent(`${username}:${password}`);
  const currentSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (currentSession === expectedSession) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ success: false, message: 'Bạn cần đăng nhập admin.' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
