import "server-only"
import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error(
        "Missing STRIPE_SECRET_KEY environment variable. Ensure the Stripe integration is configured and the server has access to it.",
      )
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2024-06-20",
    })
  }
  return stripeInstance
}
