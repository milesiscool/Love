import { NextResponse } from 'next/server';
import { buildSession, encryptSession } from '@/lib/session';
import { getViewerCookieSecret, getViewerPassword, normalizeInputValue } from '@/lib/env';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? normalizeInputValue(body.password) : '';
  const configuredPassword = getViewerPassword();

  if (!configuredPassword) {
    return NextResponse.json({ error: 'Viewer password is not configured on the server.' }, { status: 500 });
  }

  if (!password || password !== configuredPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = getViewerCookieSecret();
  if (!secret) {
    return NextResponse.json({ error: 'VIEWER_COOKIE_SECRET is not configured' }, { status: 500 });
  }

  const token = await encryptSession(buildSession('viewer', 60 * 60 * 24 * 30), secret);
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set('viewer_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/'
  });
  return response;
}
