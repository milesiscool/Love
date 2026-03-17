import { NextRequest, NextResponse } from 'next/server';

type SessionPayload = {
  role: 'viewer' | 'admin';
  iat: number;
  exp: number;
};

function normalizeEnvValue(value: string) {
  const trimmed = value.trim();
  const singleQuoted = /^'(.*)'$/.exec(trimmed);
  if (singleQuoted) {
    return singleQuoted[1];
  }
  const doubleQuoted = /^"(.*)"$/.exec(trimmed);
  if (doubleQuoted) {
    return doubleQuoted[1];
  }
  return trimmed;
}

function getViewerCookieSecret() {
  return normalizeEnvValue(process.env.VIEWER_COOKIE_SECRET ?? '');
}

function getAdminCookieSecret() {
  return normalizeEnvValue(process.env.ADMIN_COOKIE_SECRET ?? '');
}

function fromHex(input: string) {
  if (input.length % 2 !== 0) {
    throw new Error('Invalid hex');
  }
  const bytes = new Uint8Array(input.length / 2);
  for (let i = 0; i < input.length; i += 2) {
    bytes[i / 2] = Number.parseInt(input.slice(i, i + 2), 16);
  }
  return bytes;
}

async function getHmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
}

async function decryptSession(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const [payloadHex, signatureHex] = token.split('.');
    if (!payloadHex || !signatureHex) {
      return null;
    }

    const payloadBytes = fromHex(payloadHex);
    const signatureBytes = fromHex(signatureHex);
    const key = await getHmacKey(secret);
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, payloadBytes);

    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as SessionPayload;
    if (Date.now() / 1000 > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

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
