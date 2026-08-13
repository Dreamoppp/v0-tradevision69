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

async function analyzeIndianStock(symbol: string, mode: string, timeframe: string, risk: string) {
  const stock = INDIAN_STOCKS.find((s) => s.symbol === symbol)
  if (!stock) {
    throw new Error(`Live market data is not configured for ${symbol}. No prediction was generated.`)
  }

  // Never manufacture a price or indicator. A live broker/data-provider adapter must supply OHLCV here.
  throw new Error(`Live market data is unavailable for ${stock.name}. No prediction was generated.`)

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
      console.log("[v0] === Starting Indian stock analysis ===")
      analysis = await analyzeIndianStock(symbol, mode, timeframe, risk)
      insights = analysis.tradingRecommendation
      console.log("[v0] === Analysis complete ===")
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
