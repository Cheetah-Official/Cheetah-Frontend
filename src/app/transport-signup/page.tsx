"use client";

import { useState } from "react";
import Link from "next/link";
import { FaApple, FaGoogle, FaFacebookF, FaLock, FaFileAlt, FaHome } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const TransportSignupSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  regNo: z.string().min(1, "Registration number is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type TransportSignupForm = z.infer<typeof TransportSignupSchema>;

export default function TransportSignupPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TransportSignupForm>({
    resolver: zodResolver(TransportSignupSchema),
    defaultValues: { companyName: "", regNo: "", companyAddress: "", password: "" }
  });

  const onSubmit = async (data: TransportSignupForm) => {
    setSubmitError(null);
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call for transporter registration
      // Store transporter data in localStorage for now
      const transporterData = {
        companyName: data.companyName,
        regNo: data.regNo,
        companyAddress: data.companyAddress,
        userType: "transporter",
      };
      
      localStorage.setItem('transporter', JSON.stringify(transporterData));
      reset();
      router.push('/transport');
    } catch (err: any) {
      console.error("Registration error:", err);
      setSubmitError(err?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 text-[#1A1A1A]">Create an Account</h2>
          <p className="text-gray-600 text-center text-xs sm:text-sm max-w-xs sm:max-w-md mb-0 leading-relaxed">
            Track your business, and manage your trips from a single, secure account.
          </p>
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center mb-1.5 sm:mb-2">
              <FaFileAlt className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="companyName">Company Name</label>
            </div>
            <input
              id="companyName"
              type="text"
              {...register('companyName')}
              placeholder="Company Name"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm sm:text-base"
              required
              autoComplete="organization"
            />
            {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName.message}</p>}
          </div>
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center mb-1.5 sm:mb-2">
              <Image src="/Reg.png" alt="Registration" width={16} height={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="regNo">Reg. No (TAC)</label>
            </div>
            <input
              id="regNo"
              type="text"
              {...register('regNo')}
              placeholder="Registration Number"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm sm:text-base"
              required
            />
            {errors.regNo && <p className="text-red-600 text-xs mt-1">{errors.regNo.message}</p>}
          </div>
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center mb-1.5 sm:mb-2">
              <FaHome className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="companyAddress">Company Address</label>
            </div>
            <input
              id="companyAddress"
              type="text"
              {...register('companyAddress')}
              placeholder="Company Address"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm sm:text-base"
              required
              autoComplete="street-address"
            />
            {errors.companyAddress && <p className="text-red-600 text-xs mt-1">{errors.companyAddress.message}</p>}
          </div>
          <div className="mb-4 sm:mb-5">
            <div className="flex items-center mb-1.5 sm:mb-2">
              <FaLock className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Password"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm sm:text-base"
              required
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {submitError && (
            <div className="text-red-600 text-xs sm:text-sm mb-2" role="alert">
              {submitError}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B2323] text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 hover:opacity-90 mb-3 sm:mb-4 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 text-center">
          Already have an account?{' '}
          <Link href="/transport-signin" className="text-[#8B2323] font-semibold hover:underline cursor-pointer">Sign In</Link>
        </div>
        <div className="flex items-center w-full my-2 sm:my-3">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 sm:mx-3 text-gray-400 text-xs sm:text-sm">or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex justify-center gap-2 sm:gap-3 w-full">
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign up with Apple"
          >
            <FaApple className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign up with Mail"
          >
            <FaGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign up with Facebook"
          >
            <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

