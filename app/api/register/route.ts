import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from "zod";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
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
        data: { email, passwordHash: hashed, name },
      });
  
    return NextResponse.json({ id: user.id, email: user.email, message: "User created" }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
