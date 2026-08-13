"use client"

import type React from "react"
import { useCallback, useMemo, useState } from "react"
import { Activity, AlertTriangle, BarChart3, CheckCircle2, Clock3, FileImage, FileUp, Globe2, UploadCloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OhlcRow } from "@/components/uploaded-csv-chart"

type Exchange = { value: string; label: string; prefix: string; example: string }

const EXCHANGES: Exchange[] = [
  { value: "NASDAQ", label: "NASDAQ", prefix: "NASDAQ", example: "AAPL" },
  { value: "NYSE", label: "NYSE", prefix: "NYSE", example: "TSLA" },
  { value: "LSE", label: "London Stock Exchange", prefix: "LSE", example: "VOD" },
  { value: "HKEX", label: "Hong Kong Exchange", prefix: "HKEX", example: "0700" },
]

function parseCsv(text: string): { rows: OhlcRow[]; error?: string } {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (lines.length < 2) return { rows: [], error: "The CSV needs a header row and at least one data row." }
  const headers = lines[0].split(",").map((value) => value.trim().toLowerCase())
  const required = ["time", "open", "high", "low", "close"]
  const indexes = Object.fromEntries(required.map((key) => [key, headers.indexOf(key)]))
  if (Object.values(indexes).some((index) => index === -1)) {
    return { rows: [], error: "Required columns: time, open, high, low, close. Volume is optional." }
  }
  const volumeIndex = headers.indexOf("volume")
  const rows: OhlcRow[] = []
  for (const line of lines.slice(1)) {
    const values = line.split(",")
    const timeValue = values[indexes.time]
    const time = Number.isFinite(Number(timeValue)) ? Number(timeValue) : Date.parse(timeValue)
    const row = { time: time > 10_000_000_000 ? Math.floor(time / 1000) : time, open: Number(values[indexes.open]), high: Number(values[indexes.high]), low: Number(values[indexes.low]), close: Number(values[indexes.close]), volume: volumeIndex >= 0 ? Number(values[volumeIndex]) : undefined }
    if ([row.time, row.open, row.high, row.low, row.close].every(Number.isFinite)) rows.push(row)
  }
  if (!rows.length) return { rows: [], error: "No valid OHLC rows were found. No values were inferred." }
  return { rows: rows.sort((a, b) => a.time - b.time) }
}

export function InternationalChartLab() {
  const [exchange, setExchange] = useState("NASDAQ")
  const [symbol, setSymbol] = useState("AAPL")
  const [interval, setInterval] = useState("15")
  const [fileName, setFileName] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const [rows, setRows] = useState<OhlcRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const exchangeInfo = EXCHANGES.find((item) => item.value === exchange) ?? EXCHANGES[0]
  const tradingViewSymbol = `${exchangeInfo.prefix}:${symbol.trim().toUpperCase() || exchangeInfo.example}`
  const tradingViewUrl = useMemo(() => `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(tradingViewSymbol)}&interval=${interval}&hidetoptoolbar=1&symboledit=1&saveimage=0&toolbarbg=f7f9fc&studies=`, [tradingViewSymbol, interval])

  const analyzeImage = useCallback(async (file: File) => {
    setIsAnalyzingImage(true)
    setImageAnalysis(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("symbol", tradingViewSymbol)
      formData.append("timeframe", interval)
      formData.append("mode", "intraday")
      const response = await fetch("/api/analyzeImage", { method: "POST", body: formData, cache: "no-store" })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Image analysis failed.")
      setImageAnalysis(result.insights || "The chart was analyzed.")
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "Image analysis failed. Please try again.")
    } finally {
      setIsAnalyzingImage(false)
    }
  }, [interval, tradingViewSymbol])

  const processFile = useCallback(async (file: File) => {
    setError(null)
    setImageAnalysis(null)
    if (file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image is too large. Please upload an image under 10 MB.")
        return
      }
      if (imagePreview) URL.revokeObjectURL(imagePreview)
      setImagePreview(URL.createObjectURL(file))
      setFileName(file.name)
      setRows([])
      await analyzeImage(file)
      return
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Upload a PNG, JPG, WEBP chart image or an OHLCV CSV file.")
      return
    }
    const parsed = parseCsv(await file.text())
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setFileName(file.name)
    setRows(parsed.rows)
    setError(parsed.error ?? null)
  }, [analyzeImage, imagePreview])

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    if (file) void processFile(file)
  }, [processFile])

  return (
    <section className="border-t border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="international-chart-lab">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary"><Globe2 className="h-4 w-4" /> International market lab</div>
            <h2 id="international-chart-lab" className="text-3xl font-bold tracking-tight">Live charts and verified intraday uploads</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">TradingView supplies the live chart. Uploaded indicators use only your real OHLCV rows, with no sample or generated market data.</p>
          </div>
          <Badge variant="outline" className="w-fit gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> No mock data</Badge>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border bg-background">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> TradingView market chart</CardTitle><CardDescription>Real chart data rendered by TradingView for the selected exchange and ticker.</CardDescription></div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="space-y-1.5"><Label htmlFor="international-exchange">Exchange</Label><Select value={exchange} onValueChange={(value) => { setExchange(value); setSymbol(EXCHANGES.find((item) => item.value === value)?.example ?? "") }}><SelectTrigger id="international-exchange"><SelectValue /></SelectTrigger><SelectContent>{EXCHANGES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-1.5"><Label htmlFor="international-symbol">Ticker</Label><Input id="international-symbol" value={symbol} onChange={(event) => setSymbol(event.target.value)} placeholder={exchangeInfo.example} /></div>
                <div className="space-y-1.5"><Label htmlFor="international-timeframe">Timeframe</Label><Select value={interval} onValueChange={setInterval}><SelectTrigger id="international-timeframe"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">1 minute</SelectItem><SelectItem value="5">5 minutes</SelectItem><SelectItem value="15">15 minutes</SelectItem><SelectItem value="60">1 hour</SelectItem><SelectItem value="D">Daily</SelectItem></SelectContent></Select></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 text-xs text-muted-foreground"><span className="font-mono font-semibold text-foreground">{tradingViewSymbol}</span><span className="inline-flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-accent" /> Source: TradingView</span></div>
            <iframe title={`${tradingViewSymbol} TradingView chart`} src={tradingViewUrl} className="h-[440px] w-full border-0" loading="lazy" allowFullScreen />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary" /> Intraday chart upload</CardTitle><CardDescription>Drop a real CSV export to calculate indicators from its timestamped OHLCV rows.</CardDescription></CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <label onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragActive(false)} onDrop={onDrop} className={`flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:border-primary/60"}`}>
              <input type="file" accept="image/png,image/jpeg,image/webp,.csv,text/csv" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void processFile(file); event.currentTarget.value = "" }} />
              {imagePreview ? <img src={imagePreview} alt={`Uploaded chart ${fileName ?? "preview"}`} className="mb-4 max-h-40 max-w-full rounded-lg border border-border object-contain" /> : <FileImage className="mb-3 h-9 w-9 text-primary" />}
              <span className="font-semibold">Drag and drop a chart image or CSV here</span><span className="mt-1 text-sm text-muted-foreground">or click to browse · PNG, JPG, WEBP, or OHLCV CSV</span>{fileName && <Badge variant="secondary" className="mt-4">{fileName}</Badge>}
            </label>
            <div className="space-y-4 rounded-xl border border-border bg-background p-5">
              <div className="flex items-start gap-3"><Clock3 className="mt-0.5 h-5 w-5 text-primary" /><div><p className="font-semibold">Freshness is explicit</p><p className="text-sm leading-6 text-muted-foreground">The upload preserves your timestamps. TradingView’s feed may be real-time or delayed according to your exchange entitlement.</p></div></div>
              {error ? <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><AlertTriangle className="h-4 w-4 shrink-0" /><span>{error}</span></div> : rows.length ? <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm"><p className="font-semibold text-foreground">Verified rows loaded: {rows.length}</p><p className="mt-1 text-muted-foreground">Indicator calculations can use this uploaded dataset only. No values were filled in automatically.</p></div> : imageAnalysis ? <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm"><p className="font-semibold text-foreground">Chart image analysis</p><p className="whitespace-pre-wrap text-muted-foreground">{imageAnalysis}</p><p className="border-t border-border pt-2 text-xs text-muted-foreground">Signals are estimates from visible chart patterns and indicators, not guaranteed predictions. Verify price, timeframe, and indicators against the live TradingView chart before trading.</p></div> : <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">Upload a chart image for visual indicator analysis or a CSV for exact calculations from its OHLCV rows.</div>}
              {isAnalyzingImage && <p className="text-sm text-muted-foreground">Analyzing the uploaded chart image and visible indicators…</p>}
              <Button variant="outline" className="w-full" onClick={() => { if (imagePreview) URL.revokeObjectURL(imagePreview); setRows([]); setFileName(null); setImageFile(null); setImagePreview(null); setImageAnalysis(null); setError(null) }} disabled={!fileName}><UploadCloud className="mr-2 h-4 w-4" /> Clear uploaded data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
