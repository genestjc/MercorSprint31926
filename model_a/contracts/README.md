# MembershipPass — deploy with ThirdWeb

## 1. Install the contracts SDK

```bash
npm i -D @thirdweb-dev/contracts
```

## 2. Deploy (no private key leaves your machine)

```bash
npx thirdweb deploy -k <your-secret-key>
```

ThirdWeb detects `contracts/MembershipPass.sol`, compiles, uploads, and
opens a browser page where you:

1. Pick a chain (Base recommended — cheap, fast).
2. Fill constructor args:
   - `_defaultAdmin` → your wallet
   - `_name`         → `"Membership Pass"`
   - `_symbol`       → `"PASS"`
   - `_royaltyRecipient` → your wallet (or `0x0`)
   - `_royaltyBps`   → `0`
3. Sign the deploy tx.

## 3. Grant MINTER_ROLE to the backend wallet

In the ThirdWeb dashboard → Permissions → add `MINTER_ROLE` for the
address whose private key is `MEMBERSHIP_MINTER_PRIVATE_KEY`.

## 4. Drop the address into `.env.local`

```
NEXT_PUBLIC_MEMBERSHIP_CONTRACT=0xYourDeployedAddress
```

The paywall now reads `isActive(wallet)` on-chain and the Stripe
webhook calls `grantPeriod(wallet)` on every `invoice.paid`.
