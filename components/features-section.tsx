import { Card, CardContent } from "@/components/ui/card"
import {
  BarChart3,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Brain,
  Upload,
  MessageSquare,
  Target,
  Activity,
  Cpu,
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Trading Signals",
      description:
        "Advanced machine learning algorithms provide swing, position, and intraday trading signals with confidence scores and risk analysis.",
    },
    {
      icon: Upload,
      title: "Chart Upload & Analysis",
      description:
        "Drag and drop your charts for instant AI-powered pattern recognition, trend analysis, and automated trading recommendations.",
    },
    {
      icon: MessageSquare,
      title: "AI Trading Assistant",
      description:
        "24/7 intelligent chatbot support for market analysis, strategy guidance, and platform assistance with real-time responses.",
    },
    {
      icon: Activity,
      title: "Swing Trading AI",
      description:
        "Specialized algorithms for 2-10 day swing trades with momentum analysis, support/resistance detection, and optimal entry/exit points.",
    },
    {
      icon: Target,
      title: "Position Trading AI",
      description:
        "Long-term AI analysis for weeks to months holds, focusing on fundamental trends and macro-economic indicators.",
    },
    {
      icon: Zap,
      title: "Intraday AI Signals",
      description:
        "Real-time same-day trading opportunities with millisecond analysis of price action, volume, and market microstructure.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Real-time market data with sophisticated charting tools, technical indicators, and AI-enhanced pattern recognition.",
    },
    {
      icon: Shield,
      title: "Institutional Security",
      description:
        "Bank-grade security with multi-factor authentication, encrypted data transmission, and regulatory compliance.",
    },
    {
      icon: Cpu,
      title: "Risk Management AI",
      description:
        "Intelligent position sizing, stop-loss optimization, and portfolio risk assessment with real-time monitoring and alerts.",
    },
    {
      icon: Globe,
      title: "Global Markets",
      description:
        "Access to stocks, options, futures, forex, and crypto across 150+ international markets with AI market sentiment analysis.",
    },
    {
      icon: TrendingUp,
      title: "Smart Portfolio Management",
      description:
        "AI-powered portfolio optimization with automatic rebalancing, performance attribution, and diversification recommendations.",
    },
    {
      icon: Users,
      title: "Expert AI Support",
      description:
        "Combination of AI assistance and human expert support available 24/7 for complex trading strategies and market insights.",
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            AI-Powered Trading Platform
          </h2>
          <p className="mt-6 text-lg text-muted-foreground text-pretty leading-relaxed">
            Advanced artificial intelligence meets professional trading tools for superior market performance
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border-border bg-card hover:bg-accent/5 hover:border-accent/50 transition-smooth hover:scale-105 hover:shadow-xl group fade-in-up opacity-0 stagger-${(index % 6) + 1}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-chart-2/20 group-hover:from-accent/30 group-hover:to-chart-2/30 transition-smooth">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
