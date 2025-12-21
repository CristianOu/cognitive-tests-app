import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import jwt from 'jsonwebtoken';

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined'); // fail fast
    }

    let body: { email: string; password: string; name?: string };

    // Parse body safely
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid or empty JSON body' },
        { status: 400 }
      )
    }

    // Validate schema
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password, name } = body;
  
    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
  
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Check if password is strong enough
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }
  
    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { email, passwordHash: hashed, name }, // role: 'USER' is optional
    });

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ email: user.email, success: true }, { status: 201 }); // email can be removed in production version
    
    response.cookies.set('auth_token', token, {
    httpOnly: true, // JS cannot read the token → XSS protection
    secure: false, // process.env.NODE_ENV === 'production', to set it to true we need https
    sameSite: 'lax', // prevents CSRF in most cases
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  return response;
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
