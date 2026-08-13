"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Eye, EyeOff, Mail, Lock, User, Shield, Copy, Check } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: { email: string; name: string }) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"form" | "otp">("form")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return false
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Name is required")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return false
      }
    }

    return true
  }

  const sendOtp = async () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otpCode)

    // Simulate sending OTP via email/SMS
    console.log(`[v0] OTP sent to ${formData.email}: ${otpCode}`)

    // In real implementation, you would call your backend API here
    // await fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ email: formData.email, otp: otpCode }) })

    return otpCode
  }

  const copyOtp = async () => {
    try {
      await navigator.clipboard.writeText(generatedOtp)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy OTP:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (step === "form") {
        // Send OTP for verification
        await sendOtp()
        setStep("otp")
        setIsLoading(false)
      } else {
        // Verify OTP and complete authentication
        if (otp !== generatedOtp) {
          setError("Invalid OTP. Please try again.")
          setIsLoading(false)
          return
        }

        // Simulate API call for authentication
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Store user data in localStorage (in real app, use proper auth tokens)
        const userData = {
          email: formData.email,
          name: formData.name || formData.email.split("@")[0],
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
        }

        localStorage.setItem("tradevision_user", JSON.stringify(userData))

        onLogin(userData)
        setIsLoading(false)
        onClose()

        // Reset form
        setStep("form")
        setFormData({ email: "", password: "", name: "", confirmPassword: "" })
        setOtp("")
        setGeneratedOtp("")
      }
    } catch (error) {
      setError("Authentication failed. Please try again.")
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleBack = () => {
    setStep("form")
    setOtp("")
    setError("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <CardTitle className="text-2xl text-center">
            {step === "otp" ? "Verify OTP" : isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === "otp"
              ? `Enter the 6-digit code sent to ${formData.email}`
              : isLogin
                ? "Sign in to access your trading dashboard"
                : "Join thousands of successful traders"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === "otp" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-800">Demo Mode - Your OTP Code:</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyOtp}
                    className="h-8 px-2 bg-transparent"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <p className="text-lg font-mono font-bold text-blue-900 text-center bg-white p-2 rounded border">
                  {generatedOtp}
                </p>
                <p className="text-xs text-blue-600 mt-1">In production, this would be sent to your email</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    className="pl-10 text-center text-lg tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">Enter the 6-digit code shown above</p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Button>

              <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleBack}>
                Back to Form
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!isLogin && <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
          )}

          {step === "form" && (
            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
