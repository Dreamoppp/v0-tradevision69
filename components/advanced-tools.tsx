"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Target, Shield, TrendingUp, AlertTriangle, Settings, Zap, BarChart3 } from "lucide-react"

export function AdvancedTools() {
  const [stopLoss, setStopLoss] = useState([5])
  const [riskReward, setRiskReward] = useState([2])
  const [riskAmount, setRiskAmount] = useState([1000])

  const calculatePositionSize = () => {
    const accountSize = riskAmount[0]
    const riskPercent = stopLoss[0]
    const calculatedRiskAmount = accountSize * (riskPercent / 100)
    return {
      maxRisk: calculatedRiskAmount,
      positionSize: Math.floor(calculatedRiskAmount / (stopLoss[0] / 100)),
      shares: Math.floor(calculatedRiskAmount / 2), // Simplified calculation
    }
  }

  const positionData = calculatePositionSize()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Trading Tools</h1>
        <p className="text-muted-foreground">Professional-grade calculators and risk management tools</p>
      </div>

      <Tabs defaultValue="risk-calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="risk-calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Risk Calculator
          </TabsTrigger>
          <TabsTrigger value="position-sizer" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Position Sizer
          </TabsTrigger>
          <TabsTrigger value="profit-loss" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            P&L Calculator
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Smart Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risk-calculator" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Risk Management Calculator
                </CardTitle>
                <CardDescription>Calculate optimal position sizes based on your risk tolerance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Account Size ($)</Label>
                  <Input
                    type="number"
                    value={riskAmount[0]}
                    onChange={(e) => setRiskAmount([Number.parseInt(e.target.value) || 0])}
                    placeholder="Enter account size"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Risk Per Trade (%): {stopLoss[0]}%</Label>
                  <Slider
                    value={stopLoss}
                    onValueChange={setStopLoss}
                    max={10}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Risk/Reward Ratio: 1:{riskReward[0]}</Label>
                  <Slider
                    value={riskReward}
                    onValueChange={setRiskReward}
                    max={5}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Max Risk Amount</p>
                    <p className="text-2xl font-bold text-red-600">${positionData.maxRisk.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Position Size</p>
                    <p className="text-2xl font-bold text-blue-600">${positionData.positionSize.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Potential Profit</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${(positionData.maxRisk * riskReward[0]).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Win Rate Needed</p>
                    <p className="text-2xl font-bold text-purple-600">{(100 / (riskReward[0] + 1)).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge variant="outline" className="mb-2">
                    <Settings className="h-3 w-3 mr-1" />
                    AI Recommendation
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Based on your risk profile, consider reducing position size by 20% during high volatility periods.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="position-sizer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                AI Position Sizing Tool
              </CardTitle>
              <CardDescription>Intelligent position sizing based on market conditions and volatility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Market Conditions</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary">Volatility: Medium</Badge>
                    <Badge variant="secondary">Trend: Bullish</Badge>
                    <Badge variant="secondary">Volume: High</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">AI Recommendations</h4>
                  <div className="space-y-2">
                    <p className="text-sm">Reduce size by 15% due to earnings week</p>
                    <p className="text-sm">Increase allocation to tech sector</p>
                    <p className="text-sm">Consider scaling into position</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Metrics</h4>
                  <div className="space-y-2">
                    <p className="text-sm">Portfolio Heat: 12%</p>
                    <p className="text-sm">Correlation Risk: Low</p>
                    <p className="text-sm">Sector Exposure: Balanced</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-loss" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Profit & Loss Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">P&L calculation tools coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Smart Alert System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Smart alerts configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
