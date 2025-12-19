import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: false, // process.env.NODE_ENV === 'production', to set it to true we need https
    sameSite: "lax",
    maxAge: 0, // delete cookie
    path: "/",
  });

  return response;
}
