"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, TrendingUp, TrendingDown, AlertTriangle, Plus, Trash2 } from "lucide-react"

interface PriceAlert {
  id: string
  symbol: string
  targetPrice: number
  currentPrice: number
  condition: "above" | "below"
  aiConfidence: number
  created: Date
  triggered: boolean
}

export function PriceAlertsSystem() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: "1",
      symbol: "AAPL",
      targetPrice: 180,
      currentPrice: 175.5,
      condition: "above",
      aiConfidence: 85,
      created: new Date(),
      triggered: false,
    },
    {
      id: "2",
      symbol: "TSLA",
      targetPrice: 200,
      currentPrice: 220.3,
      condition: "below",
      aiConfidence: 92,
      created: new Date(),
      triggered: true,
    },
  ])

  const [newAlert, setNewAlert] = useState({
    symbol: "",
    targetPrice: "",
    condition: "above" as "above" | "below",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) =>
        prev.map((alert) => ({
          ...alert,
          currentPrice: alert.currentPrice + (Math.random() - 0.5) * 2,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const addAlert = () => {
    if (!newAlert.symbol || !newAlert.targetPrice) return

    const alert: PriceAlert = {
      id: Date.now().toString(),
      symbol: newAlert.symbol.toUpperCase(),
      targetPrice: Number.parseFloat(newAlert.targetPrice),
      currentPrice: Math.random() * 200 + 50, // Simulated current price
      condition: newAlert.condition,
      aiConfidence: Math.floor(Math.random() * 30) + 70,
      created: new Date(),
      triggered: false,
    }

    setAlerts((prev) => [...prev, alert])
    setNewAlert({ symbol: "", targetPrice: "", condition: "above" })
  }

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const getAlertStatus = (alert: PriceAlert) => {
    const isTriggered =
      alert.condition === "above" ? alert.currentPrice >= alert.targetPrice : alert.currentPrice <= alert.targetPrice

    if (isTriggered) return "triggered"

    const diff = Math.abs(alert.currentPrice - alert.targetPrice)
    const percentage = (diff / alert.targetPrice) * 100

    if (percentage <= 5) return "close"
    return "active"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Price Alerts</h2>
          <p className="text-muted-foreground">Set intelligent price alerts with AI-powered predictions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Alert
          </CardTitle>
          <CardDescription>Set up AI-powered price alerts for your favorite stocks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, symbol: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="price">Target Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, targetPrice: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                className="w-full p-2 border border-border rounded-md bg-background"
                value={newAlert.condition}
                onChange={(e) => setNewAlert((prev) => ({ ...prev, condition: e.target.value as "above" | "below" }))}
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={addAlert} className="w-full">
                Add Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {alerts.map((alert) => {
          const status = getAlertStatus(alert)
          return (
            <Card
              key={alert.id}
              className={`transition-all duration-200 ${
                status === "triggered"
                  ? "border-green-500 bg-green-50/50"
                  : status === "close"
                    ? "border-yellow-500 bg-yellow-50/50"
                    : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{alert.symbol}</div>
                      <div className="text-sm text-muted-foreground">${alert.currentPrice.toFixed(2)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {alert.condition === "above" ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {alert.condition} ${alert.targetPrice.toFixed(2)}
                      </span>
                    </div>

                    <Badge variant={status === "triggered" ? "default" : status === "close" ? "secondary" : "outline"}>
                      {status === "triggered" ? "Triggered" : status === "close" ? "Close" : "Active"}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{alert.aiConfidence}% AI Confidence</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlert(alert.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {alerts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No alerts set</h3>
            <p className="text-muted-foreground">Create your first price alert to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
