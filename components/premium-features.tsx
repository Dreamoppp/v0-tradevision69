"use client"

import { Check, Crown, Zap, Brain, Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function PremiumFeaturesSection() {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individual traders getting started",
      features: [
        "Basic AI trading signals",
        "5 price alerts",
        "Email notifications",
        "Basic portfolio tracking",
        "Community access",
        "Mobile app access",
      ],
      popular: false,
      buttonText: "Start Free Trial",
    },
    {
      id: "professional",
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Advanced features for serious traders",
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
      buttonText: "Start Free Trial",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "Complete solution for professional firms",
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
      buttonText: "Contact Sales",
    },
  ]

  const premiumFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Models",
      description: "Access to our most sophisticated AI algorithms with 95%+ accuracy rates",
    },
    {
      icon: Zap,
      title: "Real-time Execution",
      description: "Lightning-fast trade execution with direct market access and minimal latency",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Advanced risk assessment tools and automated position sizing recommendations",
    },
    {
      icon: TrendingUp,
      title: "Portfolio Optimization",
      description: "AI-powered portfolio rebalancing and diversification strategies",
    },
  ]

  return (
    <section id="premium" className="py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl float" />
        <div
          className="absolute bottom-40 left-20 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance sm:text-5xl">Choose Your Trading Edge</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Unlock the full potential of AI-powered trading with our premium features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {premiumFeatures.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-smooth hover:scale-105 hover:shadow-lg fade-in-up opacity-0 stagger-${index + 1}`}
            >
              <div className="bg-gradient-to-br from-accent/20 to-chart-2/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-smooth">
                <feature.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-smooth hover:scale-105 fade-in-up opacity-0 stagger-${index + 1} ${
                plan.popular
                  ? "border-accent shadow-2xl shadow-accent/20 md:scale-105 bg-gradient-to-b from-card to-accent/5"
                  : "border-border hover:border-accent/30 bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-accent to-chart-2 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <Crown className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-lg">{plan.period}</span>
                </div>
                <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="bg-green-500/10 rounded-full p-1">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === "enterprise" ? (
                  <Button
                    className="w-full transition-smooth hover:scale-105 bg-transparent"
                    variant="outline"
                    size="lg"
                    onClick={() => (window.location.href = "mailto:sales@tradevision.ai")}
                  >
                    {plan.buttonText}
                  </Button>
                ) : (
                  <Link href={`/checkout?product=${plan.id}`}>
                    <Button
                      className={`w-full transition-smooth hover:scale-105 ${
                        plan.popular
                          ? "bg-gradient-to-r from-accent to-chart-2 hover:from-accent/90 hover:to-chart-2/90 text-white shadow-lg"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20 fade-in-up opacity-0 stagger-4">
          <div className="bg-gradient-to-br from-card to-muted/50 border border-border rounded-2xl p-10 max-w-2xl mx-auto hover:border-accent/30 transition-smooth hover:shadow-xl">
            <div className="bg-gradient-to-br from-accent/20 to-chart-2/20 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Shield className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">30-Day Money-Back Guarantee</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Try TradeVision risk-free. If you're not completely satisfied within 30 days, we'll refund your money, no
              questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
