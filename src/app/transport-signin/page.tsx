"use client";

import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaApple, FaGoogle, FaFacebookF, FaLock, FaFileAlt } from "react-icons/fa";

const TransportSignInSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  password: z.string().min(1, "Password is required"),
});

type TransportSignInForm = z.infer<typeof TransportSignInSchema>;

export default function TransportSignInPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<TransportSignInForm>({ 
    resolver: zodResolver(TransportSignInSchema) 
  });

  const mutation = useMutation({
    mutationFn: (payload: TransportSignInForm) => {
      // Store transporter data in localStorage for authentication
      const transporterData = {
        companyName: payload.companyName,
        userType: "transporter",
      };
      localStorage.setItem('user', JSON.stringify(transporterData));
      return Promise.resolve({ success: true });
    },
    onSuccess: () => router.push("/transport"),
  });

  const onSubmit = (data: TransportSignInForm) => mutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384] p-1.5 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-2 sm:p-4 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center">
        <div className="mb-4 sm:mb-6 flex flex-col items-center">
          <button 
            onClick={() => router.push("/")}
            className="cursor-pointer hover:opacity-80 transition-opacity mb-2 sm:mb-3"
            aria-label="Go to home page"
          >
            <img src="/Cheetah 2.svg" alt="Cheetah Logo" className="h-8 sm:h-12" />
          </button>
          <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 text-[#1A1A1A]">Sign In</h2>
          <p className="text-gray-600 text-center text-xs sm:text-sm max-w-xs sm:max-w-md mb-0 leading-relaxed">
            Welcome back. Access your secure dashboard to manage buses and routes.
          </p>
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)} autoComplete="on">
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center mb-1.5 sm:mb-2">
              <FaFileAlt className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="companyName">Company Name</label>
            </div>
            <input
              id="companyName"
              type="text"
              placeholder="Company Name"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm sm:text-base"
              autoComplete="organization"
              {...register("companyName")}
            />
            {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName.message}</p>}
          </div>
          <div className="mb-4 sm:mb-5">
            <div className="flex items-center mb-1.5 sm:mb-2">
              <FaLock className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm sm:text-base"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {mutation.isError && (
            <div className="text-red-600 text-xs sm:text-sm mb-2" role="alert">{(mutation.error as any)?.message || "Failed to sign in"}</div>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#8B2323] text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 hover:opacity-90 mb-3 sm:mb-4 cursor-pointer disabled:opacity-60"
          >
            {mutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 text-center">
          Don't have an account?{' '}
          <Link href="/transport-signup" className="text-[#8B2323] font-semibold hover:underline cursor-pointer">Sign Up</Link>
        </div>
        <div className="flex items-center w-full my-2 sm:my-3">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 sm:mx-3 text-gray-400 text-xs sm:text-sm">or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex justify-center gap-2 sm:gap-3 w-full">
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Apple"
          >
            <FaApple className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Mail"
          >
            <FaGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Facebook"
          >
            <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

