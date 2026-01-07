"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useGetPaymentByTransactionRefQuery } from "@/feature/payments/paymentApiSlice";

function PaymentConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = (searchParams.get("status") || "").toLowerCase();
  const txRef = searchParams.get("tx_ref") || searchParams.get("txRef") || "";
  const transactionId = searchParams.get("transaction_id") || "";

  const isSuccess =
    statusParam === "success" ||
    statusParam === "successful" ||
    statusParam === "completed";

  const {
    data: paymentData,
    isLoading: loadingPayment,
  } = useGetPaymentByTransactionRefQuery(txRef, {
    skip: !txRef,
  });

  const amountDisplay = useMemo(() => {
    if (!paymentData) return null;
    const amount =
      paymentData.amount ||
      paymentData.totalAmount ||
      paymentData.grand_total ||
      paymentData.price;
    if (!amount) return null;
    return `₦${Number(amount).toLocaleString()}`;
  }, [paymentData]);

  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl w-full text-center">
        <div className="mx-auto mb-4 w-16 h-16 relative">
          <Image
            src="/Cheetah 2.svg"
            alt="Cheetah"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#8B2323] mb-2">
          {isSuccess ? "Payment Successful" : "Payment Status"}
        </h1>
        <p className="text-gray-600 mb-4">
          {isSuccess
            ? "Your payment has been completed successfully."
            : statusParam
            ? `Your payment status is: ${statusParam.toUpperCase()}.`
            : "We have received your payment callback."}
        </p>

        {txRef && (
          <div className="bg-gray-50 border rounded-lg p-4 text-left mb-4">
            <div className="text-sm text-gray-500">Transaction Reference</div>
            <div className="text-lg font-semibold break-all">{txRef}</div>
          </div>
        )}

        {transactionId && (
          <div className="bg-gray-50 border rounded-lg p-4 text-left mb-4">
            <div className="text-sm text-gray-500">Transaction ID</div>
            <div className="text-lg font-semibold break-all">
              {transactionId}
            </div>
          </div>
        )}

        <div className="bg-gray-50 border rounded-lg p-4 text-left mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Payment Summary</div>
            {loadingPayment && (
              <div className="text-xs text-gray-500">Loading…</div>
            )}
          </div>
          {amountDisplay && (
            <div className="mt-2 text-sm text-gray-700">
              <div className="flex justify-between font-semibold">
                <span>Amount</span>
                <span>{amountDisplay}</span>
              </div>
            </div>
          )}
          {!loadingPayment && !amountDisplay && (
            <div className="mt-2 text-xs text-gray-500">
              We could not retrieve payment details, but your transaction
              reference has been recorded.
            </div>
          )}
        </div>

        <div className="text-sm text-gray-700 mb-6">
          <p>
            You can view this transaction and ticket details from your
            dashboard.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            className="bg-[#8B2323] text-white px-5 py-2.5 rounded-lg font-semibold cursor-pointer"
            onClick={() => router.push("/dashboard?tab=activity")}
          >
            Go to Dashboard
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-semibold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-xl w-full text-center">
            <div className="text-xl font-semibold text-[#8B2323]">
              Confirming payment...
            </div>
          </div>
        </div>
      }
    >
      <PaymentConfirmContent />
    </Suspense>
  );
}




