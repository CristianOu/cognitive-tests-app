import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const SECRET = process.env.JWT_SECRET;

// Validation schema - reaction time should be reasonable (50ms to 10 seconds)
const SaveResultSchema = z.object({
  reactionTime: z.number().int().min(50).max(10000),
});

export async function POST(req: Request) {
  try {
    // 1. Get and verify JWT token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    // 2. Verify and decode the token to get userId
    let userId: string;
    try {
      const decoded = jwt.verify(token, SECRET) as { id: string; name: string | null };
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 3. Parse and validate request body
    let body: { reactionTime: number };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = SaveResultSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid reaction time", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { reactionTime } = parsed.data;

    // 4. Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5. Save to database - userId comes from JWT (secure!)
    const result = await prisma.reactionTestResult.create({
      data: {
        userId,
        reactionTime,
      },
    });

    // 6. Return success
    return NextResponse.json(
      {
        success: true,
        reactionTime: result.reactionTime,
        createdAt: result.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Save reaction test error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
