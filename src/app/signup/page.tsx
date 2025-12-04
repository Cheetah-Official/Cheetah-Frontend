"use client";
import Link from "next/link";
import {
  FaApple,
  FaGoogle,
  FaFacebookF,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaLock,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/endpoints/auth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupPage() {
  const router = useRouter();
  const SignupSchema = z
    .object({
      fullName: z.string().min(3, "Enter your full name"),
      email: z.string().email("Enter a valid email"),
      phone: z.string().optional(),
      address: z.string().optional(),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(6, "Confirm your password"),
    })
    .refine((vals) => vals.password === vals.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    })
    .refine(
      (vals) => {
        const parts = vals.fullName.trim().split(/\s+/);
        return parts.length >= 2;
      },
      { path: ["fullName"], message: "Please enter first and last name" },
    );

  type SignupForm = z.infer<typeof SignupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const [first_name, ...rest] = data.fullName.trim().split(/\s+/);
      const last_name = rest.join(" ");
      return authApi.register({
        email: data.email,
        password: data.password,
        first_name,
        last_name,
        phone: data.phone || undefined,
      });
    },
    onSuccess: () => {
      router.push("/signin");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384]">
      <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-sm flex flex-col items-center">
        <div className="mb-3 flex flex-col items-center">
          <img src="/Logo.png" alt="Cheetah Logo" className="h-8 mb-1" />
          <h2 className="text-xl font-bold mb-0.5 text-[#1A1A1A]">
            Sign Up Account
          </h2>
          <p className="text-gray-500 text-center text-xs max-w-xs mb-1">
            Get access to Free travel insurance, Free Wi-Fi, and your coverage
            history - all in one place.
          </p>
        </div>
        <form
          className="w-full"
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
        >
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaUser className="text-gray-400 w-3 h-3 mr-1" />
              <label
                className="font-bold text-black text-xs"
                htmlFor="fullName"
              >
                Full Name
              </label>
            </div>
            <input
              id="fullName"
              type="text"
              {...register("fullName")}
              placeholder="Full Name"
              className="w-full px-3 text-black py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="text-red-600 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaEnvelope className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="email">
                Email
              </label>
            </div>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Email"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaPhone className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="phone">
                Phone Number
              </label>
            </div>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              placeholder="Phone Number"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              autoComplete="tel"
            />
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaHome className="text-gray-400 w-3 h-3 mr-1" />
              <label className="font-bold text-black text-xs" htmlFor="address">
                Home Address
              </label>
            </div>
            <input
              id="address"
              type="text"
              {...register("address")}
              placeholder="Home Address"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              autoComplete="street-address"
            />
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaLock className="text-gray-400 w-3 h-3 mr-1" />
              <label
                className="font-bold text-black text-xs"
                htmlFor="password"
              >
                Create Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Create Password"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-1.5">
            <div className="flex items-center mb-0.5">
              <FaLock className="text-gray-400 w-3 h-3 mr-1" />
              <label
                className="font-bold text-black text-xs"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
            </div>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="w-full px-3 py-1.5 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] focus:outline-none text-sm"
              required
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {mutation.isError && (
            <div className="text-red-600 text-xs mb-2" role="alert">
              {(mutation.error as any)?.message || "Failed to create account"}
            </div>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[#8B2323] text-white py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 mb-1 cursor-pointer disabled:opacity-60"
          >
            {mutation.isPending ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="text-xs text-gray-600 mt-1 mb-1.5">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-[#8B2323] font-semibold hover:underline cursor-pointer"
          >
            Sign In
          </Link>
        </div>
        <div className="flex items-center w-full my-1.5">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or continue with</span>
        </div>
        <div className="flex justify-center gap-4 w-full mt-1">
          <button className="border border-[#8B2323] text-[#8B2323] rounded-full p-2 hover:bg-[#8B2323]/10 transition-colors cursor-pointer">
            <FaApple className="w-4 h-4" />
          </button>
          <button className="border border-[#8B2323] text-[#8B2323] rounded-full p-2 hover:bg-[#8B2323]/10 transition-colors cursor-pointer">
            <FaGoogle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
