"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaApple, FaGoogle, FaFacebookF, FaEnvelope, FaPhone, FaUser, FaHome } from "react-icons/fa";
import { authApi } from "@/lib/api/endpoints/auth";

const SignInSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Home address is required"),
});

type SignInForm = z.infer<typeof SignInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({ resolver: zodResolver(SignInSchema) });

  const mutation = useMutation({
    mutationFn: (payload: SignInForm) =>
      authApi.tokenLogin({
        username: payload.identifier,
        password: payload.password,
      }),
    onSuccess: () => router.push("/dashboard"),
  });

  const onSubmit = (data: SignInForm) => mutation.mutate(data);

  return (
    <AuthCard
      title="Sign In"
      subtitle="Welcome back! Sign in to access your account."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-[#8B2323] font-semibold hover:underline cursor-pointer"
          >
            Sign Up
          </Link>
        </>
      }
      socialButtons={
        <>
          <button className="border border-[#8B2323] text-[#8B2323] rounded-full p-2.5 hover:bg-[#8B2323]/10 transition-colors cursor-pointer">
            <FaApple className="w-5 h-5" />
          </button>
          <button className="border border-[#8B2323] text-[#8B2323] rounded-full p-2.5 hover:bg-[#8B2323]/10 transition-colors cursor-pointer">
            <FaGoogle className="w-5 h-5" />
          </button>
        </>
      }
    >
      <form
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <div className="mb-2">
          <div className="flex items-center mb-0.5">
            <FaEnvelope className="text-gray-400 w-4 h-4 mr-1" />
            <FaPhone className="text-gray-400 w-4 h-4 mr-1" />
            <label
              className="font-bold text-black text-sm"
              htmlFor="identifier"
            >
              Email or Phone Number
            </label>
          </div>
          <input
            id="identifier"
            type="text"
            placeholder="Email or Phone Number"
            className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
            autoComplete="username"
            {...register("identifier")}
          />
          {errors.identifier && (
            <p className="text-red-600 text-xs mt-1">
              {errors.identifier.message}
            </p>
          )}
        </div>
        <div className="mb-2">
          <div className="flex items-center mb-0.5">
            <FaLock className="text-gray-400 w-4 h-4 mr-1" />
            <label className="font-bold text-black text-sm" htmlFor="password">
              Password
            </label>
          </div>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        {mutation.isError && (
          <div className="text-red-600 text-xs mb-2" role="alert">
            {(mutation.error as any)?.message || "Failed to sign in"}
          </div>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#8B2323] text-white py-2.5 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mb-1 cursor-pointer disabled:opacity-60"
        >
          {mutation.isPending ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </AuthCard>
  );
}
