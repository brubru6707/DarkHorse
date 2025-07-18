import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@packages/backend/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil',
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    console.log("userId", userId);
    if (!userId) {
      return NextResponse.json(
        { statusCode: 400, message: 'User ID is missing.' },
        { status: 400 }
      );
    }
    
    const user = await convex.query(api.users.getUserByClerkId, { clerkId: userId });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { statusCode: 404, message: 'User or Stripe Customer ID not found.' },
        { status: 404 }
      );
    }

    const stripeCustomerId = user.stripeCustomerId;

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      await convex.mutation(api.users.downgradeUserPlan, { userId: userId });
      return NextResponse.json(
        { statusCode: 200, message: 'No active subscription found. User plan downgraded.' }
      );
    }

    const subscriptionId = subscriptions.data[0].id;

    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: true }
    );

    await convex.mutation(api.users.downgradeUserPlan, { userId: userId });

    return NextResponse.json(
      {
        statusCode: 200,
        message: 'Subscription successfully scheduled for cancellation at the end of the period.',
        subscriptionId: canceledSubscription.id,
      }
    );

  } catch (err: any) {
    console.error('Stripe Subscription cancellation error:', err);
    return NextResponse.json({ statusCode: 500, message: err.message }, { status: 500 });
  }
}