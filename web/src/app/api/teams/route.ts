import { NextRequest, NextResponse } from 'next/server';
import { getTeamAccountsFromDB, saveTeamAccountToDB, deleteTeamAccountFromDB } from '@/lib/serverStore';
import type { TeamProfile } from '@/types';

// CORS Headers so the Chrome Extension / Client can call this API directly
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const teams = await getTeamAccountsFromDB();
    return NextResponse.json(
      {
        success: true,
        teams,
        defaultPin: '1234'
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch team accounts' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: TeamProfile = await req.json();
    if (!body || !body.id || !body.name || !body.pin) {
      return NextResponse.json(
        { error: 'id, name, and pin are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    await saveTeamAccountToDB(body);
    const updatedList = await getTeamAccountsFromDB();
    return NextResponse.json(
      { success: true, teams: updatedList },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to save team account' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'id query parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    await deleteTeamAccountFromDB(id);
    const updatedList = await getTeamAccountsFromDB();
    return NextResponse.json(
      { success: true, teams: updatedList },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to delete team account' },
      { status: 500, headers: corsHeaders }
    );
  }
}

