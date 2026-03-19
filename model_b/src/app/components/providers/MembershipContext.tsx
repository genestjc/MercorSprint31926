"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type PaymentStatus = "idle" | "processing" | "succeeded" | "failed";

interface MembershipContextValue {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  paymentStatus: PaymentStatus;
  setPaymentStatus: (status: PaymentStatus) => void;
  isAuthenticated: boolean;
  isUnlocked: boolean;
}

const MembershipContext = createContext<MembershipContextValue | null>(null);

interface MembershipProviderProps {
  children: ReactNode;
  initialUnlocked?: boolean;
}

export function MembershipProvider({
  children,
  initialUnlocked = false,
}: MembershipProviderProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    initialUnlocked ? "succeeded" : "idle"
  );

  const value = useMemo<MembershipContextValue>(
    () => ({
      walletAddress,
      setWalletAddress,
      paymentStatus,
      setPaymentStatus,
      isAuthenticated: !!walletAddress,
      isUnlocked: paymentStatus === "succeeded",
    }),
    [walletAddress, paymentStatus]
  );

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership(): MembershipContextValue {
  const ctx = useContext(MembershipContext);
  if (!ctx) {
    throw new Error("useMembership must be used within a MembershipProvider");
  }
  return ctx;
}
