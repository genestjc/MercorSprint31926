"use client";

import { useEffect, useState } from "react";
import { hasStripeKey } from "@/app/lib/stripe";

interface SubscriptionStatus {
  status: string;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string;
}

interface SubscriptionManagerProps {
  walletAddress: string;
}

export default function SubscriptionManager({ walletAddress }: SubscriptionManagerProps) {
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!hasStripeKey()) {
      setLoading(false);
      return;
    }

    fetch(`/api/stripe/subscription-status?walletAddress=${encodeURIComponent(walletAddress)}`)
      .then((res) => res.json())
      .then((data) => setSubStatus(data))
      .catch(() => setSubStatus(null))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  if (!hasStripeKey() || loading) return null;
  if (!subStatus || subStatus.status === "none") return null;

  const endDate = subStatus.currentPeriodEnd
    ? new Date(subStatus.currentPeriodEnd).toLocaleDateString()
    : null;

  async function handleCancel() {
    setCanceling(true);
    try {
      const res = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubStatus({
          status: "active",
          cancelAtPeriodEnd: true,
          currentPeriodEnd: data.currentPeriodEnd,
        });
      }
    } finally {
      setCanceling(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Subscription</h3>

      {subStatus.cancelAtPeriodEnd ? (
        <p className="text-sm text-gray-600">
          Your subscription ends on {endDate}. You will retain access until then.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-3">
            Your subscription is active. Next billing date: {endDate}
          </p>

          {showConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">
                Are you sure you want to cancel?
              </span>
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {canceling ? "Canceling..." : "Yes, cancel"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                No, keep it
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Cancel Subscription
            </button>
          )}
        </>
      )}
    </div>
  );
}
