import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from 'next/server';

export async function GET() {
  const { isAuthenticated, getUser, getAccessToken } = getKindeServerSession();
  
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 200 });
  }

  const [user, accessTokenData] = await Promise.all([getUser(), getAccessToken()]);

  if (!user?.id || !accessTokenData?.org_code || !accessTokenData?.sub) {
    return NextResponse.json({ error: 'Invalid user or token data' }, { status: 400 });
  }

  const { KINDE_DOMAIN, KINDE_MANAGEMENT_CLIENT_ID, KINDE_MANAGEMENT_CLIENT_SECRET } = process.env;

  if (!KINDE_DOMAIN || !KINDE_MANAGEMENT_CLIENT_ID || !KINDE_MANAGEMENT_CLIENT_SECRET) {
    throw new Error('Missing required environment variables');
  }

  try {
    const tokenResponse = await fetch(`${KINDE_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        audience: `${KINDE_DOMAIN}/api`,
        grant_type: 'client_credentials',
        client_id: KINDE_MANAGEMENT_CLIENT_ID,
        client_secret: KINDE_MANAGEMENT_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) throw new Error(`HTTP error! status: ${tokenResponse.status}`);
    
    const { access_token } = await tokenResponse.json();

    const rolesResponse = await fetch(`${KINDE_DOMAIN}/api/v1/organizations/${accessTokenData.org_code}/users/${accessTokenData.sub}/roles`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!rolesResponse.ok) throw new Error(`Failed to fetch roles. Status: ${rolesResponse.status}`);

    const roles = await rolesResponse.json();

    return NextResponse.json({ isAuthenticated: true, user, roles });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}