"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaApple, FaGoogle, FaFacebookF, FaLock } from "react-icons/fa";
import Image from "next/image";
import { authApi } from "@/lib/api/endpoints/auth";

const SignInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof SignInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>({ resolver: zodResolver(SignInSchema) });

  const mutation = useMutation({
    mutationFn: (payload: SignInForm) => {
      return authApi.tokenLogin({ username: payload.email, password: payload.password });
    },
    onSuccess: () => router.push("/dashboard"),
  });

  const onSubmit = (data: SignInForm) => mutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384] p-1.5 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-2 sm:p-4 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center">
        <div className="mb-1 sm:mb-3 flex flex-col items-center">
          <img src="/New-Logo.png" alt="Cheetah Logo" className="h-5 sm:h-8 mb-0.5 sm:mb-1" />
          <h2 className="text-sm sm:text-xl font-bold mb-0 sm:mb-0.5 text-[#1A1A1A]">Sign In Account</h2>
          <p className="text-gray-600 text-center text-[11px] sm:text-sm max-w-xs sm:max-w-md mb-0 leading-tight">
            Welcome back! Sign in to access your account.
          </p>
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)} autoComplete="on">
          <div className="mb-1.5 sm:mb-3">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <Image src="/Mail.png" alt="Email" width={14} height={14} className="mr-1.5 sm:mr-2" />
              <label className="font-bold text-black text-[11px] sm:text-sm" htmlFor="email">Email</label>
            </div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-xs sm:text-sm"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && <p className="text-red-600 text-[10px] sm:text-xs mt-0">{errors.email.message}</p>}
          </div>
          <div className="mb-1.5 sm:mb-3">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <FaLock className="text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <label className="font-bold text-black text-[11px] sm:text-sm" htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-xs sm:text-sm"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && <p className="text-red-600 text-[10px] sm:text-xs mt-0">{errors.password.message}</p>}
          </div>
          {mutation.isError && (
            <div className="text-red-600 text-[10px] sm:text-xs mb-1" role="alert">{(mutation.error as any)?.message || "Failed to sign in"}</div>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#8B2323] text-white py-1.5 sm:py-2.5 rounded-md sm:rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mb-1 sm:mb-1.5 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
          >
            {mutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="text-[10px] sm:text-sm text-gray-600 mt-0 mb-1 sm:mb-1.5 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#8B2323] font-semibold hover:underline cursor-pointer">Sign Up</Link>
        </div>
        <div className="flex items-center w-full my-1 sm:my-1.5">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-1.5 sm:mx-2 text-gray-400 text-[10px] sm:text-xs">or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex justify-center gap-1 sm:gap-2 w-full mt-0 mb-0 sm:mb-1">
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Apple"
          >
            <FaApple className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Google"
          >
            <FaGoogle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Facebook"
          >
            <FaFacebookF className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
