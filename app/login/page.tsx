"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from 'cookies-next/client';
import { ToastContainer, toast } from "react-toastify";

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false); // Used to fix hydration error

  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data.email, data.password);
  };

  useEffect(() => {
    setIsMounted(true);
    const redirectTarget = getCookie("auth_redirect");
    if (redirectTarget) {
      toast.info(`You need to have an account to access ${redirectTarget}`);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      { isMounted && (
          <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-md shadow">
            <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full border p-2 rounded"
                autoComplete="username"
                required
              />
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full border p-2 rounded"
                autoComplete="current-password"
                required
              />
              {errors.password || errors.email ? (
                <p className="text-red-500 text-sm">{errors.password?.message || errors.email?.message}</p>
              ) : null}
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={isSubmitting}>
                Log In
              </button>
            </form>
          </div>
        )
      }
    </>
  );
}
