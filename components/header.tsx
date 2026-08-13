"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { UserMenu } from "@/components/user-menu"
import { useState } from "react"

interface HeaderProps {
  onNavigate: (view: "home" | "platform" | "upload") => void
  currentView: string
  user?: { email: string; name: string } | null
  onLoginClick: () => void
  onLogout: () => void
}

export function Header({ onNavigate, currentView, user, onLoginClick, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
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
    setMobileMenuOpen(false)
  }

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                onClick={() => onNavigate("home")}
                className="text-2xl font-bold bg-gradient-to-r from-accent to-chart-2 bg-clip-text text-transparent hover:scale-105 transition-smooth tracking-tight"
              >
                TradeVision
              </button>
            </div>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <button
                onClick={() => onNavigate("platform")}
                className={`transition-smooth px-4 py-2 text-sm font-medium rounded-lg ${
                  currentView === "platform"
                    ? "text-accent bg-accent/10"
                    : "text-foreground hover:text-accent hover:bg-accent/5"
                }`}
              >
                Platform
              </button>
              <button
                onClick={() => onNavigate("upload")}
                className={`transition-smooth px-4 py-2 text-sm font-medium rounded-lg ${
                  currentView === "upload"
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Chart Upload
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth px-4 py-2 text-sm font-medium rounded-lg"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("experts")}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth px-4 py-2 text-sm font-medium rounded-lg"
              >
                Experts
              </button>
              <button
                onClick={() => scrollToSection("premium")}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth px-4 py-2 text-sm font-medium rounded-lg"
              >
                Pricing
              </button>
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <UserMenu user={user} onLogout={onLogout} />
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="hidden md:inline-flex hover:bg-muted/50 transition-smooth"
                  onClick={onLoginClick}
                >
                  Sign In
                </Button>
                <Button
                  className="hidden md:inline-flex bg-gradient-to-r from-accent to-chart-2 text-white hover:from-accent/90 hover:to-chart-2/90 transition-smooth hover:scale-105 shadow-sm"
                  onClick={() => onNavigate("platform")}
                >
                  Get Started
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-muted/50 transition-smooth"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onNavigate("platform")
                  setMobileMenuOpen(false)
                }}
                className="text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10 rounded-lg transition-smooth"
              >
                Platform
              </button>
              <button
                onClick={() => {
                  onNavigate("upload")
                  setMobileMenuOpen(false)
                }}
                className="text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10 rounded-lg transition-smooth"
              >
                Chart Upload
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10 rounded-lg transition-smooth"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("experts")}
                className="text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10 rounded-lg transition-smooth"
              >
                Experts
              </button>
              <button
                onClick={() => scrollToSection("premium")}
                className="text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10 rounded-lg transition-smooth"
              >
                Pricing
              </button>
              {!user && (
                <>
                  <button
                    onClick={() => {
                      onLoginClick()
                      setMobileMenuOpen(false)
                    }}
                    className="text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10 rounded-lg transition-smooth"
                  >
                    Sign In
                  </button>
                  <Button
                    className="mx-4 bg-gradient-to-r from-accent to-chart-2 text-white"
                    onClick={() => {
                      onNavigate("platform")
                      setMobileMenuOpen(false)
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
