"use client"

import { useMemo, useState } from "react"
import { ArrowDownToLine, ArrowUpFromLine, BriefcaseBusiness, CircleDollarSign, Info, ListOrdered, Plus, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Order = { id: number; side: "BUY" | "SELL"; symbol: string; quantity: number; price: number; status: "Simulated"; time: string }

const STARTING_BALANCE = 1000000
const MARKET_SNAPSHOT: Record<string, { name: string; price: number; currency: string; source: string }> = {
  NIFTY: { name: "NIFTY 50", price: 24350, currency: "INR", source: "Demo paper account" },
  RELIANCE: { name: "Reliance Industries", price: 1425, currency: "INR", source: "Demo paper account" },
  AAPL: { name: "Apple Inc.", price: 0, currency: "USD", source: "Awaiting verified quote" },
}

export function PaperTradingSection() {
  const [symbol, setSymbol] = useState("NIFTY")
  const [side, setSide] = useState<"BUY" | "SELL">("BUY")
  const [quantity, setQuantity] = useState("1")
  const [orders, setOrders] = useState<Order[]>([])
  const [cash, setCash] = useState(STARTING_BALANCE)
  const snapshot = MARKET_SNAPSHOT[symbol]
  const hasQuote = snapshot.price > 0
  const holdings = useMemo(() => orders.reduce((total, order) => total + (order.side === "BUY" ? order.quantity : -order.quantity), 0), [orders])
  const positionValue = hasQuote ? holdings * snapshot.price : 0

  function placeOrder() {
    const amount = Number(quantity)
    if (!Number.isInteger(amount) || amount <= 0 || !hasQuote) return
    const notional = amount * snapshot.price
    if (side === "BUY" && notional > cash) return
    if (side === "SELL" && amount > holdings) return
    const order: Order = { id: Date.now(), side, symbol, quantity: amount, price: snapshot.price, status: "Simulated", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
    setOrders((current) => [order, ...current])
    setCash((current) => current + (side === "BUY" ? -notional : notional))
  }

  return (
    <section id="paper-trading" className="scroll-mt-24 border-t border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="paper-trading-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary"><BriefcaseBusiness className="h-4 w-4" /> Practice workspace</div>
            <h2 id="paper-trading-title" className="text-3xl font-bold tracking-tight">Paper trading</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">Practice order placement with a separate virtual account. No broker orders are sent and no real money is used.</p>
          </div>
          <Badge variant="outline" className="w-fit gap-2"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> Simulation only</Badge>
        </div>

        <Alert className="mb-6"><Info className="h-4 w-4" /><AlertTitle>Clear market-data boundary</AlertTitle><AlertDescription>Quotes are only enabled when a verified price is available. The AAPL row stays disabled until a connected provider returns a quote; this prevents made-up prices from entering your practice account.</AlertDescription></Alert>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CircleDollarSign className="h-5 w-5 text-primary" /> Order ticket</CardTitle><CardDescription>Orders are filled against the displayed snapshot and recorded as simulated.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Tabs value={side} onValueChange={(value) => setSide(value as "BUY" | "SELL")}>
                <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="BUY"><ArrowUpFromLine data-icon="inline-start" /> Buy</TabsTrigger><TabsTrigger value="SELL"><ArrowDownToLine data-icon="inline-start" /> Sell</TabsTrigger></TabsList>
                <TabsContent value="BUY" className="mt-0" /><TabsContent value="SELL" className="mt-0" />
              </Tabs>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2"><Label htmlFor="paper-symbol">Instrument</Label><Select value={symbol} onValueChange={setSymbol}><SelectTrigger id="paper-symbol"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NIFTY">NIFTY 50 · INR</SelectItem><SelectItem value="RELIANCE">Reliance · INR</SelectItem><SelectItem value="AAPL">AAPL · USD</SelectItem></SelectContent></Select></div>
                <div className="flex flex-col gap-2"><Label htmlFor="paper-quantity">Quantity</Label><Input id="paper-quantity" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Displayed price</span><span className="font-mono font-semibold">{hasQuote ? `${snapshot.currency} ${snapshot.price.toLocaleString()}` : "Unavailable"}</span></div><div className="mt-2 flex items-center justify-between text-sm"><span className="text-muted-foreground">Estimated notional</span><span className="font-mono">{hasQuote ? `${snapshot.currency} ${(snapshot.price * (Number(quantity) || 0)).toLocaleString()}` : "—"}</span></div><p className="mt-3 text-xs text-muted-foreground">Source: {snapshot.source}. This is not a live execution price.</p></div>
              <Button onClick={placeOrder} disabled={!hasQuote || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0}><Plus data-icon="inline-start" /> Place simulated {side.toLowerCase()}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ListOrdered className="h-5 w-5 text-primary" /> Account overview</CardTitle><CardDescription>Virtual balance and position history for this browser session.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-5"><div className="grid grid-cols-2 gap-3"><div className="rounded-lg border border-border p-4"><p className="text-sm text-muted-foreground">Available cash</p><p className="mt-1 text-xl font-bold">₹{cash.toLocaleString()}</p></div><div className="rounded-lg border border-border p-4"><p className="text-sm text-muted-foreground">Open units</p><p className="mt-1 text-xl font-bold">{holdings}</p></div></div><Separator /><div><div className="mb-3 flex items-center justify-between"><p className="font-semibold">Recent orders</p><Badge variant="secondary">{orders.length}</Badge></div>{orders.length ? <div className="flex flex-col gap-3">{orders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"><div><p className="font-semibold">{order.side} {order.symbol} · {order.quantity}</p><p className="text-xs text-muted-foreground">{order.time} · simulated fill</p></div><span className="font-mono">{order.price.toLocaleString()}</span></div>)}</div> : <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Your simulated orders will appear here.</div>}</div><div className="flex items-center justify-between border-t border-border pt-4 text-sm"><span className="text-muted-foreground">Position value</span><span className="font-mono">{hasQuote ? `₹${positionValue.toLocaleString()}` : "Unavailable"}</span></div></CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
