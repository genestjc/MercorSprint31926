const REQUIRED_ENV_VARS = [
  "THIRDWEB_ENGINE_URL",
  "THIRDWEB_ENGINE_ACCESS_TOKEN",
  "THIRDWEB_ENGINE_BACKEND_WALLET",
  "NFT_CONTRACT_ADDRESS",
  "NFT_CHAIN_ID",
] as const;

export function hasThirdWebEngineConfig(): boolean {
  return REQUIRED_ENV_VARS.every((key) => !!process.env[key]);
}

export async function mintMembershipNFT(
  walletAddress: string
): Promise<{ success: boolean; queueId?: string; error?: string }> {
  const engineUrl = process.env.THIRDWEB_ENGINE_URL;
  const accessToken = process.env.THIRDWEB_ENGINE_ACCESS_TOKEN;
  const backendWallet = process.env.THIRDWEB_ENGINE_BACKEND_WALLET;
  const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
  const chainId = process.env.NFT_CHAIN_ID;

  if (!engineUrl || !accessToken || !backendWallet || !contractAddress || !chainId) {
    return { success: false, error: "ThirdWeb Engine environment variables not configured" };
  }

  const url = `${engineUrl}/contract/${chainId}/${contractAddress}/erc721/mint-to`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-backend-wallet-address": backendWallet,
    },
    body: JSON.stringify({
      receiver: walletAddress,
      metadata: {
        name: "The Paywall Times Membership",
        description: "Monthly membership NFT for The Paywall Times",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `Engine responded ${res.status}: ${text}` };
  }

  const data = await res.json();
  return { success: true, queueId: data.result?.queueId };
}

export async function burnMembershipNFT(
  walletAddress: string
): Promise<{ success: boolean; queueId?: string; error?: string }> {
  const engineUrl = process.env.THIRDWEB_ENGINE_URL;
  const accessToken = process.env.THIRDWEB_ENGINE_ACCESS_TOKEN;
  const backendWallet = process.env.THIRDWEB_ENGINE_BACKEND_WALLET;
  const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
  const chainId = process.env.NFT_CHAIN_ID;

  if (!engineUrl || !accessToken || !backendWallet || !contractAddress || !chainId) {
    return { success: false, error: "ThirdWeb Engine environment variables not configured" };
  }

  // Find token IDs owned by this wallet
  const ownedUrl = `${engineUrl}/contract/${chainId}/${contractAddress}/erc721/get-owned?ownerWallet=${walletAddress}`;
  const ownedRes = await fetch(ownedUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!ownedRes.ok) {
    const text = await ownedRes.text();
    return { success: false, error: `Failed to fetch owned tokens: ${ownedRes.status}: ${text}` };
  }

  const ownedData = await ownedRes.json();
  const tokens: { metadata: { id: string } }[] = ownedData.result ?? [];

  if (tokens.length === 0) {
    return { success: true };
  }

  // Burn the latest token
  const latestTokenId = tokens[tokens.length - 1].metadata.id;
  const burnUrl = `${engineUrl}/contract/${chainId}/${contractAddress}/erc721/burn`;

  const burnRes = await fetch(burnUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-backend-wallet-address": backendWallet,
    },
    body: JSON.stringify({ tokenId: latestTokenId }),
  });

  if (!burnRes.ok) {
    const text = await burnRes.text();
    return { success: false, error: `Burn failed ${burnRes.status}: ${text}` };
  }

  const burnData = await burnRes.json();
  return { success: true, queueId: burnData.result?.queueId };
}
