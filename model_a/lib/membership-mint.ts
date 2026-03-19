import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  sendTransaction,
  encode,
} from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { base } from "thirdweb/chains";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MEMBERSHIP_CONTRACT;

/**
 * Server-side `grantPeriod(wallet)` — called by the Stripe webhook on
 * every `invoice.paid`. Mints on first payment, extends thereafter.
 *
 * Prefers ThirdWeb Engine (server wallet, no raw key). Falls back to a
 * local private key for self-hosted / dev.
 */
export async function grantPeriodTo(wallet: string): Promise<void> {
  if (!CONTRACT_ADDRESS) {
    console.log(`[demo] would grant 30-day period to ${wallet}`);
    return;
  }

  if (hasEngine()) return grantViaEngine(wallet);
  if (hasLocalKey()) return grantViaLocalKey(wallet);

  console.log(`[demo] no signer configured — skipping grant for ${wallet}`);
}

/* -------------------------------------------------------- */
/*  Path A — ThirdWeb Engine server wallet (recommended)    */
/* -------------------------------------------------------- */

function hasEngine() {
  return (
    !!process.env.THIRDWEB_ENGINE_URL &&
    !!process.env.THIRDWEB_ENGINE_ACCESS_TOKEN &&
    !!process.env.THIRDWEB_SERVER_WALLET_ADDRESS
  );
}

async function grantViaEngine(wallet: string): Promise<void> {
  const engineUrl = process.env.THIRDWEB_ENGINE_URL!;
  const accessToken = process.env.THIRDWEB_ENGINE_ACCESS_TOKEN!;
  const backendWallet = process.env.THIRDWEB_SERVER_WALLET_ADDRESS!;

  // Encode the call once with the SDK so the ABI stays in one place.
  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "unused",
  });
  const contract = getContract({
    client,
    chain: base,
    address: CONTRACT_ADDRESS!,
  });
  const tx = prepareContractCall({
    contract,
    method: "function grantPeriod(address to)",
    params: [wallet],
  });
  const data = await encode(tx);

  const res = await fetch(
    `${engineUrl}/backend-wallet/${base.id}/send-transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-backend-wallet-address": backendWallet,
      },
      body: JSON.stringify({
        toAddress: CONTRACT_ADDRESS,
        data,
        value: "0",
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Engine send-transaction failed: ${res.status} ${body}`);
  }
}

/* -------------------------------------------------------- */
/*  Path B — local private key (dev / fallback)             */
/* -------------------------------------------------------- */

function hasLocalKey() {
  return (
    !!process.env.THIRDWEB_SECRET_KEY &&
    !!process.env.MEMBERSHIP_MINTER_PRIVATE_KEY
  );
}

async function grantViaLocalKey(wallet: string): Promise<void> {
  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY!,
  });
  const account = privateKeyToAccount({
    client,
    privateKey: process.env.MEMBERSHIP_MINTER_PRIVATE_KEY!,
  });
  const contract = getContract({
    client,
    chain: base,
    address: CONTRACT_ADDRESS!,
  });

  const tx = prepareContractCall({
    contract,
    method: "function grantPeriod(address to)",
    params: [wallet],
  });

  await sendTransaction({ account, transaction: tx });
}
