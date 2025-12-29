"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaApple, FaGoogle, FaFacebookF, FaLock, FaFileAlt } from "react-icons/fa";
import { useLoginMutation } from "@/feature/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/feature/authentication/authSlice";

const TransportSignInSchema = z.object({
  companyName: z.string().email("Enter a valid company email"),
  password: z.string().min(1, "Password is required"),
});

type TransportSignInForm = z.infer<typeof TransportSignInSchema>;

export default function TransportSignInPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<TransportSignInForm>({ 
    resolver: zodResolver(TransportSignInSchema) 
  });

  const [login, { isLoading, error }] = useLoginMutation();

  const onSubmit = async (data: TransportSignInForm) => {
    try {
      console.log("Attempting transport login with:", { email: data.companyName });
      const response = await login({ email: data.companyName.trim(), password: data.password }).unwrap();
      console.log("Transport login response:", response);

      // Response from RTK Query should already be an object
      // transformResponse returns: response?.data || response
      // So if API returns {success: true, data: {...}}, we get {success: true, data: {...}}
      // Extract from response.data.accessToken
      
      console.log("Transport sign in - response type:", typeof response);
      
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
          console.log("Transport sign in - Extracted token from string using regex");
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
            console.warn("Transport sign in - Could not parse response string or extract token");
          }
        }
      }
      
      console.log("Transport sign in - responseData:", responseData);
      console.log("Transport sign in - responseData keys:", responseData ? Object.keys(responseData) : "null/undefined");
      
      let accessToken: string | null = null;
      let refreshToken: string | null = null;
      let user: any = null;
      
      if (responseData && typeof responseData === 'object') {
        accessToken = responseData.accessToken || responseData.access_token || null;
        refreshToken = responseData.refreshToken || responseData.refresh_token || null;
        user = {
          companyName: responseData.companyName || data.companyName,
          email: responseData.email,
          userId: responseData.userId || responseData.user_id,
          userRole: responseData.userType || responseData.user_role || "TRANSPORT_COMPANY",
        };
      } else {
        // Fallback: maybe the data is at the top level
        console.log("Transport sign in - Falling back to top-level extraction");
        accessToken = response?.accessToken || response?.access_token || null;
        refreshToken = response?.refreshToken || response?.refresh_token || null;
        user = {
          companyName: response?.companyName || data.companyName,
          email: response?.email,
          userId: response?.userId || response?.user_id,
          userRole: response?.userType || response?.user_role || "TRANSPORT_COMPANY",
        };
      }

      console.log("Transport sign in - Final accessToken:", accessToken ? `✓ Found (length: ${accessToken.length})` : "✗ NOT FOUND");

      if (accessToken && accessToken.trim() !== '') {
        const trimmedToken = accessToken.trim();

        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', trimmedToken);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken.trim());
          }
          const storedToken = localStorage.getItem('accessToken');
          console.log("Transport sign in - Token stored and verified in localStorage:", storedToken ? `✓ (length: ${storedToken.length})` : "✗ FAILED");

          if (!storedToken) {
            throw new Error("Failed to store access token in localStorage");
          }
        }

        dispatch(setCredentials({
          accessToken: trimmedToken,
          refreshToken: refreshToken ? refreshToken.trim() : null,
          user: user || { companyName: data.companyName, userRole: "TRANSPORT" },
        }));

        console.log("Transport sign in - Credentials stored in Redux and localStorage");

        await new Promise(resolve => setTimeout(resolve, 200));

        const finalCheck = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        console.log("Transport sign in - Final token check before redirect:", finalCheck ? `✓ (length: ${finalCheck.length})` : "✗ MISSING");

        if (!finalCheck) {
          throw new Error("Token was lost before redirect");
        }

        router.push("/transport");
      } else {
        console.error("Transport sign in - No valid token received. Response:", response);
        throw new Error("Authentication failed - no access token received");
      }
    } catch (err: any) {
      console.error("Transport login failed:", err);
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
              <label className="font-semibold text-black text-xs sm:text-sm" htmlFor="companyName">Company Email</label>
            </div>
            <input
              id="companyName"
              type="email"
              placeholder="Company Email"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#8B2323] focus:border-[#8B2323] focus:outline-none text-sm sm:text-base"
              autoComplete="username"
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
          {error && (
            <div className="text-red-600 text-xs sm:text-sm mb-2" role="alert">
              {(error as any)?.data?.message || (error as any)?.message || "Failed to sign in"}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8B2323] text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 hover:opacity-90 mb-3 sm:mb-4 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? "Signing In..." : "Sign In"}
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

