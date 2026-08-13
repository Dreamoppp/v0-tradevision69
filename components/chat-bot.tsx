"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Send, Bot, User, TrendingUp, BarChart3, HelpCircle, MessageCircle, Sparkles } from "lucide-react"

interface ChatBotProps {
  onClose: () => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

function generateBotResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()

  // Trading strategies
  if (message.includes("strategy") || message.includes("strategies")) {
    if (message.includes("swing")) {
      return "For swing trading: Focus on 4H-1D timeframes, use RSI (30/70 levels) and MACD crossovers. Look for strong support/resistance levels. Risk 1-2% per trade with 2:1 reward ratio. Hold positions 2-7 days."
    }
    if (message.includes("day") || message.includes("intraday")) {
      return "For day trading: Use 5m-15m charts, focus on high volume stocks. Key indicators: VWAP, EMA crossovers (9/21), and volume spikes. Trade first 2 hours after market open. Always set stop-loss at 1-2%."
    }
    return "Popular strategies: 1) Trend following with moving averages 2) Breakout trading at key levels 3) Mean reversion using RSI. Choose based on your timeframe and risk tolerance."
  }

  // Risk management
  if (message.includes("risk") || message.includes("stop loss") || message.includes("position size")) {
    return "Risk Management Rules: Never risk more than 1-2% per trade. Use stop-loss orders always. Position size = (Account × Risk%) / (Entry - Stop Loss). Diversify across 3-5 positions max. Keep risk:reward ratio minimum 1:2."
  }

  // Technical indicators
  if (
    message.includes("indicator") ||
    message.includes("rsi") ||
    message.includes("macd") ||
    message.includes("moving average")
  ) {
    return "Essential indicators: RSI (oversold <30, overbought >70), MACD (momentum & trend), Moving Averages (EMA 9/21 for entries, SMA 50/200 for trend). Volume confirms breakouts. Use 2-3 indicators max to avoid confusion."
  }

  // Chart analysis
  if (message.includes("chart") || message.includes("upload") || message.includes("analyze")) {
    return "To analyze charts: Click 'Upload Chart' button, select your chart image, choose timeframe (1m-1D) and risk level. Our AI identifies support/resistance, trends, and patterns. You'll get entry/exit points with stop-loss recommendations instantly."
  }

  // Market outlook
  if (message.includes("market") || message.includes("outlook") || message.includes("trend")) {
    return "For current market analysis: Check major indices (S&P 500, NASDAQ). Look at sector rotation and volume trends. Use our platform's real-time signals for specific opportunities. Remember: trend is your friend until it ends."
  }

  // Support/Resistance
  if (message.includes("support") || message.includes("resistance") || message.includes("level")) {
    return "Support/Resistance levels are price zones where buying/selling pressure concentrates. Identify them using: previous highs/lows, round numbers, moving averages. Strong levels have multiple touches. Break above resistance = bullish, below support = bearish."
  }

  // Specific stocks/crypto
  if (
    message.includes("stock") ||
    message.includes("aapl") ||
    message.includes("tsla") ||
    message.includes("crypto") ||
    message.includes("btc")
  ) {
    return "For specific asset analysis: Upload a chart of the asset to get AI-powered technical analysis. I can identify patterns, key levels, and suggest entry/exit points based on current price action and indicators."
  }

  // Platform features
  if (message.includes("feature") || message.includes("how to") || message.includes("use")) {
    return "Platform Features: 1) Chart Upload - AI analyzes your charts instantly 2) Real-time Signals - Intraday & swing trade alerts 3) Risk Levels - Customize low/medium/high risk 4) Multi-timeframe - 1m to 1D analysis. Try uploading a chart to start!"
  }

  // Beginner questions
  if (message.includes("beginner") || message.includes("start") || message.includes("learn")) {
    return "Getting Started: 1) Learn basics: support/resistance, trends, volume 2) Start with swing trading (less stressful) 3) Use demo account first 4) Master 2-3 indicators 5) Always use stop-loss 6) Risk only 1% per trade. Practice patience!"
  }

  // Default helpful response
  return "I can help you with: Market analysis, trading strategies (day/swing), technical indicators (RSI, MACD, MA), risk management, chart analysis, and platform features. What would you like to know more about?"
}

export function ChatBot({ onClose }: ChatBotProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI trading assistant. I can help you with market analysis, trading strategies, and platform questions. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate brief processing time for better UX
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateBotResponse(input),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)
    }, 300)
  }

  const quickActions = [
    { icon: TrendingUp, label: "Market Outlook", query: "What's the current market outlook?" },
    { icon: BarChart3, label: "Trading Strategy", query: "What's a good swing trading strategy for beginners?" },
    { icon: Sparkles, label: "Analyze Chart", query: "How do I upload and analyze a chart?" },
    { icon: HelpCircle, label: "Risk Management", query: "What are the best risk management practices?" },
  ]

  const handleQuickAction = (query: string) => {
    setInput(query)
    setTimeout(() => {
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>
      handleSubmit(syntheticEvent)
    }, 0)
  }

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[600px] z-[9999]">
      <Card className="h-full flex flex-col shadow-2xl border-2 border-primary/20 bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg relative z-10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5" />
            AI Trading Assistant
            <Badge
              variant="secondary"
              className="ml-2 text-xs bg-primary-foreground/20 text-primary-foreground border-0"
            >
              Live
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground transition-colors relative z-20"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 min-h-0">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      message.role === "user" ? "bg-primary" : "bg-gradient-to-br from-primary/20 to-primary/10"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg break-words overflow-wrap-anywhere ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted border border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">Analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs h-auto py-2 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all bg-transparent"
                    onClick={() => handleQuickAction(action.query)}
                  >
                    <action.icon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t bg-background flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about trading, markets, or platform..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex gap-1 mt-2 flex-wrap">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary text-xs transition-all"
                onClick={() => handleQuickAction("Analyze AAPL stock")}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Stock Analysis
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary text-xs transition-all"
                onClick={() => handleQuickAction("Best indicators for day trading")}
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Indicators
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary text-xs transition-all"
                onClick={() => handleQuickAction("How to manage risk")}
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Risk Tips
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
