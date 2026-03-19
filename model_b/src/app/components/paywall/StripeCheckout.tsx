"use client";

import {
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useMembership } from "@/app/components/providers/MembershipContext";

export default function StripeCheckout() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { setPaymentStatus } = useMembership();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setPaymentStatus("processing");

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/demo?success=true`,
      },
    });

    if (error) {
      setMessage(error.message || "Payment failed");
      setPaymentStatus("failed");
    } else {
      setPaymentStatus("succeeded");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <ExpressCheckoutElement
        onConfirm={async () => {
          if (!stripe || !elements) return;
          setPaymentStatus("processing");
          const { error } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: {
              return_url: `${window.location.origin}/demo?success=true`,
            },
          });
          if (error) {
            setPaymentStatus("failed");
          } else {
            setPaymentStatus("succeeded");
          }
        }}
      />
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          Or pay with card
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white rounded-md py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Subscribe — $9.99/mo"}
      </button>
      {message && (
        <p className="text-sm text-red-500 text-center">{message}</p>
      )}
    </form>
  );
}
