import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (customerId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price.id;
          const plan = getPlanFromPriceId(priceId);

          await db.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              subscriptionId,
              subscriptionPlan: plan,
              subscriptionStatus: "ACTIVE",
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id;
        const plan = getPlanFromPriceId(priceId);

        const status = mapStripeStatus(subscription.status);

        await db.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionId: subscription.id,
            subscriptionPlan: plan,
            subscriptionStatus: status,
            trialEndsAt: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await db.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionPlan: "FREE",
            subscriptionStatus: "CANCELED",
            subscriptionId: null,
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await db.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { subscriptionStatus: "PAST_DUE" },
        });
        break;
      }

      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        if (customer.email) {
          await db.user.updateMany({
            where: { email: customer.email },
            data: { stripeCustomerId: customer.id },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function getPlanFromPriceId(priceId: string | undefined) {
  const map: Record<string, "FREE" | "SOLO" | "PRO" | "TEAM"> = {
    [process.env.STRIPE_PRICE_SOLO ?? ""]: "SOLO",
    [process.env.STRIPE_PRICE_PRO ?? ""]: "PRO",
    [process.env.STRIPE_PRICE_TEAM ?? ""]: "TEAM",
  };
  return map[priceId ?? ""] ?? "FREE";
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE" {
  const map: Record<string, "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE"> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    past_due: "PAST_DUE",
    trialing: "TRIALING",
    incomplete: "INCOMPLETE",
    incomplete_expired: "CANCELED",
    unpaid: "PAST_DUE",
    paused: "CANCELED",
  };
  return map[status] ?? "ACTIVE";
}
