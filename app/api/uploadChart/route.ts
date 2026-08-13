import { type NextRequest, NextResponse } from "next/server"

function calculateSMA(data: number[], period: number): number[] {
  const sma: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(Number.NaN)
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      sma.push(sum / period)
    }
  }
  return sma
}

function calculateEMA(data: number[], period: number): number[] {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)
  let prevEMA = data[0]

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      ema.push(data[i])
    } else {
      const currentEMA = (data[i] - prevEMA) * multiplier + prevEMA
      ema.push(currentEMA)
      prevEMA = currentEMA
    }
  }
  return ema
}

function calculateRSI(data: number[], period = 14): number {
  if (data.length < period + 1) return 50

  let gains = 0
  let losses = 0

  for (let i = data.length - period; i < data.length; i++) {
    const change = data[i] - data[i - 1]
    if (change > 0) gains += change
    else losses += Math.abs(change)
  }

  const avgGain = gains / period
  const avgLoss = losses / period
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

function calculateMACD(data: number[]): { macd: number; signal: number; histogram: number } {
  const ema12 = calculateEMA(data, 12)
  const ema26 = calculateEMA(data, 26)
  const macdLine = ema12.map((val, i) => val - ema26[i])
  const signalLine = calculateEMA(
    macdLine.filter((v) => !isNaN(v)),
    9,
  )

  const macd = macdLine[macdLine.length - 1]
  const signal = signalLine[signalLine.length - 1]
  const histogram = macd - signal

  return { macd, signal, histogram }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const mode = formData.get("mode") as string
    const timeframe = formData.get("timeframe") as string
    const risk = formData.get("risk") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split(/\r?\n/).filter(Boolean)
    const headers = lines[0].toLowerCase().split(",")

    const dateIdx = headers.findIndex((h) => h.includes("date") || h.includes("time"))
    const openIdx = headers.findIndex((h) => h.includes("open"))
    const highIdx = headers.findIndex((h) => h.includes("high"))
    const lowIdx = headers.findIndex((h) => h.includes("low"))
    const closeIdx = headers.findIndex((h) => h.includes("close"))
    const volumeIdx = headers.findIndex((h) => h.includes("volume"))

    const ohlcData: Array<{ date: string; open: number; high: number; low: number; close: number; volume: number }> = []
    const closePrices: number[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      if (values.length < 5) continue

      const close = Number.parseFloat(values[closeIdx])
      if (isNaN(close)) continue

      ohlcData.push({
        date: values[dateIdx] || `Day ${i}`,
        open: Number.parseFloat(values[openIdx]) || close,
        high: Number.parseFloat(values[highIdx]) || close,
        low: Number.parseFloat(values[lowIdx]) || close,
        close,
        volume: Number.parseFloat(values[volumeIdx]) || 0,
      })
      closePrices.push(close)
    }

    if (closePrices.length < 30) {
      return NextResponse.json({ error: "Insufficient data for analysis (minimum 30 data points)" }, { status: 400 })
    }

    const sma20 = calculateSMA(closePrices, 20)
    const sma50 = calculateSMA(closePrices, 50)
    const ema9 = calculateEMA(closePrices, 9)
    const ema21 = calculateEMA(closePrices, 21)
    const rsi = calculateRSI(closePrices)
    const macd = calculateMACD(closePrices)

    const currentPrice = closePrices[closePrices.length - 1]
    const prevPrice = closePrices[closePrices.length - 2]
    const priceChange = ((currentPrice - prevPrice) / prevPrice) * 100

    const currentSMA20 = sma20[sma20.length - 1]
    const currentSMA50 = sma50[sma50.length - 1]
    const currentEMA9 = ema9[ema9.length - 1]
    const currentEMA21 = ema21[ema21.length - 1]

    let trend = "Sideways"
    let trendStrength = "Neutral"

    if (currentPrice > currentSMA20 && currentSMA20 > currentSMA50 && macd.histogram > 0) {
      trend = "Bullish"
      trendStrength = rsi > 60 ? "Strong" : "Moderate"
    } else if (currentPrice < currentSMA20 && currentSMA20 < currentSMA50 && macd.histogram < 0) {
      trend = "Bearish"
      trendStrength = rsi < 40 ? "Strong" : "Moderate"
    }

    const isBullish = trend === "Bullish"
    const modeText = mode === "intraday" ? "Intraday" : "Swing"
    const riskText = risk.charAt(0).toUpperCase() + risk.slice(1)

    const insights = `Market Overview:
The ${timeframe} chart shows ${trendStrength.toLowerCase()} ${trend.toLowerCase()} momentum. Current price is ${priceChange > 0 ? "up" : "down"} ${Math.abs(priceChange).toFixed(2)}% from previous close at $${currentPrice.toFixed(2)}.

Technical Indicators:
• RSI (14): ${rsi.toFixed(1)} - ${rsi > 70 ? "Overbought territory" : rsi < 30 ? "Oversold territory" : "Neutral zone"}
• MACD: ${macd.histogram > 0 ? "Bullish crossover" : "Bearish crossover"} with ${Math.abs(macd.histogram).toFixed(2)} histogram
• EMA 9/21: ${currentEMA9 > currentEMA21 ? "Bullish alignment" : "Bearish alignment"}
• SMA 20/50: Price ${currentPrice > currentSMA20 ? "above" : "below"} short-term moving average

Trading Recommendation:
${
  isBullish
    ? `Consider long positions with ${riskText.toLowerCase()} risk management. Entry opportunities on pullbacks to support zones around $${currentSMA20.toFixed(2)}.`
    : trend === "Bearish"
      ? `Exercise caution with long positions. Consider defensive strategies or wait for trend reversal signals. Key resistance at $${currentSMA20.toFixed(2)}.`
      : `Market is consolidating. Wait for clear directional breakout before entering positions. Monitor $${currentSMA20.toFixed(2)} level.`
}

Risk Management:
Position sizing should reflect ${riskText.toLowerCase()} risk tolerance for ${modeText.toLowerCase()} trading. ${
      risk === "low"
        ? "Use tight stop-losses and smaller position sizes."
        : risk === "high"
          ? "Wider stops acceptable but maintain overall portfolio risk limits."
          : "Balance risk-reward with moderate position sizing."
    }`

    const signals = []

    if (isBullish && rsi < 70) {
      const supportLevel = Math.min(currentSMA20, currentEMA21)
      const resistanceLevel = currentPrice * 1.05
      signals.push({
        type: "Buy",
        date: ohlcData[ohlcData.length - 1].date,
        price: currentPrice,
        TP: resistanceLevel,
        SL: supportLevel * 0.98,
        reason: `${trendStrength} bullish trend with MACD ${macd.histogram > 0 ? "positive" : "turning positive"}. RSI at ${rsi.toFixed(1)} shows room for upside. Entry near support at $${supportLevel.toFixed(2)}.`,
      })

      if (currentPrice > currentEMA9 && currentEMA9 > currentEMA21) {
        signals.push({
          type: "Buy",
          date: ohlcData[ohlcData.length - 1].date,
          price: supportLevel,
          TP: currentPrice * 1.08,
          SL: supportLevel * 0.96,
          reason: `Secondary entry on pullback to EMA support. Strong trend continuation expected with aligned moving averages.`,
        })
      }
    } else if (trend === "Bearish" && rsi > 30) {
      const resistanceLevel = Math.max(currentSMA20, currentEMA21)
      const supportLevel = currentPrice * 0.95
      signals.push({
        type: "Sell",
        date: ohlcData[ohlcData.length - 1].date,
        price: currentPrice,
        TP: supportLevel,
        SL: resistanceLevel * 1.02,
        reason: `${trendStrength} bearish trend with MACD ${macd.histogram < 0 ? "negative" : "turning negative"}. RSI at ${rsi.toFixed(1)} indicates downside potential. Resistance at $${resistanceLevel.toFixed(2)}.`,
      })
    }

    return NextResponse.json({
      type: "csv",
      chart: "candlestick_data",
      insights,
      trend,
      signals,
      dataPoints: ohlcData.length,
      indicators: {
        rsi: rsi.toFixed(1),
        macd: macd.histogram.toFixed(2),
        currentPrice: currentPrice.toFixed(2),
        sma20: currentSMA20.toFixed(2),
        sma50: currentSMA50.toFixed(2),
      },
    })
  } catch (error) {
    console.error("Error processing chart upload:", error)
    return NextResponse.json({ error: "Failed to process chart" }, { status: 500 })
  }
}
