"use client";

import { useState } from "react";
import { useMembership } from "@/app/components/providers/MembershipContext";

export default function MockStripeCheckout() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const { paymentStatus, setPaymentStatus } = useMembership();

  const handlePay = () => {
    setPaymentStatus("processing");
    setTimeout(() => setPaymentStatus("succeeded"), 1500);
  };

  const isProcessing = paymentStatus === "processing";

  return (
    <div className="space-y-3">
      {/* Express checkout buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isProcessing}
          className="flex-1 bg-black text-white rounded-md py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          onClick={handlePay}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Pay
        </button>
        <button
          type="button"
          disabled={isProcessing}
          className="flex-1 bg-white border border-gray-300 rounded-md py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
          onClick={handlePay}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="#4285F4"
            />
          </svg>
          Pay
        </button>
      </div>

      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          Or pay with card
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Card form */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Card number
          </label>
          <input
            type="text"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            disabled={isProcessing}
            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Expiry
            </label>
            <input
              type="text"
              placeholder="MM / YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              disabled={isProcessing}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              CVC
            </label>
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              disabled={isProcessing}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isProcessing}
        className="w-full bg-indigo-600 text-white rounded-md py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handlePay}
      >
        {isProcessing ? "Processing..." : "Subscribe — $9.99/mo"}
      </button>
    </div>
  );
}
