"use client";

import { useMembership } from "@/app/components/providers/MembershipContext";

const MOCK_ADDRESS = "0xDEMO...1234";

export default function MockThirdWebAuth() {
  const { isAuthenticated, walletAddress, setWalletAddress } = useMembership();

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
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
        <button
          type="button"
          className="text-xs text-indigo-600 hover:underline ml-1"
          onClick={() => setWalletAddress(null)}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      onClick={() => setWalletAddress(MOCK_ADDRESS)}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      Sign in to access
    </button>
  );
}
