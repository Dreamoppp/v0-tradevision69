"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  Edit,
  Save,
} from "lucide-react"
import type { User, Address, TradingProfile } from "@/types/user"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<User>>({})

  useEffect(() => {
    const storedUser = localStorage.getItem("tradevision_user")
    if (!storedUser) {
      router.push("/")
      return
    }

    try {
      const userData = JSON.parse(storedUser) as User
      // Initialize with default values if not present
      const fullUserData: User = {
        ...userData,
        kycStatus: userData.kycStatus || "not_started",
        kycLevel: userData.kycLevel || "basic",
        accountType: userData.accountType || "individual",
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
      }
      setUser(fullUserData)
      setEditedUser(fullUserData)
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/")
    }
  }, [router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updatedUser = {
        ...user,
        ...editedUser,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("tradevision_user", JSON.stringify(updatedUser))
      setUser(updatedUser as User)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving user data:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: keyof Address, value: string) => {
    setEditedUser((prev) => ({
      ...prev,
      address: {
        ...(prev.address || { street: "", city: "", state: "", country: "", postalCode: "" }),
        [field]: value,
      },
    }))
  }

  const handleTradingProfileChange = (field: keyof TradingProfile, value: any) => {
    setEditedUser((prev) => ({
      ...prev,
      tradingProfile: {
        ...(prev.tradingProfile || {
          experience: "beginner",
          tradingStyle: [],
          investmentGoals: [],
          riskTolerance: "medium",
          annualIncome: "",
          netWorth: "",
        }),
        [field]: value,
      },
    }))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  const getKycStatusBadge = () => {
    const statusConfig = {
      not_started: { label: "Not Started", variant: "secondary" as const, icon: AlertCircle },
      pending: { label: "Pending Review", variant: "default" as const, icon: Clock },
      verified: { label: "Verified", variant: "default" as const, icon: CheckCircle2 },
      rejected: { label: "Rejected", variant: "destructive" as const, icon: AlertCircle },
    }
    const config = statusConfig[user.kycStatus]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and KYC information</p>
          </div>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold mb-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="mt-2">{user.email}</CardDescription>
                <div className="mt-4">{getKycStatusBadge()}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">KYC Level</span>
                <Badge variant="outline">{user.kycLevel.toUpperCase()}</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Account Type</span>
                <span className="text-sm font-medium capitalize">{user.accountType}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              {user.verificationDate && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Verified On</span>
                  <span className="text-sm font-medium">{new Date(user.verificationDate).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your personal and trading information</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                  <TabsTrigger value="trading">Trading</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Personal Information */}
                <TabsContent value="personal" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={isEditing ? editedUser.name || "" : user.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={isEditing ? editedUser.email || "" : user.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={isEditing ? editedUser.phone || "" : user.phone || ""}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="dob"
                          type="date"
                          value={isEditing ? editedUser.dateOfBirth || "" : user.dateOfBirth || ""}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        placeholder="e.g., United States"
                        value={isEditing ? editedUser.nationality || "" : user.nationality || ""}
                        onChange={(e) => handleInputChange("nationality", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={isEditing ? editedUser.gender || "" : user.gender || ""}
                        onValueChange={(value) => handleInputChange("gender", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={isEditing ? editedUser.bio || "" : user.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </TabsContent>

                {/* Address Information */}
                <TabsContent value="address" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="street"
                          placeholder="123 Main Street"
                          value={isEditing ? editedUser.address?.street || "" : user.address?.street || ""}
                          onChange={(e) => handleAddressChange("street", e.target.value)}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={isEditing ? editedUser.address?.city || "" : user.address?.city || ""}
                          onChange={(e) => handleAddressChange("city", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={isEditing ? editedUser.address?.state || "" : user.address?.state || ""}
                          onChange={(e) => handleAddressChange("state", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="United States"
                          value={isEditing ? editedUser.address?.country || "" : user.address?.country || ""}
                          onChange={(e) => handleAddressChange("country", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          placeholder="10001"
                          value={isEditing ? editedUser.address?.postalCode || "" : user.address?.postalCode || ""}
                          onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Trading Profile */}
                <TabsContent value="trading" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Trading Experience</Label>
                      <Select
                        value={
                          isEditing
                            ? editedUser.tradingProfile?.experience || ""
                            : user.tradingProfile?.experience || ""
                        }
                        onValueChange={(value) => handleTradingProfileChange("experience", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                          <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                          <SelectItem value="professional">Professional (5+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                      <Select
                        value={
                          isEditing
                            ? editedUser.tradingProfile?.riskTolerance || ""
                            : user.tradingProfile?.riskTolerance || ""
                        }
                        onValueChange={(value) => handleTradingProfileChange("riskTolerance", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk tolerance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Conservative</SelectItem>
                          <SelectItem value="medium">Medium - Moderate</SelectItem>
                          <SelectItem value="high">High - Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annualIncome">Annual Income</Label>
                      <Select
                        value={
                          isEditing
                            ? editedUser.tradingProfile?.annualIncome || ""
                            : user.tradingProfile?.annualIncome || ""
                        }
                        onValueChange={(value) => handleTradingProfileChange("annualIncome", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-50k">$0 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                          <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                          <SelectItem value="500k+">$500,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="netWorth">Net Worth</Label>
                      <Select
                        value={
                          isEditing ? editedUser.tradingProfile?.netWorth || "" : user.tradingProfile?.netWorth || ""
                        }
                        onValueChange={(value) => handleTradingProfileChange("netWorth", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select net worth range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-100k">$0 - $100,000</SelectItem>
                          <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                          <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                          <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
                          <SelectItem value="5m+">$5,000,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Trading Styles (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Day Trading",
                        "Swing Trading",
                        "Position Trading",
                        "Scalping",
                        "Options Trading",
                        "Futures Trading",
                      ].map((style) => (
                        <label
                          key={style}
                          className="flex items-center space-x-2 p-2 border rounded hover:bg-muted cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={user.tradingProfile?.tradingStyle?.includes(style) || false}
                            disabled={!isEditing}
                            onChange={(e) => {
                              const current = editedUser.tradingProfile?.tradingStyle || []
                              const updated = e.target.checked
                                ? [...current, style]
                                : current.filter((s) => s !== style)
                              handleTradingProfileChange("tradingStyle", updated)
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Investment Goals (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Capital Growth",
                        "Income Generation",
                        "Wealth Preservation",
                        "Retirement Planning",
                        "Short-term Gains",
                        "Long-term Investment",
                      ].map((goal) => (
                        <label
                          key={goal}
                          className="flex items-center space-x-2 p-2 border rounded hover:bg-muted cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={user.tradingProfile?.investmentGoals?.includes(goal) || false}
                            disabled={!isEditing}
                            onChange={(e) => {
                              const current = editedUser.tradingProfile?.investmentGoals || []
                              const updated = e.target.checked ? [...current, goal] : current.filter((g) => g !== goal)
                              handleTradingProfileChange("investmentGoals", updated)
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Documents */}
                <TabsContent value="documents" className="space-y-4 mt-6">
                  <div className="text-center py-8">
                    <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">KYC Document Verification</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Upload your identity documents to complete KYC verification
                    </p>

                    <div className="space-y-4 max-w-md mx-auto">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">Government ID</span>
                            </div>
                            {user.documents?.find(
                              (d) => d.type === "passport" || d.type === "drivers_license" || d.type === "national_id",
                            )?.verified ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Not Uploaded</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-4">
                            Passport, Driver's License, or National ID
                          </p>
                          <Button variant="outline" className="w-full bg-transparent" disabled={!isEditing}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">Proof of Address</span>
                            </div>
                            {user.documents?.find((d) => d.type === "proof_of_address")?.verified ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Not Uploaded</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-4">
                            Utility bill, Bank statement (within 3 months)
                          </p>
                          <Button variant="outline" className="w-full bg-transparent" disabled={!isEditing}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Document
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg max-w-md mx-auto">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> Document upload is currently in demo mode. In production, documents would
                        be securely uploaded and verified by our compliance team.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
