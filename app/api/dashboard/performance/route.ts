import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, SECRET) as { id: string };
      userId = decoded.id;
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const results = await prisma.reactionTestResult.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        reactionTime: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const performanceData = results.map((r) => ({
      date: `${r.createdAt.getMonth() + 1}/${r.createdAt.getDate()}`,
      time: `${r.createdAt.getHours().toString().padStart(2, "0")}:${r.createdAt.getMinutes().toString().padStart(2, "0")}`,
      reactionTime: r.reactionTime,
    }));

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error("Dashboard performance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
