"use client";

import { useCallback, useEffect, useState } from "react";
import { getContract, readContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { twClient, MEMBERSHIP_CONTRACT } from "./thirdweb";

const ZERO = "0x0000000000000000000000000000000000000000";
const CONTRACT_CONFIGURED = MEMBERSHIP_CONTRACT !== ZERO;

/**
 * Membership gate.
 * Source of truth = MembershipPass.isActive(wallet) — expiry-aware.
 * Falls back to sessionStorage until the contract is deployed.
 */
export function useMembership(address: string | undefined) {
  const [hasMembership, setHasMembership] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!address) {
      setHasMembership(false);
      setExpiresAt(null);
      return;
    }

    if (!CONTRACT_CONFIGURED) {
      const exp = Number(
        sessionStorage.getItem(`demo-expiry:${address}`) || 0
      );
      setExpiresAt(exp || null);
      setHasMembership(exp > Date.now() / 1000);
      return;
    }

    setLoading(true);
    try {
      const contract = getContract({
        client: twClient,
        chain: base,
        address: MEMBERSHIP_CONTRACT,
      });
      const [active, expiry] = await Promise.all([
        readContract({
          contract,
          method: "function isActive(address) view returns (bool)",
          params: [address],
        }),
        readContract({
          contract,
          method: "function expiresAtFor(address) view returns (uint64)",
          params: [address],
        }),
      ]);
      setHasMembership(active);
      setExpiresAt(Number(expiry) || null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { hasMembership, expiresAt, loading, refresh };
}

/** Demo-mode helper — grants 30 days locally when no contract exists. */
export function grantDemoMembership(address: string) {
  if (CONTRACT_CONFIGURED) return;
  const thirtyDays = 30 * 24 * 60 * 60;
  const now = Math.floor(Date.now() / 1000);
  const current = Number(
    sessionStorage.getItem(`demo-expiry:${address}`) || 0
  );
  const base = current > now ? current : now;
  sessionStorage.setItem(`demo-expiry:${address}`, String(base + thirtyDays));
}
