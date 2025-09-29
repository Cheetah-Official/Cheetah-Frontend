"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/endpoints/auth";
import { clearAccessToken } from "@/lib/auth";

export default function ProfilePage() {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    retry: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-red-600 mb-2">{(error as any)?.message || "Not authenticated"}</p>
          <button
            onClick={() => router.replace("/signin")}
            className="px-4 py-2 bg-[#8B2323] text-white rounded"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2384]">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Name:</span> {user.first_name} {user.last_name}</p>
          {user.phone && <p><span className="font-semibold">Phone:</span> {user.phone}</p>}
          <p><span className="font-semibold">Role:</span> {user.role}</p>
          <p><span className="font-semibold">Active:</span> {user.is_active ? "Yes" : "No"}</p>
          <p><span className="font-semibold">Verified:</span> {user.is_verified ? "Yes" : "No"}</p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Dashboard
          </button>
          <button
            onClick={async () => { try { await authApi.logout(); } catch {} finally { clearAccessToken(); router.replace("/signin"); } }}
            className="px-4 py-2 bg-[#8B2323] text-white rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
