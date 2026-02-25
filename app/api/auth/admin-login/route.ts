import { NextResponse } from 'next/server';
import { buildSession, encryptSession } from '@/lib/session';
import { getAdminCookieSecret, getAdminPassword } from '@/lib/env';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = body?.password;

  if (!password || password !== getAdminPassword()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = getAdminCookieSecret();
  if (!secret) {
    return NextResponse.json({ error: 'ADMIN_COOKIE_SECRET is not configured' }, { status: 500 });
  }

  const token = await encryptSession(buildSession('admin', 60 * 60 * 12), secret);
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 12,
    path: '/'
  });
  return response;
}
