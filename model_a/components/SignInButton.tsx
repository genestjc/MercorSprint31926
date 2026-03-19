"use client";

import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { twClient } from "@/lib/thirdweb";

// Social login (Google / Apple / email) + self-custodial options.
// ThirdWeb's ConnectButton handles the embedded modal UX.
const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "apple", "email", "passkey"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

export function SignInButton() {
  return (
    <ConnectButton
      client={twClient}
      wallets={wallets}
      connectButton={{
        label: "Sign in",
        style: {
          fontFamily: '"Futura", "Futura PT", "Trebuchet MS", sans-serif',
          borderRadius: 0,
          padding: "10px 18px",
          fontSize: "14px",
        },
      }}
      connectModal={{
        title: "Sign in to continue reading",
        size: "compact",
        showThirdwebBranding: false,
      }}
      theme="light"
    />
  );
}
