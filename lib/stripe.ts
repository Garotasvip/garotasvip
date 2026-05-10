import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  weekly: {
    name: "Semanal",
    price: 4990,
    days: 7,
    priceId: process.env.STRIPE_PRICE_WEEKLY,
  },
  monthly: {
    name: "Mensal",
    price: 14990,
    days: 30,
    priceId: process.env.STRIPE_PRICE_MONTHLY,
  },
  quarterly: {
    name: "Trimestral",
    price: 34990,
    days: 90,
    priceId: process.env.STRIPE_PRICE_QUARTERLY,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
