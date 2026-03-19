"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/app/lib/stripe";
import { useMembership } from "@/app/components/providers/MembershipContext";
import type { Stripe, StripeElementsOptions } from "@stripe/stripe-js";

interface StripeProviderProps {
  children: ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
  const { walletAddress } = useMembership();
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchedForAddress = useRef<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    if (fetchedForAddress.current === walletAddress) return;
    fetchedForAddress.current = walletAddress;

    const stripePromise = getStripe();
    if (!stripePromise) return;

    stripePromise.then(setStripe);

    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Failed to create payment intent");
        }
      })
      .catch(() => setError("Failed to connect to payment server"));
  }, [walletAddress]);

  if (error || !stripe || !clientSecret) {
    return <>{children}</>;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#4f46e5",
        borderRadius: "8px",
      },
    },
  };

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
}
