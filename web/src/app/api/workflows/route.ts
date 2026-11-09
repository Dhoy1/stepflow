import { NextRequest, NextResponse } from 'next/server';
import { getAllWorkflows, saveWorkflowToCloud } from '@/lib/serverStore';
import type { Workflow } from '@/types';

// CORS Headers so the Chrome Extension can call this API directly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const list = await getAllWorkflows();
    return NextResponse.json(list, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Workflow = await req.json();
    if (!body || !body.id || !body.title) {
      return NextResponse.json(
        { error: 'Invalid workflow data' },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await saveWorkflowToCloud(body);
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const shareUrl = `${protocol}://${host}/guide/${body.id}`;

    return NextResponse.json(
      { success: true, id: result.id, shareUrl },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('Error saving workflow:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

