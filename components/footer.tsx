"use client"

import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

interface FooterProps {
  onNavigate: (view: "home" | "platform" | "upload") => void
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToSection = (sectionId: string) => {
    onNavigate("home")
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  const footerLinks = {
    Platform: [
      { name: "Trading Dashboard", action: () => onNavigate("platform") },
      { name: "Chart Upload", action: () => onNavigate("upload") },
      { name: "Market Data", action: () => scrollToSection("features") },
      { name: "AI Signals", action: () => scrollToSection("features") },
    ],
    Company: [
      { name: "About Us", action: () => scrollToSection("about") },
      { name: "Our Experts", action: () => scrollToSection("experts") },
      { name: "Pricing", action: () => scrollToSection("premium") },
      { name: "Contact", action: () => (window.location.href = "mailto:support@tradevision.ai") },
    ],
    Resources: [
      { name: "Documentation", action: () => console.log("Documentation") },
      { name: "API Reference", action: () => console.log("API") },
      { name: "Tutorials", action: () => scrollToSection("features") },
      { name: "Community", action: () => console.log("Community") },
    ],
    Legal: [
      { name: "Privacy Policy", action: () => console.log("Privacy") },
      { name: "Terms of Service", action: () => console.log("Terms") },
      { name: "Cookie Policy", action: () => console.log("Cookies") },
      { name: "Disclaimer", action: () => console.log("Disclaimer") },
    ],
  }

  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-chart-2 bg-clip-text text-transparent mb-3">
              TradeVision
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              AI-powered trading platform for modern investors. Trade smarter with intelligent insights.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-accent/10 p-2 rounded-lg transition-smooth hover:scale-110"
              >
                <Twitter className="h-4 w-4 text-muted-foreground hover:text-accent" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-accent/10 p-2 rounded-lg transition-smooth hover:scale-110"
              >
                <Linkedin className="h-4 w-4 text-muted-foreground hover:text-accent" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-accent/10 p-2 rounded-lg transition-smooth hover:scale-110"
              >
                <Facebook className="h-4 w-4 text-muted-foreground hover:text-accent" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-accent/10 p-2 rounded-lg transition-smooth hover:scale-110"
              >
                <Instagram className="h-4 w-4 text-muted-foreground hover:text-accent" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={link.action}
                      className="text-sm text-muted-foreground hover:text-accent transition-smooth hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 TradeVision. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => console.log("Privacy")}
              className="text-sm text-muted-foreground hover:text-accent transition-smooth"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => console.log("Terms")}
              className="text-sm text-muted-foreground hover:text-accent transition-smooth"
            >
              Terms of Service
            </button>
            <button
              onClick={() => console.log("Cookies")}
              className="text-sm text-muted-foreground hover:text-accent transition-smooth"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
