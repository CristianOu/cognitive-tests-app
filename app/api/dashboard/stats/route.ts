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
    // 1. Get and verify JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Verify and decode the token to get userId
    let userId: string;
    try {
      const decoded = jwt.verify(token, SECRET) as { id: string; name: string | null };
      userId = decoded.id;
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // 2. Calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // 3. Get average reaction time for last 30 days
    const last30DaysStats = await prisma.reactionTestResult.aggregate({
      where: {
        userId: userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _avg: {
        reactionTime: true,
      },
      _count: true,
    });

    // 4. Get total tests count (all time)
    const totalTests = await prisma.reactionTestResult.count({
      where: { userId: userId },
    });

    // 5. Get tests this week count
    const testsThisWeek = await prisma.reactionTestResult.count({
      where: {
        userId: userId,
        createdAt: { gte: oneWeekAgo },
      },
    });

    // 6. Calculate percentile rank (simplified - compare against all users' averages)
    // Get all users' average reaction times
    const allUsersAvgs = await prisma.reactionTestResult.groupBy({
      by: ['userId'],
      _avg: {
        reactionTime: true,
      },
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const userAvg = last30DaysStats._avg.reactionTime || 0;
    
    const betterThan = allUsersAvgs.filter(
      (u) => (u._avg.reactionTime || Infinity) > userAvg
    ).length;
    const percentileRank = allUsersAvgs.length > 0 && userAvg > 0
      ? Math.round((betterThan / allUsersAvgs.length) * 100)
      : 0;

    // 7. Calculate improvement (compare last 7 days vs previous 7 days)
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);

    const lastWeekAvg = await prisma.reactionTestResult.aggregate({
      where: {
        userId: userId,
        createdAt: { gte: oneWeekAgo },
      },
      _avg: { reactionTime: true },
    });

    const previousWeekAvg = await prisma.reactionTestResult.aggregate({
      where: {
        userId: userId,
        createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
      },
      _avg: { reactionTime: true },
    });

    const improvement =
      lastWeekAvg._avg.reactionTime && previousWeekAvg._avg.reactionTime
        ? Math.round(previousWeekAvg._avg.reactionTime - lastWeekAvg._avg.reactionTime)
        : null;

    // 8. Return stats
    return NextResponse.json({
      avgReactionTime: last30DaysStats._avg.reactionTime
        ? Math.round(last30DaysStats._avg.reactionTime)
        : null,
      accuracyRate: 98, // TODO: Implement accuracy tracking
      percentileRank,
      totalTests,
      testsThisWeek,
      improvement, // positive means improvement (faster), negative means slower
      testsLast30Days: last30DaysStats._count,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
