"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * This page handles redirects from the backend Flutterwave callback
 * It extracts the payment parameters and redirects to the frontend payment confirmation page
 */
function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract payment parameters from the backend callback URL
    const status = searchParams.get("status");
    const txRef = searchParams.get("tx_ref");
    const transactionId = searchParams.get("transaction_id");

    // Build the frontend payment confirmation URL with the same parameters
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (txRef) params.append("tx_ref", txRef);
    if (transactionId) params.append("transaction_id", transactionId);

    // Redirect to the frontend payment confirmation page
    const confirmUrl = `/payment/confirm?${params.toString()}`;
    router.replace(confirmUrl);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl w-full text-center">
        <div className="text-xl font-semibold text-[#8B2323]">
          Processing payment confirmation...
        </div>
        <p className="text-gray-600 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl w-full text-center">
            <div className="text-xl font-semibold text-[#8B2323]">
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}

