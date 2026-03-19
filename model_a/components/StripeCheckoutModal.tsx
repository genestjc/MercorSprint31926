"use client";

import { useEffect, useState, type FormEvent } from "react";
import { grantDemoMembership } from "@/lib/useMembership";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

// Brand appearance — Futura headings, Helvetica body, sharp corners.
const appearance = {
  theme: "stripe" as const,
  variables: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSizeBase: "15px",
    colorPrimary: "#111111",
    colorText: "#111111",
    borderRadius: "2px",
  },
  rules: {
    ".Label": {
      fontFamily: '"Futura", "Futura PT", "Trebuchet MS", sans-serif',
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      fontSize: "11px",
    },
    ".Tab": {
      fontFamily: '"Futura", "Futura PT", "Trebuchet MS", sans-serif',
    },
  },
};

interface Props {
  open: boolean;
  wallet: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function StripeCheckoutModal({
  open,
  wallet,
  onClose,
  onSuccess,
}: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/stripe/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    })
      .then((r) => r.json())
      .then((d) => {
        setClientSecret(d.clientSecret);
        setDemoMode(d.mode === "demo" || !stripePromise);
      });
  }, [open, wallet]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white p-6 sm:p-8 sm:rounded-sm shadow-2xl animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-title text-2xl tracking-tight">
              Unlimited access
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              $5 / month · cancel anytime
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="mb-4 text-xs font-mono text-neutral-400">
          Minting to {wallet.slice(0, 6)}…{wallet.slice(-4)}
        </p>

        {demoMode || !clientSecret || !stripePromise ? (
          <DemoPaymentForm wallet={wallet} onSuccess={onSuccess} />
        ) : (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance }}
          >
            <LivePaymentForm onSuccess={onSuccess} />
          </Elements>
        )}

        <p className="text-[11px] text-neutral-400 mt-4 text-center">
          Apple&nbsp;Pay · Google&nbsp;Pay · Cards · Powered by Stripe
        </p>
      </div>
    </div>
  );
}

/* ---------- Live form (real Stripe keys) ---------- */

function LivePaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setErr(null);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setBusy(false);
    if (error) {
      setErr(error.message ?? "Payment failed");
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Apple Pay / Google Pay surface automatically via Payment Element wallets */}
      <PaymentElement
        options={{
          layout: "tabs",
          wallets: { applePay: "auto", googlePay: "auto" },
        }}
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-black text-white py-3 font-title tracking-wide disabled:opacity-50"
      >
        {busy ? "Processing…" : "Subscribe"}
      </button>
    </form>
  );
}

/* ---------- Demo form (no env vars yet) ---------- */

function DemoPaymentForm({
  wallet,
  onSuccess,
}: {
  wallet: string;
  onSuccess: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    grantDemoMembership(wallet);
    setBusy(false);
    onSuccess();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-sm border border-neutral-200 p-3 space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 border border-black py-2 text-xs font-title"
          >
             Pay
          </button>
          <button
            type="button"
            className="flex-1 border border-black py-2 text-xs font-title"
          >
            G Pay
          </button>
        </div>
        <div className="h-px bg-neutral-200" />
        <input
          placeholder="Card number"
          className="w-full border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400"
          defaultValue="4242 4242 4242 4242"
          readOnly
        />
        <div className="flex gap-2">
          <input
            placeholder="MM / YY"
            className="flex-1 border border-neutral-300 px-3 py-2 text-sm"
            defaultValue="12 / 34"
            readOnly
          />
          <input
            placeholder="CVC"
            className="flex-1 border border-neutral-300 px-3 py-2 text-sm"
            defaultValue="123"
            readOnly
          />
        </div>
        <p className="text-[10px] text-amber-600">
          Demo mode — add STRIPE keys to enable live Payment Element.
        </p>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-black text-white py-3 font-title tracking-wide disabled:opacity-50"
      >
        {busy ? "Processing…" : "Subscribe (demo)"}
      </button>
    </form>
  );
}
