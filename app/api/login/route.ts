import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "devsecret";

// Define input validation schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email or password"),
  password: z.string().min(8, "Invalid email or password"),
});

export async function POST(req: Request) {
  try {
    let body: { email: string; password: string };
    // Parse body safely
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid or empty JSON body' },
        { status: 400 }
      )
    }

    // Parse and validate JSON input
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    // Return success
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: { id: user.id, email: user.email, role: user.role },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
