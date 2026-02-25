import { NextResponse } from 'next/server';
import { setDecision } from '@/lib/data';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const status = body?.status;
  const override = body?.override === true;

  if (status !== 'YES' && status !== 'NO') {
    return NextResponse.json({ error: 'Status must be YES or NO.' }, { status: 400 });
  }

  try {
    const result = await setDecision(status, override);
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 409 });
    }

    return NextResponse.json({ state: result.state }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set decision', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
