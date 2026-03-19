import { NextResponse } from "next/server";
import Stripe from "stripe";

const LOOKUP_KEY = "paywall_times_monthly";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const walletAddress: string | null = body.walletAddress || null;

    const stripe = new Stripe(secretKey);

    // --- Find or create the recurring price ---
    const existingPrices = await stripe.prices.list({
      lookup_keys: [LOOKUP_KEY],
      limit: 1,
    });

    let priceId: string;

    if (existingPrices.data.length > 0) {
      priceId = existingPrices.data[0].id;
    } else {
      const product = await stripe.products.create({
        name: "The Paywall Times Monthly Subscription",
      });
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 999,
        currency: "usd",
        recurring: { interval: "month" },
        lookup_key: LOOKUP_KEY,
      });
      priceId = price.id;
    }

    // --- Find or create customer by walletAddress ---
    let customer: Stripe.Customer | undefined;

    if (walletAddress) {
      const search = await stripe.customers.search({
        query: `metadata["walletAddress"]:"${walletAddress}"`,
      });
      if (search.data.length > 0) {
        customer = search.data[0];
      }
    }

    if (!customer) {
      customer = await stripe.customers.create({
        metadata: walletAddress ? { walletAddress } : {},
      });
    }

    // --- Reuse an existing incomplete subscription if present ---
    const existingSubs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "incomplete",
      limit: 1,
    });

    if (existingSubs.data.length > 0) {
      const existing = existingSubs.data[0];
      const invoice = await stripe.invoices.retrieve(
        existing.latest_invoice as string,
        { expand: ["confirmation_secret"] }
      );
      const clientSecret = invoice.confirmation_secret?.client_secret;
      if (clientSecret) {
        return NextResponse.json({
          clientSecret,
          subscriptionId: existing.id,
        });
      }
    }

    // --- Create new subscription ---
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      metadata: {
        ...(walletAddress ? { walletAddress, mintNft: "true" } : {}),
      },
      expand: ["latest_invoice.confirmation_secret"],
    });

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const clientSecret = latestInvoice.confirmation_secret!.client_secret;

    return NextResponse.json({
      clientSecret,
      subscriptionId: subscription.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
