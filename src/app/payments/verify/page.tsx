"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentsApi } from "@/lib/api/endpoints/payments";

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentRef =
    searchParams.get("payment_reference") ||
    searchParams.get("reference") ||
    searchParams.get("ref");
  const provider = searchParams.get("provider") || "paystack";

  const [status, setStatus] = useState<string>("verifying");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      if (!paymentRef) {
        setStatus("error");
        setMessage("Missing payment reference");
        return;
      }
      try {
        setStatus("verifying");
        const res = await paymentsApi.verifyPayment(paymentRef, provider);
        if (
          (res?.status || "").toLowerCase() === "success" ||
          (res?.message || "").toLowerCase().includes("success")
        ) {
          setStatus("success");
          setMessage("Payment verified successfully");
        } else {
          setStatus("failed");
          setMessage(res?.message || "Payment verification failed");
        }
      } catch (e: any) {
        setStatus("error");
        setMessage(e?.message || "Verification error");
      }
      // Redirect back to activity after a short delay
      setTimeout(() => router.replace("/dashboard?tab=activity"), 1500);
    };
    run();
  }, [paymentRef, provider, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F6F6] p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="text-2xl font-bold text-[#8B2323] mb-2">
          Payment Verification
        </div>
        <div className="text-gray-600 mb-6">
          We are confirming your payment. Please wait…
        </div>
        <div
          className={`text-sm font-semibold ${status === "success" ? "text-green-600" : status === "verifying" ? "text-gray-600" : "text-red-600"}`}
        >
          {message || status}
        </div>
        <div className="mt-6 text-xs text-gray-500">
          You will be redirected to your dashboard shortly.
        </div>
      </div>
    </div>
  );
}
