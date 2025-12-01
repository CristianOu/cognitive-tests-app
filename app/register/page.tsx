"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from 'react-toastify';

export default function RegisterPage() {
  const [isMounted, setIsMounted] = useState(false);

  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", name: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.error) {
        console.error(result.error);
        toast.error(result.error);
      } else {
        // Save token and redirect on successful registration
        // login(result.token);
        toast.success('Registration successful!');
        // router.push('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-md shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full border p-2 rounded"
          autoComplete="email"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full border p-2 rounded"
          autoComplete="new-password"
          required
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="w-full border p-2 rounded"
          autoComplete="name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded" disabled={isSubmitting}>
          Register
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
