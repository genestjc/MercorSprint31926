"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { SignInButton } from "./SignInButton";
import { StripeCheckoutModal } from "./StripeCheckoutModal";
import { useMembership } from "@/lib/useMembership";

interface PaywallProps {
  premium: boolean;
  children: React.ReactNode;
  /** Demo override — forces a step regardless of real wallet state. */
  forceStep?: "signin" | "pay" | "unlocked";
}

/**
 * Sequential paywall:
 *   1. Sign in (ThirdWeb wallet — social or self-custodial)
 *   2. Subscribe via Stripe ($5/mo → webhook mints/extends NFT)
 *   3. Unlocked (MembershipPass.isActive(wallet) == true)
 *
 * The NFT is the membership ledger. No users table.
 */
const DEMO_WALLET = "0xDEMO000000000000000000000000000000001234";

export function Paywall({ premium, children, forceStep }: PaywallProps) {
  const realAccount = useActiveAccount();
  const account =
    forceStep === "pay" || forceStep === "unlocked"
      ? { address: DEMO_WALLET }
      : forceStep === "signin"
      ? undefined
      : realAccount;

  const { hasMembership, loading, refresh } = useMembership(
    forceStep ? undefined : account?.address
  );
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [devBypass, setDevBypass] = useState(false);

  const effectiveMember = forceStep === "unlocked" ? true : hasMembership;
  const locked = premium && !effectiveMember && !devBypass;

  return (
    <>
      <div className="relative">
        <div className={locked ? "paywall-locked paywall-fade" : ""}>
          {children}
        </div>

        {locked && (
          <div className="relative -mt-40 z-10 flex justify-center px-4">
            <div className="max-w-xl w-full bg-white border border-neutral-200 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] p-6 sm:p-8">
              {!account ? (
                <SignInStep />
              ) : loading ? (
                <CheckingStep />
              ) : (
                <PayStep
                  address={account.address}
                  onCheckout={() => setCheckoutOpen(true)}
                />
              )}

              <button
                onClick={() => setDevBypass(true)}
                className="mt-5 text-[11px] text-neutral-400 hover:text-neutral-600 underline"
              >
                Dev unlock (remove before ship)
              </button>
            </div>
          </div>
        )}
      </div>

      {account && (
        <StripeCheckoutModal
          open={checkoutOpen}
          wallet={account.address}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            setCheckoutOpen(false);
            refresh();
          }}
        />
      )}
    </>
  );
}

/* ---------------- Step 1: sign in ---------------- */

function SignInStep() {
  return (
    <>
      <h3 className="font-title text-2xl sm:text-3xl mb-2">
        Sign in to keep reading.
      </h3>
      <p className="text-sm text-neutral-600 mb-6">
        Use Google, Apple, email, or your own wallet. Takes five seconds.
      </p>
      <div className="flex justify-center">
        <SignInButton />
      </div>
    </>
  );
}

/* ---------------- checking chain ---------------- */

function CheckingStep() {
  return (
    <div className="py-6 text-center">
      <p className="font-title text-sm tracking-wide text-neutral-500">
        Checking membership…
      </p>
    </div>
  );
}

/* ---------------- Step 2: pay ---------------- */

function PayStep({
  address,
  onCheckout,
}: {
  address: string;
  onCheckout: () => void;
}) {
  return (
    <>
      <h3 className="font-title text-2xl sm:text-3xl mb-1">
        One more step.
      </h3>
      <p className="text-xs font-mono text-neutral-400 mb-4">
        {address.slice(0, 6)}…{address.slice(-4)}
      </p>
      <p className="text-sm text-neutral-600 mb-6">
        Your membership is a digital pass that lives in your wallet.
        Subscribe once — we handle the rest.
      </p>

      <button
        onClick={onCheckout}
        className="w-full bg-black text-white py-3 font-title tracking-wide hover:bg-neutral-800"
      >
        Subscribe — $5/month
      </button>

      <p className="mt-3 text-[11px] text-neutral-400 text-center">
        Apple&nbsp;Pay · Google&nbsp;Pay · Cards · Cancel anytime
      </p>
    </>
  );
}
