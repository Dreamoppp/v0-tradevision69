"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Sparkles, Shield } from "lucide-react"
import { StockTicker } from "@/components/stock-ticker"

interface HeroSectionProps {
  onGetStarted: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl float" />
        <div
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-chart-2/5 rounded-full blur-3xl float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <Badge
            variant="secondary"
            className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 fade-in-up opacity-0 border border-border/50 shadow-sm hover:shadow-md transition-smooth hover:scale-105"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">AI-Powered Trading Platform</span>
            <ArrowRight className="h-3 w-3" />
          </Badge>

          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl fade-in-up opacity-0 stagger-1 leading-[1.1]">
            Trade Smarter with
            <span className="block mt-3 bg-gradient-to-r from-accent via-chart-2 to-accent bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground text-pretty fade-in-up opacity-0 stagger-2">
            Advanced AI trading platform with real-time analysis, automated strategies, and intelligent market insights.
            Make data-driven decisions with confidence.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up opacity-0 stagger-3">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth hover:scale-105 shadow-lg hover:shadow-xl px-8 py-6 text-base"
              onClick={onGetStarted}
            >
              Start Trading Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="transition-smooth hover:scale-105 bg-transparent border-border/50 hover:border-accent/50 hover:bg-accent/5 px-8 py-6 text-base"
              onClick={() => {
                const featuresSection = document.getElementById("features")
                featuresSection?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Explore Features
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm fade-in-up opacity-0 stagger-4">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-foreground font-medium">500K+ Active Traders</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-foreground font-medium">Real-time Data</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-foreground font-medium">Bank-Grade Security</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 fade-in-up opacity-0 stagger-5">
        <StockTicker />
      </div>
    </section>
  )
}
