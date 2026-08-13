export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface Document {
  type: "passport" | "drivers_license" | "national_id" | "proof_of_address"
  number: string
  expiryDate: string
  verified: boolean
  uploadedAt: string
}

export interface TradingProfile {
  experience: "beginner" | "intermediate" | "advanced" | "professional"
  tradingStyle: string[]
  investmentGoals: string[]
  riskTolerance: "low" | "medium" | "high"
  annualIncome: string
  netWorth: string
}

export interface User {
  // Basic Info
  email: string
  name: string

  // Personal Details
  phone?: string
  dateOfBirth?: string
  nationality?: string
  gender?: "male" | "female" | "other" | "prefer_not_to_say"

  // Address
  address?: Address

  // KYC Status
  kycStatus: "not_started" | "pending" | "verified" | "rejected"
  kycLevel: "basic" | "intermediate" | "advanced"
  verificationDate?: string

  // Documents
  documents?: Document[]

  // Trading Profile
  tradingProfile?: TradingProfile

  // Account Info
  accountType: "individual" | "business"
  isAuthenticated: boolean
  createdAt: string
  updatedAt: string

  // Profile
  avatar?: string
  bio?: string
}
