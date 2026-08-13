"use client"

import { AnimatedCounter } from "@/components/animated-counter"

export function StatsSection() {
  const stats = [
    { label: "Assets Under Management", value: 3, suffix: "T+", prefix: "$" },
    { label: "Active Traders", value: 500, suffix: "K+" },
    { label: "Daily Volume", value: 50, suffix: "B+", prefix: "$" },
    { label: "Markets Covered", value: 150, suffix: "+" },
  ]

  return (
    <section className="bg-card border-y border-border py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Trusted by Professional Traders Worldwide
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Join thousands of traders who rely on TradeVision for their daily trading operations
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-smooth hover:scale-105 fade-in-up opacity-0 stagger-${index + 1}`}
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-accent to-chart-2 bg-clip-text text-transparent sm:text-5xl">
                <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="mt-3 text-sm font-medium text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
