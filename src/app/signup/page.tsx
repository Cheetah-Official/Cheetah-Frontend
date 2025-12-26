"use client"
import { useState } from "react"
import Link from "next/link"
import { FaApple, FaGoogle, FaFacebookF, FaLock } from "react-icons/fa"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRegisterPersonMutation } from "@/feature/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/feature/authentication/authSlice";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

export default function SignupPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [registerPerson, { isLoading }] = useRegisterPersonMutation()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const SignupSchema = z.object({
    fullName: z.string().min(3, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  }).refine((vals) => vals.password === vals.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  }).refine((vals) => {
    const parts = vals.fullName.trim().split(/\s+/)
    return parts.length >= 2
  }, { path: ["fullName"], message: "Please enter first and last name" })

  type SignupForm = z.infer<typeof SignupSchema>

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { fullName: "", email: "", phone: "", address: "", password: "", confirmPassword: "" }
  })

  const onSubmit = async (data: SignupForm) => {
    setSubmitError(null);
    
    // Split full name into first and last name (outside try block for catch block access)
    const trimmedName = data.fullName.trim();
    const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0);
    
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 
      ? nameParts.slice(1).join(" ") 
      : nameParts[0] || "";
    
    try {
      // Prepare registration payload for /auth/person/register
      const payload = {
        email: data.email,
        password: data.password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: data.phone || undefined,
      };

      console.log("Registration payload:", payload);
      
      // Call the registerPerson mutation
      const response = await registerPerson(payload).unwrap();
      
      console.log("Registration response:", response);
      
      // Response structure: { accessToken, refreshToken, tokenType, expiresIn, email, userType, userId, message, emailVerificationRequired }
      const userData = {
        email: response.email || data.email,
        fullName: data.fullName,
        phone: data.phone || undefined,
      };

      // Store tokens and user data
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
          first_name: firstName,
          last_name: lastName,
        },
      }));

      localStorage.setItem('user', JSON.stringify(userData));
      reset();
      
      // Redirect to signin page after successful registration
      router.push('/signin');
    } catch (err: any) {
      console.error("Registration error:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));
      
      // Extract error message from different possible error formats
      const errorMessage = 
        err?.data?.message || 
        err?.data?.error || 
        err?.message || 
        err?.error || 
        "Failed to create account. Please try again.";
      
      setSubmitError(errorMessage);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384] p-1.5 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-2 sm:p-4 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center">
        <div className="mb-1 sm:mb-3 flex flex-col items-center">
          <img src="/New-Logo.png" alt="Cheetah Logo" className="h-5 sm:h-8 mb-0.5 sm:mb-1" />
          <h2 className="text-sm sm:text-xl font-bold mb-0 sm:mb-0.5 text-[#1A1A1A]">Sign Up Account</h2>
          <p className="text-gray-600 text-center text-[11px] sm:text-xs max-w-xs sm:max-w-sm mb-0 leading-tight">
            Get access to Free travel insurance, Free Wi-Fi, and your coverage history - all in one place.
          </p>
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1.5 sm:mb-2.5">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <Image src="/Name.png" alt="Name" width={14} height={14} className="mr-1.5 sm:mr-2" />
              <label className="font-bold text-black text-[11px] sm:text-sm" htmlFor="fullName">Full Name</label>
            </div>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              placeholder="First and Last Name"
              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-xs sm:text-sm"
              required
              autoComplete="name"
            />
            {errors.fullName && <p className="text-red-600 text-[10px] sm:text-xs mt-0">{errors.fullName.message}</p>}
          </div>
          <div className="mb-1.5 sm:mb-2.5">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <Image src="/Mail.png" alt="Email" width={14} height={14} className="mr-1.5 sm:mr-2" />
              <label className="font-bold text-black text-[11px] sm:text-sm" htmlFor="email">Email</label>
            </div>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Email"
              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-xs sm:text-sm"
              required
              autoComplete="email"
            />
            {errors.email && <p className="text-red-600 text-[10px] sm:text-xs mt-0">{errors.email.message}</p>}
          </div>
          <div className="mb-1.5 sm:mb-2.5">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <Image src="/Phone.png" alt="Phone" width={14} height={14} className="mr-1.5 sm:mr-2" />
              <label className="font-bold text-black text-[11px] sm:text-sm" htmlFor="phone">Phone Number</label>
            </div>
            <input
              id="phone"
              type="text"
              {...register('phone')}
              placeholder="Phone Number"
              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-xs sm:text-sm"
              autoComplete="tel"
            />
          </div>
          <div className="mb-1.5 sm:mb-2.5">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <Image src="/Address.png" alt="Address" width={14} height={14} className="mr-1.5 sm:mr-2" />
              <label className="font-bold text-black text-[11px] sm:text-sm" htmlFor="address">Home Address</label>
            </div>
            <input
              id="address"
              type="text"
              {...register('address')}
              placeholder="Home Address"
              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-xs sm:text-sm"
              autoComplete="street-address"
            />
          </div>
          <div className="mb-1.5 sm:mb-2.5">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <FaLock className="text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <label className="font-bold text-black text-[11px] sm:text-sm" htmlFor="password">Create Password</label>
            </div>
            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Create Password"
              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-xs sm:text-sm"
              required
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-600 text-[10px] sm:text-xs mt-0">{errors.password.message}</p>}
          </div>
          <div className="mb-1.5 sm:mb-2.5">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <FaLock className="text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <label className="font-bold text-black text-[11px] sm:text-sm" htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm Password"
              className="w-full px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-xs sm:text-sm"
              required
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="text-red-600 text-[10px] sm:text-xs mt-0">{errors.confirmPassword.message}</p>}
          </div>
          {submitError && (
            <div className="text-red-600 text-[10px] sm:text-xs mb-1" role="alert">
              {submitError}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B2323] text-white py-1.5 sm:py-2.5 rounded-md sm:rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mb-1 sm:mb-1.5 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="text-[10px] sm:text-xs text-gray-600 mt-0 mb-1 sm:mb-1.5 text-center">
          Already have an account?{' '}
          <Link href="/signin" className="text-[#8B2323] font-semibold hover:underline cursor-pointer">Sign In</Link>
        </div>
        <div className="flex items-center w-full my-1 sm:my-1.5">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-1.5 sm:mx-2 text-gray-400 text-[10px] sm:text-xs">or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex justify-center gap-1 sm:gap-2 w-full mt-0 mb-0 sm:mb-1">
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign up with Apple"
          >
            <FaApple className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign up with Google"
          >
            <FaGoogle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
          <button 
            className="bg-white border border-[#8B2323] text-[#8B2323] rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-[#8B2323]/5 transition-colors cursor-pointer"
            aria-label="Sign up with Facebook"
          >
            <FaFacebookF className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
