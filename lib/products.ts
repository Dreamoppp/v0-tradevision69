export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  features: string[]
  popular?: boolean
}

// This is the source of truth for all products.
// All UI to display products should pull from this array.
// IDs passed to the checkout session should be the same as IDs from this array.
export const PRODUCTS: Product[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individual traders getting started",
    priceInCents: 2900, // $29.00
    features: [
      "Basic AI trading signals",
      "5 price alerts",
      "Email notifications",
      "Basic portfolio tracking",
      "Community access",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Advanced features for serious traders",
    priceInCents: 7900, // $79.00
    features: [
      "Advanced AI trading signals",
      "Unlimited price alerts",
      "Real-time notifications",
      "Advanced portfolio analytics",
      "Priority support",
      "API access",
      "Custom indicators",
      "Risk management tools",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Complete solution for professional firms",
    priceInCents: 19900, // $199.00
    features: [
      "All Professional features",
      "White-label solution",
      "Dedicated account manager",
      "Custom AI model training",
      "Advanced compliance tools",
      "Multi-user management",
      "Custom integrations",
      "24/7 phone support",
    ],
    popular: false,
  },
]

export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(0)}`
}
