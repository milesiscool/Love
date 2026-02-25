import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url));
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });
  return response;
}
