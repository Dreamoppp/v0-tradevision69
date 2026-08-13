"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { PriceAlertsSystem } from "@/components/price-alerts"
import {
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  Brain,
  Zap,
  DollarSign,
  AlertTriangle,
  Bell,
  Search,
} from "lucide-react"

interface TradingDashboardProps {
  user?: { email: string; name: string } | null
}

function TradingViewMiniChart({ symbol }: { symbol: string }) {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (typeof window.TradingView !== "undefined") {
        // Convert symbol to NSE format for Indian stocks
        const tvSymbol = symbol.includes(":") ? symbol : `NSE:${symbol}`
        
        new window.TradingView.widget({
          container_id: `tradingview_${symbol}`,
          autosize: false,
          width: "100%",
          height: 200,
          symbol: tvSymbol,
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: true,
          hide_legend: true,
          save_image: false,
          backgroundColor: "rgba(255, 255, 255, 1)",
        })
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [symbol])

  return <div id={`tradingview_${symbol}`} className="w-full h-48" />
}

export function TradingDashboard({ user }: TradingDashboardProps) {
  const [activeStrategy, setActiveStrategy] = useState<"swing" | "position" | "intraday">("swing")
  const [activeTab, setActiveTab] = useState<"trading" | "alerts">("trading")
  const [searchSymbol, setSearchSymbol] = useState("")
  const [searchedStocks, setSearchedStocks] = useState<string[]>([])

  const handleSearchStock = (e: React.FormEvent) => {
    e.preventDefault()
    const symbol = searchSymbol.trim().toUpperCase()
    if (symbol && !searchedStocks.includes(symbol)) {
      setSearchedStocks([...searchedStocks, symbol])
      setSearchSymbol("")
    }
  }

  const removeSearchedStock = (symbol: string) => {
    setSearchedStocks(searchedStocks.filter((s) => s !== symbol))
  }

  const strategies = {
    swing: {
      title: "Swing Trading",
      description: "Zerodha-powered swing trading for Indian stocks (2-10 day holds)",
      signals: [
        { symbol: "INFY", action: "BUY", confidence: 92, price: "₹1,750.50", target: "₹1,850.00" },
        { symbol: "TCS", action: "SELL", confidence: 87, price: "₹4,245.20", target: "₹4,130.00" },
        { symbol: "WIPRO", action: "HOLD", confidence: 78, price: "₹420.10", target: "₹450.00" },
        { symbol: "RELIANCE", action: "BUY", confidence: 89, price: "₹2,385.40", target: "₹2,500.00" },
        { symbol: "HDFC", action: "BUY", confidence: 84, price: "₹2,142.30", target: "₹2,355.00" },
      ],
    },
    position: {
      title: "Position Trading",
      description: "Long-term Zerodha analysis for weeks to months (Indian stocks)",
      signals: [
        { symbol: "SBIN", action: "BUY", confidence: 89, price: "₹445.30", target: "₹480.00" },
        { symbol: "ICICIBANK", action: "BUY", confidence: 85, price: "₹1,085.60", target: "₹1,120.00" },
        { symbol: "MARUTI", action: "HOLD", confidence: 72, price: "₹9,195.40", target: "₹9,410.00" },
        { symbol: "LT", action: "BUY", confidence: 81, price: "₹2,358.20", target: "₹2,475.00" },
        { symbol: "ITC", action: "BUY", confidence: 88, price: "₹435.80", target: "₹455.00" },
      ],
    },
    intraday: {
      title: "Intraday Trading",
      description: "Real-time Zerodha signals for same-day Indian stock trades",
      signals: [
        { symbol: "BANKBARODA", action: "BUY", confidence: 94, price: "₹145.80", target: "₹148.50" },
        { symbol: "ASIANPAINT", action: "SELL", confidence: 91, price: "₹2,938.20", target: "₹2,905.00" },
        { symbol: "BAJAJFINSV", action: "BUY", confidence: 83, price: "₹1,525.40", target: "₹1,580.00" },
        { symbol: "HCLTECH", action: "SELL", confidence: 86, price: "₹1,785.60", target: "₹1,748.00" },
        { symbol: "KOTAKBANK", action: "BUY", confidence: 79, price: "₹2,115.30", target: "₹2,202.00" },
      ],
    },
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Access Your Trading Dashboard</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Sign in to access AI-powered trading signals, price alerts, and portfolio management tools.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Real-time Signals</h3>
              <p className="text-sm text-muted-foreground">AI-powered trading recommendations</p>
            </div>
            <div className="text-center">
              <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Price Alerts</h3>
              <p className="text-sm text-muted-foreground">Smart notifications for your watchlist</p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Portfolio Tracking</h3>
              <p className="text-sm text-muted-foreground">Monitor your investment performance</p>
            </div>
          </div>
          <Button size="lg" onClick={() => window.location.reload()}>
            Sign In to Get Started
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Real-time AI-powered trading signals and portfolio management</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Trading Dashboard
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Price Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search Stock Charts
              </CardTitle>
              <CardDescription>Search for any stock symbol to view its TradingView chart</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearchStock} className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter stock symbol (e.g., AAPL, TSLA, BTC)"
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              {searchedStocks.length > 0 && (
                <div className="space-y-4">
                  {searchedStocks.map((symbol) => (
                    <Card key={symbol}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-semibold text-lg">{symbol}</div>
                          <Button variant="outline" size="sm" onClick={() => removeSearchedStock(symbol)}>
                            Remove
                          </Button>
                        </div>
                        <TradingViewMiniChart symbol={symbol} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124,580</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.4%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <Progress value={87.3} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Signals</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">10 buy, 4 sell, 1 hold</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Today's P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+$2,340</div>
                <p className="text-xs text-muted-foreground">+1.9% return</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeStrategy} onValueChange={(value) => setActiveStrategy(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="swing" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Swing Trading
              </TabsTrigger>
              <TabsTrigger value="position" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Position Trading
              </TabsTrigger>
              <TabsTrigger value="intraday" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Intraday
              </TabsTrigger>
            </TabsList>

            {Object.entries(strategies).map(([key, strategy]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      {strategy.title}
                    </CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {strategy.signals.map((signal, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="font-semibold text-lg">{signal.symbol}</div>
                                <Badge
                                  variant={
                                    signal.action === "BUY"
                                      ? "default"
                                      : signal.action === "SELL"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {signal.action}
                                </Badge>
                                <div className="text-sm text-muted-foreground">Confidence: {signal.confidence}%</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{signal.price}</div>
                                <div className="text-sm text-muted-foreground">Target: {signal.target}</div>
                              </div>
                              <Button size="sm">Execute Trade</Button>
                            </div>
                            <TradingViewMiniChart symbol={signal.symbol} />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                AI Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Market Sentiment: Bullish</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    AI analysis indicates strong bullish momentum in tech sector. Recommended allocation: 65% equities,
                    35% defensive positions.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Volatility Alert</h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Expected increased volatility in the next 2-3 trading sessions due to upcoming Fed announcement.
                    Consider reducing position sizes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <PriceAlertsSystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}
