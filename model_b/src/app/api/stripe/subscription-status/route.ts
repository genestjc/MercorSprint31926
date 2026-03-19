import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("walletAddress");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "walletAddress query param is required" },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(secretKey);

    // Find customer by wallet metadata
    const search = await stripe.customers.search({
      query: `metadata["walletAddress"]:"${walletAddress}"`,
    });

    if (search.data.length === 0) {
      return NextResponse.json({ status: "none" });
    }

    const customer = search.data[0];

    // Find active subscription (includes cancel_at_period_end subscriptions)
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subs.data.length === 0) {
      return NextResponse.json({ status: "none" });
    }

    const subscription = subs.data[0];

    const periodEnd = subscription.items.data[0]?.current_period_end;

    return NextResponse.json({
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
