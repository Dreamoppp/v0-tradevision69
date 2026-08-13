import { Shield, Zap, TrendingUp, Users, Award, Clock } from "lucide-react"

export function WhyChooseUsSection() {
  const reasons = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your data and investments are protected with enterprise-level encryption and security protocols.",
    },
    {
      icon: Zap,
      title: "Lightning-Fast Execution",
      description: "Execute trades in milliseconds with our advanced infrastructure and direct market access.",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Insights",
      description: "Get ahead of the market with our proprietary AI algorithms that analyze millions of data points.",
    },
    {
      icon: Users,
      title: "Expert Community",
      description: "Join thousands of successful traders sharing strategies and insights in our exclusive community.",
    },
    {
      icon: Award,
      title: "Award-Winning Platform",
      description: "Recognized by industry leaders for innovation and excellence in trading technology.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support and AI assistance whenever you need help.",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Why Choose Tradevision?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Join over 100,000 traders who trust Tradevision for their investment success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-all duration-300 hover:border-primary/20"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <reason.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{reason.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
