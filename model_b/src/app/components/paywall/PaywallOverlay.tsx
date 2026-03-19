"use client";

import { SUBSCRIPTION_PRICE } from "@/app/lib/constants";
import { hasStripeKey } from "@/app/lib/stripe";
import { useMembership } from "@/app/components/providers/MembershipContext";
import MockStripeCheckout from "./MockStripeCheckout";
import StripeCheckout from "./StripeCheckout";
import StripeProvider from "../providers/StripeProvider";
import ThirdWebAuth from "../auth/ThirdWebAuth";

export default function PaywallOverlay() {
  const { isAuthenticated, walletAddress } = useMembership();
  const useRealStripe = hasStripeKey();

  return (
    <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
      {/* Gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent" />

      {/* Overlay card */}
      <div className="relative pointer-events-auto w-full max-w-md mx-auto mb-8 md:mb-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 p-6 md:p-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <StepDot active={!isAuthenticated} completed={isAuthenticated} label="1" />
          <div className="w-8 h-px bg-gray-300" />
          <StepDot active={isAuthenticated} completed={false} label="2" />
        </div>

        {!isAuthenticated ? (
          /* ---- STEP 1: Sign in ---- */
          <>
            <h2 className="font-[family-name:var(--font-title)] text-xl md:text-2xl font-bold text-gray-900 text-center mb-2">
              Sign in to continue reading
            </h2>
            <p className="font-[family-name:var(--font-body)] text-gray-500 text-center text-sm mb-6">
              Connect your wallet to unlock premium articles for{" "}
              <span className="font-semibold text-gray-900">
                {SUBSCRIPTION_PRICE}
              </span>
            </p>
            <ThirdWebAuth />
          </>
        ) : (
          /* ---- STEP 2: Payment ---- */
          <>
            {/* Authenticated badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="font-mono text-xs">{walletAddress}</span>
            </div>

            <h2 className="font-[family-name:var(--font-title)] text-xl md:text-2xl font-bold text-gray-900 text-center mb-2">
              Complete payment
            </h2>
            <p className="font-[family-name:var(--font-body)] text-gray-500 text-center text-sm mb-6">
              Unlimited access to premium articles for{" "}
              <span className="font-semibold text-gray-900">
                {SUBSCRIPTION_PRICE}
              </span>
            </p>

            {useRealStripe ? (
              <StripeProvider>
                <StripeCheckout />
              </StripeProvider>
            ) : (
              <MockStripeCheckout />
            )}
          </>
        )}

        <p className="text-[10px] text-gray-400 text-center mt-4">
          Cancel anytime. Secure payment powered by Stripe.
        </p>
      </div>
    </div>
  );
}

function StepDot({
  active,
  completed,
  label,
}: {
  active: boolean;
  completed: boolean;
  label: string;
}) {
  const base = "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors";
  if (completed) {
    return (
      <div className={`${base} bg-green-100 text-green-700`}>
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    );
  }
  if (active) {
    return <div className={`${base} bg-indigo-600 text-white`}>{label}</div>;
  }
  return <div className={`${base} bg-gray-200 text-gray-400`}>{label}</div>;
}
