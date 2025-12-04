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
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>({ resolver: zodResolver(SignInSchema) });

  const mutation = useMutation({
    mutationFn: (payload: SignInForm) => {
      // Use email or phone as identifier for login
      const identifier = payload.email || payload.phone;
      return authApi.tokenLogin({ username: identifier, password: "" });
    },
    onSuccess: () => router.push("/dashboard"),
  });

  const onSubmit = (data: SignInForm) => mutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384] p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
        <div className="mb-4 flex flex-col items-center">
          <img src="/Logo.png" alt="Cheetah Logo" className="h-10 mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-[#1A1A1A]">Sign In Account</h2>
          <p className="text-gray-600 text-center text-sm max-w-xs mb-2">
            Welcome back! Sign in to access your account and manage your bookings.
          </p>
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)} autoComplete="on">
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FaUser className="text-gray-400 w-4 h-4 mr-2" />
              <label className="font-bold text-black text-sm" htmlFor="fullName">Full Name</label>
            </div>
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
              autoComplete="name"
              {...register("fullName")}
            />
            {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FaEnvelope className="text-gray-400 w-4 h-4 mr-2" />
              <label className="font-bold text-black text-sm" htmlFor="email">Email</label>
            </div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FaPhone className="text-gray-400 w-4 h-4 mr-2" />
              <label className="font-bold text-black text-sm" htmlFor="phone">Phone Number</label>
            </div>
            <input
              id="phone"
              type="text"
              placeholder="Phone Number"
              className="w-full px-4 py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
              autoComplete="tel"
              {...register("phone")}
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FaHome className="text-gray-400 w-4 h-4 mr-2" />
              <label className="font-bold text-black text-sm" htmlFor="address">Home Address</label>
            </div>
            <input
              id="address"
              type="text"
              placeholder="Home Address"
              className="w-full px-4 py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
              autoComplete="street-address"
              {...register("address")}
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>}
          </div>
          {mutation.isError && (
            <div className="text-red-600 text-xs mb-2" role="alert">{(mutation.error as any)?.message || "Failed to sign in"}</div>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#8B2323] text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mb-2 cursor-pointer disabled:opacity-60"
          >
            {mutation.isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-1 mb-2 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#8B2323] font-semibold hover:underline cursor-pointer">Sign Up</Link>
        </div>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex justify-center gap-4 w-full mt-1 mb-2">
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full p-2.5 hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Apple"
          >
            <FaApple className="w-5 h-5" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full p-2.5 hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Google"
          >
            <FaGoogle className="w-5 h-5" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full p-2.5 hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign in with Facebook"
          >
            <FaFacebookF className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}