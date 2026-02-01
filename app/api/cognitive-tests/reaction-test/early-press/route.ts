import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const SECRET = process.env.JWT_SECRET;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, SECRET) as { id: string; name: string | null };
      userId = decoded.id;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { earlyPressCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      earlyPressCount: user.earlyPressCount,
    });
  } catch (error) {
    console.error("Early press tracking error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
