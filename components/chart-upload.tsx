"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileImage, TrendingUp, BarChart3, Activity, Target, AlertTriangle, LineChart, Shield, Search, X, ArrowUpRight, ArrowDownRight, Minus, Sparkles } from "lucide-react"
import { UploadedCsvChart, type OhlcRow } from "@/components/uploaded-csv-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { InternationalChartLab } from "@/components/international-chart-lab"

const POPULAR_STOCKS = [
  { symbol: "INFY", name: "Infosys Ltd" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "WIPRO", name: "Wipro Ltd" },
  { symbol: "HCLTECH", name: "HCL Technologies" },
  { symbol: "BAJAJFINSV", name: "Bajaj Financial Services" },
  { symbol: "RELIANCE", name: "Reliance Industries" },
  { symbol: "HDFC", name: "HDFC Bank" },
  { symbol: "ICICIBANK", name: "ICICI Bank" },
  { symbol: "MARUTI", name: "Maruti Suzuki" },
  { symbol: "LT", name: "Larsen & Toubro" },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "ITC", name: "ITC Ltd" },
]

type Signal = {
  type: "Buy" | "Sell"
  date: string
  price: number
  TP: number
  SL: number
  reason: string
}

type AnalysisResult = {
  insights: string
  trend?: string
  signals?: Signal[]
  source?: "zerodha" | "fallback"
  symbol?: string
  stockName?: string
}

type SelectedStock = {
  symbol: string
  name: string
}

async function compressImage(file: File, maxWidth = 1400, quality = 0.85, targetBytes = 1.5 * 1024 * 1024): Promise<File> {
  try {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.crossOrigin = "anonymous"
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Image load failed"))
      img.src = url
    })

    let scale = Math.min(1, maxWidth / img.width)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      URL.revokeObjectURL(url)
      return file
    }

    let currentQuality = quality
    let iteration = 0
    let blob: Blob | null = null

    while (iteration < 4) {
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", currentQuality))
      if (blob && blob.size <= targetBytes) break

      currentQuality = Math.max(0.6, currentQuality - 0.1)
      scale = Math.max(0.6, scale * 0.85)
      iteration++
    }

    URL.revokeObjectURL(url)
    if (!blob) return file
    const name = file.name.replace(/\.(png|jpg|jpeg|webp|gif)$/i, ".jpg")
    return new File([blob], name, { type: "image/jpeg" })
  } catch {
    return file
  }
}

export function ChartUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [csvData, setCsvData] = useState<OhlcRow[] | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const [analysisMode, setAnalysisMode] = useState<string>("intraday")
  const [timeframe, setTimeframe] = useState<string>("15m")
  const [riskLevel, setRiskLevel] = useState<string>("medium")

  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedStocks, setSelectedStocks] = useState<SelectedStock[]>([])

  const filteredStocks = POPULAR_STOCKS.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStockSelect = (stock: SelectedStock) => {
    setSelectedStocks([stock])
    setSearchQuery("")
    setShowSuggestions(false)
    setAnalysisResult(null)
    analyzeIndianStock(stock.symbol)
  }

  const handleStockRemove = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s.symbol !== symbol))
  }

  const handleSearchFocus = () => {
    setShowSuggestions(true)
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const f = e.dataTransfer.files?.[0]
      if (!f) return

      const file = f.type.startsWith("image/") && f.size > 1.5 * 1024 * 1024 ? await compressImage(f) : f

      setUploadedFile(file)
      setAnalysisResult(null)
      setCsvData(null)
      if (file.type.startsWith("image/")) {
        setUploadedImageUrl(URL.createObjectURL(file))
        analyzeImage(file)
      } else if (file.name.toLowerCase().endsWith(".csv")) {
        setUploadedImageUrl(null)
        parseCsvAndAnalyze(file)
      }
    },
    [analysisMode, timeframe, riskLevel]
  )

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const incoming = e.target.files[0]
      const file = incoming.type.startsWith("image/") && incoming.size > 1.5 * 1024 * 1024 ? await compressImage(incoming) : incoming

      setUploadedFile(file)
      setAnalysisResult(null)
      setCsvData(null)
      if (file.type.startsWith("image/")) {
        setUploadedImageUrl(URL.createObjectURL(file))
        analyzeImage(file)
      } else if (file.name.toLowerCase().endsWith(".csv")) {
        setUploadedImageUrl(null)
        parseCsvAndAnalyze(file)
      }
    }
  }

  const parseCsvAndAnalyze = useCallback(
    async (file: File) => {
      setIsAnalyzing(true)
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter(Boolean)
      if (lines.length < 2) {
        setCsvData(null)
        setIsAnalyzing(false)
        return
      }
      const header = lines[0].trim().toLowerCase().split(",").map((h) => h.trim())
      const idx = {
        time: header.indexOf("time"),
        open: header.indexOf("open"),
        high: header.indexOf("high"),
        low: header.indexOf("low"),
        close: header.indexOf("close"),
        volume: header.indexOf("volume"),
      }
      if (idx.time === -1 || idx.open === -1 || idx.high === -1 || idx.low === -1 || idx.close === -1) {
        setCsvData(null)
        setIsAnalyzing(false)
        return
      }
      const rows: OhlcRow[] = []
      for (let i = 1; i < lines.length; i++) {
        const raw = lines[i].trim()
        if (!raw) continue
        const cols = raw.split(",")
        const row: OhlcRow = {
          time: Number(cols[idx.time]),
          open: Number(cols[idx.open]),
          high: Number(cols[idx.high]),
          low: Number(cols[idx.low]),
          close: Number(cols[idx.close]),
          volume: idx.volume !== -1 ? Number(cols[idx.volume]) : undefined,
        }
        if (isFinite(row.time) && isFinite(row.close)) {
          rows.push(row)
        }
      }
      rows.sort((a, b) => a.time - b.time)
      setCsvData(rows.length ? rows : null)

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("mode", analysisMode)
        formData.append("timeframe", timeframe)
        formData.append("risk", riskLevel)

        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 45000)

        const response = await fetch("/api/uploadChart", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })
        clearTimeout(timer)

        if (response.ok) {
          const result = await response.json()
          setAnalysisResult({
            insights: result.insights || "Analysis complete.",
            trend: result.trend,
            signals: result.signals,
            source: result.source,
          })
        } else {
          let message = "Analysis failed."
          try {
            const err = await response.json()
            message = `${err.error || message}${err.hint ? ` — ${err.hint}` : ""}`
          } catch {}
          setAnalysisResult({ insights: message })
        }
      } catch (error) {
        setAnalysisResult({
          insights: "Request failed. Please try again.",
        })
      }

      setIsAnalyzing(false)
    },
    [analysisMode, timeframe, riskLevel]
  )

  const analyzeIndianStock = useCallback(
    async (symbol: string) => {
      setIsAnalyzing(true)
      try {
        const formData = new FormData()
        formData.append("symbol", symbol)
        formData.append("mode", analysisMode)
        formData.append("timeframe", timeframe)
        formData.append("risk", riskLevel)

        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 45000)

        const response = await fetch("/api/analyzeImage", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        })
        clearTimeout(timer)

        if (response.ok) {
          const result = await response.json()
          setAnalysisResult({
            insights: result.insights || "Stock analysis complete.",
            trend: result.trend,
            signals: result.signals,
            source: result.source,
            symbol: result.symbol,
            stockName: result.stockName,
          })
        } else {
          let message = "Stock analysis failed."
          try {
            const err = await response.json()
            message = `${err.error || message}${err.hint ? ` — ${err.hint}` : ""}`
          } catch {}
          setAnalysisResult({ insights: message })
        }
      } catch (error) {
        setAnalysisResult({
          insights: "Request failed. Please try again.",
        })
      }

      setIsAnalyzing(false)
    },
    [analysisMode, timeframe, riskLevel]
  )

  const analyzeImage = useCallback(
    async (file: File) => {
      setIsAnalyzing(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("mode", analysisMode)
        formData.append("timeframe", timeframe)
        formData.append("risk", riskLevel)

        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 45000)

        const response = await fetch("/api/analyzeImage", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        })
        clearTimeout(timer)

        if (response.ok) {
          const result = await response.json()
          setAnalysisResult({
            insights: result.insights || "Image analysis complete.",
            trend: result.trend,
            signals: result.signals,
            source: result.source,
          })
        } else {
          let message = response.status === 413 ? "Image too large. Please try a smaller image." : "Image analysis failed. Please try again."
          try {
            const err = await response.json()
            message = `${err.error || message}${err.hint ? ` — ${err.hint}` : ""}`
          } catch {}
          setAnalysisResult({ insights: message })
        }
      } catch (error) {
        setAnalysisResult({
          insights: "Request failed. Please try again.",
        })
      }

      setIsAnalyzing(false)
    },
    [analysisMode, timeframe, riskLevel]
  )

  useEffect(() => {
    return () => {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl)
    }
  }, [uploadedImageUrl])

  return (
    <div className="w-full space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI-Powered Stock Analysis</h1>
        <p className="text-muted-foreground">Select an Indian stock to request analysis from verified live market data</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Stocks
          </CardTitle>
          <CardDescription>Search for stocks to get analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Indian stocks (e.g., INFY, TCS, WIPRO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              className="pl-10"
            />

            {showSuggestions && (
              <div className="absolute z-10 w-full mt-2 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <button key={stock.symbol} onClick={() => handleStockSelect(stock)} className="w-full px-4 py-3 text-left hover:bg-muted transition-colors">
                      <div className="font-medium text-foreground">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No stocks found</div>
                )}
              </div>
            )}
          </div>

          {selectedStocks.length > 0 && (
            <div className="grid gap-4">
              {selectedStocks.map((stock) => (
                <Card key={stock.symbol}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                        <CardDescription className="text-xs">{stock.name}</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleStockRemove(stock.symbol)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
                    Real-time data loaded. Analysis results below.
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResult && (() => {
        const primarySignal = analysisResult.signals?.[0]
        const signalType = primarySignal?.type ?? (analysisResult.trend === "Bullish" ? "Buy" : analysisResult.trend === "Bearish" ? "Sell" : "Wait")
        const isBuy = signalType === "Buy"
        const isSell = signalType === "Sell"
        const signalLabel = isBuy ? "BUY SETUP" : isSell ? "SELL SETUP" : "WAIT / NO TRADE"
        const signalTone = isBuy ? "border-emerald-500/30 bg-emerald-500/10" : isSell ? "border-rose-500/30 bg-rose-500/10" : "border-amber-500/30 bg-amber-500/10"
        const signalText = isBuy ? "text-emerald-400" : isSell ? "text-rose-400" : "text-amber-300"
        const SignalIcon = isBuy ? ArrowUpRight : isSell ? ArrowDownRight : Minus
        return (
          <Card className="overflow-hidden border-border/70 bg-card shadow-lg shadow-primary/5">
            <CardHeader className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-card to-transparent pb-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"><Sparkles className="size-4" /> AI chart readout</div>
                  <CardTitle className="flex items-center gap-2 text-xl"><BarChart3 className="size-5 text-primary" /> Analysis Results</CardTitle>
                  <CardDescription className="mt-1">Indicator-based setup for {analysisResult.symbol || "the uploaded chart"}</CardDescription>
                </div>
                {analysisResult.trend && <Badge variant="outline" className={`w-fit ${isBuy ? "border-emerald-500/40 text-emerald-400" : isSell ? "border-rose-500/40 text-rose-400" : "border-amber-500/40 text-amber-300"}`}>{analysisResult.trend} trend</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className={`flex items-center justify-between gap-4 rounded-2xl border p-4 ${signalTone}`}>
                <div className="flex items-center gap-3"><div className={`flex size-11 items-center justify-center rounded-full bg-background/70 ${signalText}`}><SignalIcon className="size-6" /></div><div><p className={`text-lg font-bold tracking-wide ${signalText}`}>{signalLabel}</p><p className="text-xs text-muted-foreground">Based on visible price action and indicators</p></div></div>
                {primarySignal && <Badge className={isBuy ? "bg-emerald-600 text-white hover:bg-emerald-600" : "bg-rose-600 text-white hover:bg-rose-600"}>{primarySignal.type}</Badge>}
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm leading-6 text-foreground/90 whitespace-pre-wrap">{analysisResult.insights}</div>
              {analysisResult.signals && analysisResult.signals.length > 0 && <div className="grid gap-3 sm:grid-cols-2">
                {analysisResult.signals.map((signal, i) => {
                  const signalIsBuy = signal.type === "Buy"
                  return <div key={i} className={`rounded-2xl border p-4 ${signalIsBuy ? "border-emerald-500/30 bg-emerald-500/10" : "border-rose-500/30 bg-rose-500/10"}`}>
                    <div className="flex items-center justify-between gap-3"><Badge className={signalIsBuy ? "bg-emerald-600 text-white hover:bg-emerald-600" : "bg-rose-600 text-white hover:bg-rose-600"}>{signalIsBuy ? "BUY" : "SELL"}</Badge><span className="text-xs text-muted-foreground">{signal.reason}</span></div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm"><div className="rounded-lg bg-background/60 p-2"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Entry</p><p className="mt-1 font-semibold">₹{signal.price}</p></div><div className="rounded-lg bg-background/60 p-2"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Target</p><p className={`mt-1 font-semibold ${signalIsBuy ? "text-emerald-400" : "text-rose-400"}`}>₹{signal.TP}</p></div><div className="rounded-lg bg-background/60 p-2"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Stop loss</p><p className="mt-1 font-semibold text-rose-400">₹{signal.SL}</p></div></div>
                  </div>
                })}
              </div>}
              <div className="flex items-start gap-2 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground"><Shield className="mt-0.5 size-4 shrink-0 text-primary" /><span>Signals are estimates from the uploaded chart and visible indicators, not guaranteed predictions. Verify price and timeframe before trading.</span></div>
            </CardContent>
          </Card>
        )
      })()}

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Analyzing...</p>
          </CardContent>
        </Card>
      )}

      <InternationalChartLab />
    </div>
  )
}
