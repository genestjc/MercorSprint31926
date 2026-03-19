import { createThirdwebClient } from "thirdweb";

// Env vars are wired in LAST. A throwaway clientId keeps the
// ConnectButton rendering in demo mode without network calls.
const clientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id";

export const twClient = createThirdwebClient({ clientId });

// Placeholder — real Edition Drop / custom ERC-1155 address injected
// during the "refactor in smart contract + env vars" pass.
export const MEMBERSHIP_CONTRACT =
  process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT || "0x0000000000000000000000000000000000000000";
