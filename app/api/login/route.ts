import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined"); // fail fast
}
const SECRET = process.env.JWT_SECRET;

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
      { id: user.id, name: user.name },
      SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        email: user.email, // email can be removed in the future
      },
      { status: 200 }
    );

    // Return success
    response.cookies.set('auth_token', token, {
      httpOnly: true, // JS cannot read the token → XSS protection
      secure: false, // process.env.NODE_ENV === 'production', to set it to true we need https
      sameSite: 'lax', // prevents CSRF in most cases
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
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
