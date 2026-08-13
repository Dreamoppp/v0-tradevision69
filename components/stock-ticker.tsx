"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Stock {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export function StockTicker() {
  const [stocks] = useState<Stock[]>([
    { symbol: "AAPL", price: 175.43, change: 2.34, changePercent: 1.35 },
    { symbol: "TSLA", price: 245.67, change: -3.21, changePercent: -1.29 },
    { symbol: "NVDA", price: 420.89, change: 8.45, changePercent: 2.05 },
    { symbol: "MSFT", price: 385.12, change: 4.67, changePercent: 1.23 },
    { symbol: "GOOGL", price: 138.45, change: -1.23, changePercent: -0.88 },
    { symbol: "AMZN", price: 145.78, change: 2.89, changePercent: 2.02 },
    { symbol: "META", price: 325.34, change: 5.67, changePercent: 1.77 },
    { symbol: "AMD", price: 142.56, change: -2.34, changePercent: -1.61 },
  ])

  return (
    <div className="bg-card border-y border-border overflow-hidden py-3">
      <div className="flex gap-8 ticker-scroll">
        {/* Duplicate for seamless loop */}
        {[...stocks, ...stocks].map((stock, index) => (
          <div key={index} className="flex items-center gap-3 whitespace-nowrap">
            <span className="font-semibold text-foreground">{stock.symbol}</span>
            <span className="font-mono text-sm">${stock.price.toFixed(2)}</span>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stock.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stock.changePercent >= 0 ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
