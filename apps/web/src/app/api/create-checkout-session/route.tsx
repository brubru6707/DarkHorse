import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(req: NextRequest) {
  try {
    let rawr = await req.json()
    console.log('Received request->', rawr.priceId);
    const priceId = rawr.priceId;

    if (!priceId) {
      return NextResponse.json(
        { statusCode: 400, message: 'Price ID is missing.' },
        { status: 400 }
      );
    }

    console.log('Received priceId:', priceId); // Keep this for debugging

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price: "price_1RkWeMKkNphBTPXqNGzwXkdc",
          quantity: 1,
        },
      ],
      mode: 'subscription',
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe Checkout Session creation error:', err);
    // You can inspect err.type and err.raw.code for more specific Stripe errors
    return NextResponse.json({ statusCode: 500, message: err.message }, { status: 500 });
  }
}