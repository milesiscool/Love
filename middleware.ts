import { NextRequest, NextResponse } from 'next/server';
import { decryptSession } from '@/lib/session';
import { getAdminCookieSecret, getViewerCookieSecret } from '@/lib/env';

async function hasValidViewerSessionAsync(request: NextRequest) {
  const token = request.cookies.get('viewer_session')?.value;
  const secret = getViewerCookieSecret();
  if (!token || !secret) {
    return false;
  }
  const payload = await decryptSession(token, secret);
  return payload?.role === 'viewer';
}

async function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  const secret = getAdminCookieSecret();
  if (!token || !secret) {
    return false;
  }
  const payload = await decryptSession(token, secret);
  return payload?.role === 'admin';
}

async function hasAnyValidSession(request: NextRequest) {
  const [viewerOk, adminOk] = await Promise.all([hasValidViewerSessionAsync(request), hasValidAdminSession(request)]);
  return viewerOk || adminOk;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    if (!(await hasValidAdminSession(request))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    if (!(await hasValidAdminSession(request))) {
      return NextResponse.json({ error: 'Unauthorized admin request' }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isPublicPath =
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname === '/manifest.webmanifest' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/favicon') ||
    pathname === '/sw.js';

  if (!isPublicPath && !(await hasAnyValidSession(request))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
