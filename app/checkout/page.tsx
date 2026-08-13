"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Checkout from "@/components/checkout"
import { PRODUCTS, formatPrice } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get("product")
  const [product, setProduct] = useState<(typeof PRODUCTS)[0] | null>(null)

  useEffect(() => {
    if (productId) {
      const foundProduct = PRODUCTS.find((p) => p.id === productId)
      setProduct(foundProduct || null)
    }
  }, [productId])

  if (!productId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Product Selected</h1>
          <p className="text-muted-foreground mb-6">Please select a plan to continue.</p>
          <Link href="/#premium">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Plans
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The selected plan could not be found.</p>
          <Link href="/#premium">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Plans
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/#premium">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Plans
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Purchase</h1>
            <p className="text-muted-foreground">
              You're subscribing to the <span className="font-semibold">{product.name}</span> plan at{" "}
              <span className="font-semibold">{formatPrice(product.priceInCents)}/month</span>
            </p>
          </div>

          {/* Checkout Form */}
          <div className="bg-card rounded-lg border p-6">
            <Checkout productId={productId} />
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>🔒 Secure payment powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
