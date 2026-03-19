"use client";

import { ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { thirdwebClient } from "@/app/lib/thirdweb";

interface ThirdWebProviderWrapperProps {
  children: ReactNode;
}

export default function ThirdWebProviderWrapper({
  children,
}: ThirdWebProviderWrapperProps) {
  if (!thirdwebClient) {
    return <>{children}</>;
  }

  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}
