"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaApple, FaGoogle, FaFacebookF, FaLock } from "react-icons/fa";
import Image from "next/image";
import { useLoginMutation } from "@/feature/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/feature/authentication/authSlice";

const SignInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof SignInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>({ resolver: zodResolver(SignInSchema) });

  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = async (data: SignInForm) => {
    try {
      console.log("Attempting login with:", { email: data.email });
      const response = await login(data).unwrap();
      console.log("Login response:", response);
      console.log("Login response type:", typeof response);
      
      // Response from RTK Query should already be an object
      // transformResponse returns: response?.data || response
      // So if API returns {success: true, data: {...}}, we get {success: true, data: {...}}
      // Extract from response.data.accessToken
      
      console.log("Sign in - response type:", typeof response);
      
      // Handle both object and string responses
      let responseData: any = null;
      
      if (typeof response === 'object' && response !== null) {
        // Normal case: response is an object
        responseData = response?.data;
      } else if (typeof response === 'string') {
        // Fallback: response is a string, try to extract token with regex
        const tokenMatch = response.match(/"accessToken"\s*:\s*"([^"]+)"/);
        const refreshTokenMatch = response.match(/"refreshToken"\s*:\s*"([^"]+)"/);
        const emailMatch = response.match(/"email"\s*:\s*"([^"]+)"/);
        const userIdMatch = response.match(/"userId"\s*:\s*(\d+)/);
        
        if (tokenMatch && tokenMatch[1]) {
          console.log("Sign in - Extracted token from string using regex");
          responseData = { 
            accessToken: tokenMatch[1],
            refreshToken: refreshTokenMatch?.[1] || null,
            email: emailMatch?.[1] || null,
            userId: userIdMatch ? parseInt(userIdMatch[1]) : null,
          };
        } else {
          // Last resort: try to parse as JSON
          try {
            const parsed = JSON.parse(response);
            responseData = parsed?.data || parsed;
          } catch (e) {
            console.warn("Sign in - Could not parse response string or extract token");
          }
        }
      }
      
      console.log("Sign in - responseData:", responseData);
      console.log("Sign in - responseData keys:", responseData ? Object.keys(responseData) : "null/undefined");
      
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let user: any = null;
      
      if (responseData && typeof responseData === 'object') {
        accessToken = responseData.accessToken || responseData.access_token || null;
        refreshToken = responseData.refreshToken || responseData.refresh_token || null;
        user = {
          email: responseData.email || responseData.user_email || data.email,
          userId: responseData.userId || responseData.user_id,
          userRole: responseData.userType || responseData.user_role,
        };
      } else {
        // Fallback: maybe the data is at the top level
        console.log("Sign in - Falling back to top-level extraction");
        accessToken = response?.accessToken || response?.access_token || null;
        refreshToken = response?.refreshToken || response?.refresh_token || null;
        user = {
          email: response?.email || response?.user_email || data.email,
          userId: response?.userId || response?.user_id,
          userRole: response?.userType || response?.user_role,
        };
      }
      
      console.log("Sign in - Final accessToken:", accessToken ? `✓ Found (length: ${accessToken.length})` : "✗ NOT FOUND");
      
      // Only redirect if we have a valid access token (required for API calls)
      if (accessToken && accessToken.trim() !== '') {
        const trimmedToken = accessToken.trim();
        
        // CRITICAL: Store token in localStorage FIRST, synchronously
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', trimmedToken);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken.trim());
          }
          // Verify immediately
          const storedToken = localStorage.getItem('accessToken');
          console.log("Sign in - Token stored and verified:", storedToken ? `✓ (length: ${storedToken.length})` : "✗ FAILED");
          
          if (!storedToken) {
            throw new Error("Failed to store access token in localStorage");
          }
        }
        
        // Then store in Redux
        dispatch(setCredentials({
          accessToken: trimmedToken,
          refreshToken: refreshToken ? refreshToken.trim() : null,
          user: user || { email: data.email },
        }));
        
        console.log("Sign in - Credentials stored in Redux and localStorage");
        
        // Small delay to ensure Redux state propagates
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Final verification before redirect
        const finalCheck = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        console.log("Sign in - Final token check before redirect:", finalCheck ? `✓ (length: ${finalCheck.length})` : "✗ MISSING");
        
        if (!finalCheck) {
          throw new Error("Token was lost before redirect");
        }
        
        // Only redirect after successful authentication with token
        router.push("/dashboard");
      } else {
        // No valid token received
        console.error("Sign in - No valid token received. Response:", response);
        throw new Error("Authentication failed - no access token received");
      }
    } catch (err: any) {
      // Error is handled by RTK Query and displayed below
      console.error("Login failed:", err);
      // Log more details about the error
      if (err?.data) {
        console.error("Error data:", err.data);
      }
      if (err?.status) {
        console.error("Error status:", err.status);
      }
    }
  };

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
          {error && (
            <div className="text-red-600 text-[10px] sm:text-xs mb-1" role="alert">
              {(error as any)?.data?.message || (error as any)?.message || "Failed to sign in. Please check your credentials."}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B2323] text-white py-1.5 sm:py-2.5 rounded-md sm:rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mb-1 sm:mb-1.5 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
          >
            {isLoading ? "Signing In..." : "Sign In"}
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
