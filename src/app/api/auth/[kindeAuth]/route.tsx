import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: any): Promise<any> {
  const params = await props.params;
  const endpoint = params.kindeAuth;

  if (endpoint !== 'setup') {
    return handleAuth(request, endpoint);
  } else {
    return NextResponse.json("User not logged in", {
      status: 200,
    });
}
}