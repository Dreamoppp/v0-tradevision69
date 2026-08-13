"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"

interface CTASectionProps {
  onStartTrial: () => void
}

export function CTASection({ onStartTrial }: CTASectionProps) {
  const handleScheduleDemo = () => {
    const pricingSection = document.getElementById("premium")
    if (pricingSection) {
      const offset = 80
      const elementPosition = pricingSection.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <section
      id="about"
      className="bg-gradient-to-r from-accent via-chart-2 to-accent py-20 sm:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl float" />
        <div
          className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl text-balance mb-6">
            Ready to Trade with AI?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 text-pretty leading-relaxed mb-10">
            Join thousands of traders using AI-powered analysis for swing trading, position trading, and intraday
            strategies. Start with intelligent chart analysis today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-accent hover:bg-white/90 shadow-2xl hover:shadow-white/20 transition-smooth hover:scale-105 px-8 py-6 text-base font-semibold"
              onClick={onStartTrial}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm transition-smooth hover:scale-105 px-8 py-6 text-base font-semibold"
              onClick={handleScheduleDemo}
            >
              <Calendar className="mr-2 h-5 w-5" />
              View Pricing
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
