import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from 'next/server';

export async function GET() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authStatus = await isAuthenticated();
  const user = authStatus ? await getUser() : null;

  return NextResponse.json({ isAuthenticated: authStatus, user });
}