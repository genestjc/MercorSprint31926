"use client";

import { useEffect } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { thirdwebClient } from "@/app/lib/thirdweb";
import { inAppWallet } from "thirdweb/wallets";
import { useMembership } from "@/app/components/providers/MembershipContext";
import MockThirdWebAuth from "./MockThirdWebAuth";

export default function ThirdWebAuth() {
  const { setWalletAddress } = useMembership();

  if (!thirdwebClient) {
    return <MockThirdWebAuth />;
  }

  return <ThirdWebAuthInner setWalletAddress={setWalletAddress} />;
}

function ThirdWebAuthInner({
  setWalletAddress,
}: {
  setWalletAddress: (addr: string | null) => void;
}) {
  const account = useActiveAccount();

  useEffect(() => {
    setWalletAddress(account?.address ?? null);
  }, [account, setWalletAddress]);

  return (
    <ConnectButton
      client={thirdwebClient!}
      wallets={[
        inAppWallet({
          auth: {
            options: ["google", "apple", "facebook", "email"],
          },
        }),
      ]}
      theme="light"
      connectButton={{
        label: "Sign in to access",
        style: {
          width: "100%",
          borderRadius: "8px",
          fontSize: "14px",
        },
      }}
    />
  );
}
