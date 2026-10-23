import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 45

type AnalysisCore = {
  trend: "Bullish" | "Bearish" | "Sideways"
  currentPrice: number
  keyLevels: { support: number; resistance: number }
  technicalIndicators: string[]
  tradingRecommendation: string
  stockName?: string
  symbol?: string
}

const INDIAN_STOCKS = [
  { symbol: "INFY", name: "Infosys Ltd" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "WIPRO", name: "Wipro Ltd" },
  { symbol: "HCLTECH", name: "HCL Technologies" },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd" },
  { symbol: "RELIANCE", name: "Reliance Industries" },
  { symbol: "HDFC", name: "HDFC Bank" },
  { symbol: "ICICIBANK", name: "ICICI Bank" },
  { symbol: "MARUTI", name: "Maruti Suzuki" },
  { symbol: "LT", name: "Larsen and Toubro" },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "ITC", name: "ITC Ltd" },
]

function normalizeYahooSymbol(symbol: string) {
  const value = symbol.trim().toUpperCase()
  if (value.includes(":")) return value.split(":").at(-1) || value
  return value
}

async function analyzeMarketData(symbol: string, mode: string, timeframe: string, risk: string) {
  const yahooSymbol = normalizeYahooSymbol(symbol)
  const range = mode === "intraday" ? "5d" : "1mo"
  const interval = timeframe === "15" ? "15m" : timeframe === "60" ? "60m" : "1d"
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?range=${range}&interval=${interval}&includePrePost=false&events=div%2Csplits`
  const response = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } })
  if (!response.ok) throw new Error(`Delayed market data is unavailable for ${symbol}.`)
  const payload = await response.json()
  const result = payload.chart?.result?.[0]
  const quote = result?.indicators?.quote?.[0]
  const closes = (quote?.close ?? []).filter((value: unknown): value is number => typeof value === "number" && Number.isFinite(value))
  const highs = (quote?.high ?? []).filter((value: unknown): value is number => typeof value === "number" && Number.isFinite(value))
  const lows = (quote?.low ?? []).filter((value: unknown): value is number => typeof value === "number" && Number.isFinite(value))
  if (closes.length < 3) throw new Error(`Not enough delayed candles are available for ${symbol}.`)

  const currentPrice = closes.at(-1) as number
  const previousPrice = closes.at(-2) as number
  const change = ((currentPrice - previousPrice) / previousPrice) * 100
  const shortWindow = closes.slice(-Math.min(5, closes.length))
  const movingAverage = shortWindow.reduce((sum, value) => sum + value, 0) / shortWindow.length
  const trend: AnalysisCore["trend"] = currentPrice > movingAverage && change > 0.1 ? "Bullish" : currentPrice < movingAverage && change < -0.1 ? "Bearish" : "Sideways"
  const support = Math.min(...lows.slice(-Math.min(10, lows.length)))
  const resistance = Math.max(...highs.slice(-Math.min(10, highs.length)))
  const currency = result.meta?.currency || "USD"
  const action = trend === "Bullish" ? "BUY" : trend === "Bearish" ? "SELL" : "WAIT"
  const entry = trend === "Bullish" ? currentPrice : trend === "Bearish" ? currentPrice : movingAverage
  const stop = trend === "Bullish" ? support : resistance
  const target = trend === "Bullish" ? resistance : support
  const lastTimestamp = result.timestamp?.at(-1)
  const asOf = lastTimestamp ? new Date(lastTimestamp * 1000).toISOString() : "unknown"
  const recommendation = `${symbol} Delayed Market Analysis\nCurrent price: ${currency} ${currentPrice.toFixed(2)}\nChange: ${change.toFixed(2)}%\nTrend: ${trend}\nSupport: ${currency} ${support.toFixed(2)}\nResistance: ${currency} ${resistance.toFixed(2)}\n\nTimeframe: ${timeframe} · Mode: ${mode} · Risk: ${risk}\nSignal: ${action}\nEntry reference: ${currency} ${entry.toFixed(2)}\nStop reference: ${currency} ${stop.toFixed(2)}\nTarget reference: ${currency} ${target.toFixed(2)}\n\nSource: Yahoo Finance delayed chart data (${asOf}). Indicators: price change, 5-period moving average, recent support/resistance.`
  return { trend, currentPrice, keyLevels: { support, resistance }, technicalIndicators: ["Price change", "5-period moving average", "Recent support/resistance"], tradingRecommendation: recommendation, stockName: symbol, symbol }
}

function generateTradingSignals(analysis: AnalysisCore, mode: string, risk: string) {
  const basePrice = analysis.currentPrice
  const riskMultiplier = risk === "low" ? 0.01 : risk === "medium" ? 0.02 : 0.03
  const rewardMultiplier = risk === "low" ? 0.02 : risk === "medium" ? 0.04 : 0.06

  return [
    {
      action: analysis.trend === "Bullish" ? "BUY" : "SELL",
      price: basePrice,
      SL: basePrice * (1 - riskMultiplier),
      TP: basePrice * (1 + rewardMultiplier),
      reason: `${analysis.trend} momentum with ${mode} setup`,
      date: new Date().toISOString().split("T")[0],
    },
  ]
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const symbol = formData.get("symbol") as string
    const mode = (formData.get("mode") as string) || "swing"
    const timeframe = (formData.get("timeframe") as string) || "1d"
    const risk = (formData.get("risk") as string) || "medium"

    let analysis: AnalysisCore | null = null
    let insights: string = ""

    if (symbol) {
      console.log("[v0] === Starting delayed market analysis ===", { symbol, mode, timeframe })
      analysis = await analyzeMarketData(symbol, mode, timeframe, risk)
      insights = analysis.tradingRecommendation
      console.log("[v0] === Delayed analysis complete ===")
    } else {
      return NextResponse.json({ error: "No symbol provided" }, { status: 400 })
    }

    if (!analysis) {
      throw new Error("Analysis failed")
    }

    const signals = generateTradingSignals(analysis, mode, risk)

    return NextResponse.json({
      type: symbol ? "stock" : "image",
      insights,
      trend: analysis.trend,
      signals,
      symbol: analysis.symbol,
      stockName: analysis.stockName,
    })
  } catch (error) {
    console.error("[v0] === Analysis error ===", error)
    const message = error instanceof Error ? error.message : "Live market data is unavailable. No prediction was generated."
    return NextResponse.json(
      {
        error: message,
        details: "This endpoint no longer fabricates prices, indicators, support, resistance, entries, stops, or targets.",
      },
      { status: 503 },
    )
  }
}
