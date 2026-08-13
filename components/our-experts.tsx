"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const experts = [
  {
    name: "Kaif Syed",
    title: "Trading Mentor",
    experience: "5+ Years",
    specialization: "Stock Market Basics & Chart Reading",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kaif-z3KPgYAHPeQIEgvr4iVuiYXqrHSNez.jpg",
    description: "Helps students understand market fundamentals and basic trading strategies with simple explanations.",
  },
  {
    name: "Dhruv Mavani",
    title: "Market Educator",
    experience: "4+ Years",
    specialization: "Technical Analysis & Risk Management",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dhruv-R3TBlIFXtzVwalcPJDMCKiMmJlckGH.jpg",
    description: "Specializes in teaching technical analysis patterns and risk management techniques to beginners.",
  },
  {
    name: "Ritesh Singh",
    title: "Investment Guide",
    experience: "6+ Years",
    specialization: "Portfolio Building & Long-term Investing",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ritesh-iFXjoqqsgtxS2hIIYjKqo89FpZiPX8.jpg",
    description:
      "Focuses on teaching students how to build diversified portfolios and make smart investment decisions.",
  },
]

interface OurExpertsSectionProps {
  onGetStarted: () => void
}

export function OurExpertsSection({ onGetStarted }: OurExpertsSectionProps) {
  return (
    <section id="experts" className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Meet Our Trading Mentors</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Learn from experienced mentors who understand student needs and make trading concepts easy to understand.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {experts.map((expert, index) => (
            <Card
              key={index}
              className={`group hover:shadow-xl transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm hover:scale-105 fade-in-up opacity-0 stagger-${index + 1}`}
            >
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-accent/30 transition-all duration-300">
                    <img
                      src={expert.image || "/placeholder.svg"}
                      alt={expert.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-accent to-chart-2 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                      {expert.experience}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{expert.name}</h3>
                <p className="text-accent font-semibold mb-2">{expert.title}</p>
                <p className="text-sm text-muted-foreground font-medium mb-4">{expert.specialization}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{expert.description}</p>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">100+</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">4.8★</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 fade-in-up opacity-0 stagger-4">
          <p className="text-muted-foreground mb-6 text-lg">
            Ready to start your trading journey? Learn from mentors who care about your success.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-accent to-chart-2 text-white hover:from-accent/90 hover:to-chart-2/90 transition-smooth hover:scale-105 shadow-lg px-8 py-6"
            onClick={onGetStarted}
          >
            Start Learning Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
