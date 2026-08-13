"use client"

import { memo } from "react"
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export type OhlcRow = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

function formatDate(ts: number) {
  try {
    const d = new Date(Number(ts))
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${mm}/${dd}`
  } catch {
    return ""
  }
}

interface UploadedCsvChartProps {
  data: OhlcRow[]
}

function UploadedCsvChartBase({ data }: UploadedCsvChartProps) {
  // Transform OHLC to candlestick format: each bar represents [low, open/close range, high]
  const candleData = data.map((row) => ({
    time: row.time,
    low: row.low,
    high: row.high,
    open: row.open,
    close: row.close,
    // For candlestick: we'll draw from low to high, color based on open vs close
    range: [row.low, Math.min(row.open, row.close), Math.max(row.open, row.close), row.high],
    isGreen: row.close >= row.open,
  }))

  const config = {
    candle: {
      label: "Price",
      color: "hsl(25, 95%, 53%)", // orange
    },
  }

  return (
    <ChartContainer config={config} className="h-[300px] w-full">
      <ComposedChart data={candleData} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={formatDate} minTickGap={32} tickMargin={8} />
        <YAxis width={48} tickMargin={8} domain={["auto", "auto"]} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(val) => `Date: ${typeof val === "number" ? formatDate(val) : val}`}
              formatter={(value, name) => {
                if (name === "open") return [`Open: ${Number(value).toFixed(2)}`, ""]
                if (name === "high") return [`High: ${Number(value).toFixed(2)}`, ""]
                if (name === "low") return [`Low: ${Number(value).toFixed(2)}`, ""]
                if (name === "close") return [`Close: ${Number(value).toFixed(2)}`, ""]
                return [value, name]
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {/* Draw wicks (high-low line) */}
        <Bar dataKey="high" fill="transparent" stroke="hsl(25, 95%, 53%)" strokeWidth={1} isAnimationActive={false}>
          {candleData.map((entry, index) => (
            <Cell key={`wick-${index}`} />
          ))}
        </Bar>
        {/* Draw body (open-close box) */}
        <Bar dataKey="open" fill="hsl(25, 95%, 53%)" isAnimationActive={false}>
          {candleData.map((entry, index) => (
            <Cell key={`body-${index}`} fill={entry.isGreen ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"} />
          ))}
        </Bar>
      </ComposedChart>
    </ChartContainer>
  )
}

export const UploadedCsvChart = memo(UploadedCsvChartBase)
