"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { WhyChooseUsSection } from "@/components/why-choose-us"
import { PremiumFeaturesSection } from "@/components/premium-features"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { ChartUpload } from "@/components/chart-upload"
import { TradingDashboard } from "@/components/trading-dashboard"
import { ChatBot } from "@/components/chat-bot"
import { LoginModal } from "@/components/auth/login-modal"
import { X, MessageCircle } from "lucide-react"
import { OurExpertsSection } from "@/components/our-experts"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"home" | "platform" | "upload">("home")
  const [showChatBot, setShowChatBot] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem("tradevision_user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          if (userData.email && userData.name && userData.isAuthenticated) {
            setUser(userData)
          } else {
            localStorage.removeItem("tradevision_user")
          }
        }
      } catch (error) {
        console.error("[v0] Error checking auth status:", error)
        localStorage.removeItem("tradevision_user")
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleNavigation = (view: "home" | "platform" | "upload") => {
    if (view === "platform" && !user) {
      setShowLoginModal(true)
      return
    }
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot)
  }

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData)
    setShowLoginModal(false)
    setCurrentView("platform")
  }

  const handleLogout = () => {
    localStorage.removeItem("tradevision_user")
    setUser(null)
    setCurrentView("home")
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header
        onNavigate={handleNavigation}
        currentView={currentView}
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      {currentView === "home" && (
        <>
          <HeroSection onGetStarted={() => handleNavigation("platform")} />
          <StatsSection />
          <FeaturesSection />
          <OurExpertsSection onGetStarted={() => handleNavigation("platform")} />
          <WhyChooseUsSection />
          <PremiumFeaturesSection />
          <CTASection onStartTrial={() => handleNavigation("platform")} />
        </>
      )}

      {currentView === "platform" && <TradingDashboard user={user} />}
      {currentView === "upload" && <ChartUpload />}

      <Footer onNavigate={handleNavigation} />

      <button
        onClick={toggleChatBot}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-accent to-chart-2 text-white p-4 rounded-full shadow-2xl hover:shadow-accent/50 transition-all duration-300 z-50 hover:scale-110 group"
        aria-label={showChatBot ? "Close chat" : "Open chat"}
      >
        {showChatBot ? (
          <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </main>
  )
}
