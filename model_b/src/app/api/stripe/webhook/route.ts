import { NextResponse } from "next/server";
import Stripe from "stripe";
import { mintMembershipNFT, burnMembershipNFT, hasThirdWebEngineConfig } from "@/app/lib/thirdweb-engine";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  const rawBody = await request.text();
  const sigHeader = request.headers.get("stripe-signature");

  if (!sigHeader) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sigHeader, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const metadata = invoice.parent?.subscription_details?.metadata;

      if (metadata?.mintNft === "true" && metadata.walletAddress) {
        const subscriptionId =
          typeof invoice.parent?.subscription_details?.subscription === "string"
            ? invoice.parent.subscription_details.subscription
            : invoice.parent?.subscription_details?.subscription?.id;

        if (subscriptionId) {
          // Idempotency: check if we already minted for this invoice
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          if (sub.metadata.lastMintedInvoice === invoice.id) {
            console.log(`Mint already completed for invoice ${invoice.id}, skipping`);
            break;
          }

          if (!hasThirdWebEngineConfig()) {
            console.warn("ThirdWeb Engine not configured — skipping NFT mint");
            break;
          }

          console.log(`Minting membership NFT to ${metadata.walletAddress} for invoice ${invoice.id}`);
          const result = await mintMembershipNFT(metadata.walletAddress);

          if (result.success) {
            console.log(`Mint queued: ${result.queueId}`);
            await stripe.subscriptions.update(subscriptionId, {
              metadata: { ...sub.metadata, lastMintedInvoice: invoice.id },
            });
          } else {
            console.error(`Mint failed: ${result.error}`);
          }
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const walletAddress = subscription.metadata?.walletAddress;
      console.log(
        `Subscription ${subscription.id} cancelled for customer ${subscription.customer}`
      );

      if (walletAddress && hasThirdWebEngineConfig()) {
        console.log(`Burning membership NFT for wallet ${walletAddress}`);
        const burnResult = await burnMembershipNFT(walletAddress);
        if (burnResult.success) {
          console.log(`Burn queued: ${burnResult.queueId ?? "no tokens to burn"}`);
        } else {
          console.error(`Burn failed: ${burnResult.error}`);
        }
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
