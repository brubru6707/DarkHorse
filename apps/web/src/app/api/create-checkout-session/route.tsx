import { NextRequest, NextResponse } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(req: NextRequest) {
  try {
    let rawr = await req.json()
    const priceId = rawr.priceId;

    if (!priceId) {
      return NextResponse.json(
        { statusCode: 400, message: 'Price ID is missing.' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price: "price_1RmExR4G62EmgPYd8BRS8cmZ",
          quantity: 1,
        },
      ],
      mode: 'subscription',
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });
    console.log("THIS IS THE SESSION :>", session);
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe Checkout Session creation error:', err);
    return NextResponse.json({ statusCode: 500, message: err.message }, { status: 500 });
  }
}