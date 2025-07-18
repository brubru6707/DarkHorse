import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-06-30.basil'
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { statusCode: 400, message: 'Session ID is missing.' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { statusCode: 500, message: 'Stripe Customer ID not found in session.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      stripeCustomerId: stripeCustomerId,
      status: session.status,
      payment_status: session.payment_status,
    });

  } catch (err: any) {
    console.error('Stripe Session retrieval error:', err);
    return NextResponse.json({ statusCode: 500, message: err.message }, { status: 500 });
  }
}