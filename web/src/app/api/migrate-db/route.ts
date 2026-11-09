import { NextResponse } from 'next/server';
import { pool, isMySQLConfigured } from '@/lib/mysql';

export async function GET() {
  if (!isMySQLConfigured || !pool) {
    return NextResponse.json({ error: 'MySQL not configured' }, { status: 500 });
  }

  const results: any[] = [];
  try {
    await pool.execute('ALTER TABLE steps ADD COLUMN target_element_json LONGTEXT NULL')
      .then(() => results.push('Added target_element_json column'))
      .catch((e: any) => results.push('target_element_json: ' + e.message));

    await pool.execute('ALTER TABLE steps ADD COLUMN arrows_json LONGTEXT NULL')
      .then(() => results.push('Added arrows_json column'))
      .catch((e: any) => results.push('arrows_json: ' + e.message));

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, results }, { status: 500 });
  }
}

