import { NextResponse } from 'next/server';
import { getNormalizedState } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const payload = await getNormalizedState();
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch state', details: error instanceof Error ? error.message : 'Unknown error' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
