import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const walletAddress: string | undefined = body.walletAddress;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(secretKey);

    // Find customer by wallet metadata
    const search = await stripe.customers.search({
      query: `metadata["walletAddress"]:"${walletAddress}"`,
    });

    if (search.data.length === 0) {
      return NextResponse.json(
        { error: "No customer found for this wallet" },
        { status: 404 }
      );
    }

    const customer = search.data[0];

    // Find active subscription
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subs.data.length === 0) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const subscription = subs.data[0];

    // Set cancel_at_period_end instead of immediate cancel
    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    const periodEnd = updated.items.data[0]?.current_period_end;

    return NextResponse.json({
      canceledAt: new Date((updated.canceled_at ?? 0) * 1000).toISOString(),
      currentPeriodEnd: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
