"use client";

import { useState } from "react";
import Link from "next/link";
import { FaApple, FaGoogle, FaFacebookF, FaLock, FaFileAlt, FaHome, FaEnvelope, FaPhone } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterTransportMutation } from "@/feature/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/feature/authentication/authSlice";

const TransportSignupSchema = z.object({
  email: z.string().email("Enter a valid email"),
  companyName: z.string().min(1, "Company name is required"),
  companyCode: z.string().min(1, "Registration number is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Company address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type TransportSignupForm = z.infer<typeof TransportSignupSchema>;

export default function TransportSignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [registerTransport, { isLoading }] = useRegisterTransportMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const { register, handleSubmit, formState: { errors }, reset, trigger, getValues } = useForm<TransportSignupForm>({
    resolver: zodResolver(TransportSignupSchema),
    defaultValues: { email: "", companyName: "", companyCode: "", phoneNumber: "", address: "", password: "", confirmPassword: "" }
  });

  const onSubmit = async (data: TransportSignupForm) => {
    setSubmitError(null);

    const payload = {
      email: data.email,
      password: data.password,
      companyName: data.companyName,
      companyCode: data.companyCode,
      phoneNumber: data.phoneNumber,
      address: data.address,
    };

    console.log("Transport registration payload:", payload);

    const result = await registerTransport(payload);

    if ('error' in result) {
      const err = result.error as any;
      let errorMessage = "Failed to create account. Please try again.";

      try {
        console.error("Transport registration error:", err);
        if (err && typeof err === 'object') {
          console.error("Error status:", err.status);
          console.error("Error data:", err.data);
        }
      } catch (logErr) {
        // Ignore logging errors
      }

      const statusCode = err?.status || err?.data?.status || err?.data?.data?.statusCode;

      if (err?.data?.data?.message) {
        errorMessage = err.data.data.message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error) {
        errorMessage = err.error;
      }

      if (statusCode === 409 || errorMessage.toLowerCase().includes("already registered") || errorMessage.toLowerCase().includes("already exist")) {
        errorMessage = "This company has already been registered. Please sign in instead.";
      }
      setSubmitError(errorMessage);
      return;
    }

    const response = result.data;

    console.log("Transport registration response:", response);

    const userData = {
      email: response.email || data.email,
      companyName: response.companyName || data.companyName,
      companyCode: data.companyCode,
      phoneNumber: data.phoneNumber,
      address: data.address,
      userRole: "TRANSPORT",
    };

    const accessToken = response.accessToken || "";
    const refreshToken = response.refreshToken || "";

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    dispatch(setCredentials({
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        ...userData,
        id: response.userId?.toString() || "",
      },
    }));

    localStorage.setItem('user', JSON.stringify(userData));
    reset();
    router.push('/transport-signin');
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof TransportSignupForm)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['email', 'companyName', 'companyCode'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['phoneNumber', 'address'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setSubmitError(null);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384] p-1.5 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-3 sm:p-4 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center">
        <div className="mb-3 sm:mb-4 flex flex-col items-center w-full">
          <button 
            onClick={() => router.push("/")}
            className="cursor-pointer hover:opacity-80 transition-opacity mb-1.5 sm:mb-2"
            aria-label="Go to home page"
          >
            <img src="/Cheetah 2.svg" alt="Cheetah Logo" className="h-7 sm:h-10" />
          </button>
          <h2 className="text-base sm:text-xl font-bold mb-1 text-[#1A1A1A]">Create an Account</h2>
          <p className="text-gray-600 text-center text-xs max-w-xs sm:max-w-md mb-3 leading-relaxed">
            Track your business, and manage your trips from a single, secure account.
          </p>
          
          {/* Step Indicator */}
          <div className="w-full mb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center" style={{ width: 'fit-content' }}>
                {[1, 2, 3].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        currentStep >= step 
                          ? 'bg-[#8B2323] border-[#8B2323] text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        <span className={`text-xs font-semibold ${
                          currentStep >= step ? 'text-white' : 'text-gray-400'
                        }`}>{step}</span>
                      </div>
                    </div>
                    {index < 2 && (
                      <div className={`w-16 h-0.5 mx-2 ${
                        currentStep > step ? 'bg-[#8B2323]' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center text-xs text-gray-600">
              <div className="flex items-center" style={{ width: 'fit-content', gap: '2.5rem' }}>
                <div className="text-center" style={{ width: '4rem' }}>
                  <span className={currentStep === 1 ? 'text-[#8B2323] font-semibold' : ''}> Info</span>
                </div>
                <div className="text-center" style={{ width: '4rem' }}>
                  <span className={currentStep === 2 ? 'text-[#8B2323] font-semibold' : ''}>Contact</span>
                </div>
                <div className="text-center" style={{ width: '4rem' }}>
                  <span className={currentStep === 3 ? 'text-[#8B2323] font-semibold' : ''}>Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center mb-1 sm:mb-1.5">
                  <FaEnvelope className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="email">Email</label>
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Email"
                  className="w-full px-3 sm:px-4 py-2 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
                  autoComplete="email"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <div className="flex items-center mb-1 sm:mb-1.5">
                  <FaFileAlt className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="companyName">Company Name</label>
                </div>
                <input
                  id="companyName"
                  type="text"
                  {...register('companyName')}
                  placeholder="Company Name"
                  className="w-full px-3 sm:px-4 py-2 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
                  autoComplete="organization"
                />
                {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName.message}</p>}
              </div>
              <div>
                <div className="flex items-center mb-1 sm:mb-1.5">
                  <Image src="/Reg.png" alt="Registration" width={16} height={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="companyCode">Reg. No (TAC)</label>
                </div>
                <input
                  id="companyCode"
                  type="text"
                  {...register('companyCode')}
                  placeholder="Registration Number"
                  className="w-full px-3 sm:px-4 py-2 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
                />
                {errors.companyCode && <p className="text-red-600 text-xs mt-1">{errors.companyCode.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center mb-1 sm:mb-1.5">
                  <FaPhone className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="phoneNumber">Phone Number</label>
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="Phone Number"
                  className="w-full px-3 sm:px-4 py-2 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
                  autoComplete="tel"
                />
                {errors.phoneNumber && <p className="text-red-600 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>
              <div>
                <div className="flex items-center mb-1 sm:mb-1.5">
                  <FaHome className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="address">Company Address</label>
                </div>
                <input
                  id="address"
                  type="text"
                  {...register('address')}
                  placeholder="Company Address"
                  className="w-full px-3 sm:px-4 py-2 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
                  autoComplete="street-address"
                />
                {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Security */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center mb-1 sm:mb-1.5">
                  <FaLock className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="password">Password</label>
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="Password"
                  className="w-full px-3 sm:px-4 py-2 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
                  autoComplete="new-password"
                />
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <div className="flex items-center mb-1 sm:mb-1.5">
                  <FaLock className="text-gray-600 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                  <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="confirmPassword">Confirm Password</label>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Confirm Password"
                  className="w-full px-3 sm:px-4 py-2 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          )}

          {submitError && (
            <div className="text-red-600 text-xs sm:text-sm mb-2 mt-3" role="alert">
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-2 mt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-gray-300 cursor-pointer"
              >
                Previous
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-[#8B2323] text-white py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#8B2323] text-white py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            )}
          </div>
        </form>
        <div className="text-xs text-gray-600 mb-2.5 sm:mb-3 text-center">
          Already have an account?{' '}
          <Link href="/transport-signin" className="text-[#8B2323] font-semibold hover:underline cursor-pointer">Sign In</Link>
        </div>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or continue with</span>
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


