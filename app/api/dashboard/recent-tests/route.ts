import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const SECRET = process.env.JWT_SECRET;

const TEST_TYPE_LABELS: Record<string, string> = {
  REACTION: "Visual Reflex",
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, SECRET) as { id: string; name: string | null };
      userId = decoded.id;
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Fetch recent test sessions and user data in parallel
    const [sessions, user, reactionTestCount] = await Promise.all([
      prisma.testSession.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { earlyPressCount: true },
      }),
      prisma.reactionTestResult.count({
        where: { userId },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compute accuracy per test type
    const accuracyByType: Record<string, number> = {
      REACTION:
        reactionTestCount + user.earlyPressCount > 0
          ? Math.round((reactionTestCount / (reactionTestCount + user.earlyPressCount)) * 100)
          : 100,
    };

    const recentTests = sessions.map((session) => {
      const date = new Date(session.createdAt);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();

      const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      let dateStr: string;
      if (isToday) {
        dateStr = `Today, ${time}`;
      } else if (isYesterday) {
        dateStr = `Yesterday, ${time}`;
      } else {
        dateStr = `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
      }

      return {
        id: session.id,
        dateTime: dateStr,
        testType: TEST_TYPE_LABELS[session.testType] || session.testType,
        resultValue: session.resultValue,
        accuracy: accuracyByType[session.testType] ?? 100,
        status: session.status as "completed" | "failed",
      };
    });

    return NextResponse.json(recentTests);
  } catch (error) {
    console.error("Recent tests error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
