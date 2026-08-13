"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Bell,
  Shield,
  Eye,
  Palette,
  Download,
  Trash2,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Check,
  AlertTriangle,
} from "lucide-react"
import { useTheme } from "next-themes"

interface SettingsData {
  account: {
    email: string
    username: string
    phone: string
    language: string
    timezone: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    priceAlerts: boolean
    newsUpdates: boolean
    tradingSignals: boolean
    weeklyReports: boolean
    marketingEmails: boolean
  }
  security: {
    twoFactorEnabled: boolean
    biometricEnabled: boolean
    sessionTimeout: string
    loginAlerts: boolean
  }
  privacy: {
    profileVisibility: string
    showTradingActivity: boolean
    dataSharing: boolean
    analyticsTracking: boolean
  }
  trading: {
    defaultOrderType: string
    confirmBeforeTrade: boolean
    riskWarnings: boolean
    autoSaveCharts: boolean
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<SettingsData>({
    account: {
      email: "",
      username: "",
      phone: "",
      language: "en",
      timezone: "UTC",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      priceAlerts: true,
      newsUpdates: true,
      tradingSignals: true,
      weeklyReports: false,
      marketingEmails: false,
    },
    security: {
      twoFactorEnabled: false,
      biometricEnabled: false,
      sessionTimeout: "30",
      loginAlerts: true,
    },
    privacy: {
      profileVisibility: "private",
      showTradingActivity: false,
      dataSharing: false,
      analyticsTracking: true,
    },
    trading: {
      defaultOrderType: "market",
      confirmBeforeTrade: true,
      riskWarnings: true,
      autoSaveCharts: true,
    },
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("tradevision_user")
    if (!storedUser) {
      router.push("/")
      return
    }
    const userData = JSON.parse(storedUser)
    setUser(userData)

    // Load saved settings
    const savedSettings = localStorage.getItem("tradevision_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    } else {
      // Initialize with user data
      setSettings((prev) => ({
        ...prev,
        account: {
          ...prev.account,
          email: userData.email,
          username: userData.name,
        },
      }))
    }
  }, [router])

  const handleSave = () => {
    localStorage.setItem("tradevision_settings", JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify({ user, settings }, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "tradevision-data.json"
    link.click()
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      localStorage.removeItem("tradevision_user")
      localStorage.removeItem("tradevision_settings")
      router.push("/")
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.account.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, email: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={settings.account.username}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, username: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.account.phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        account: { ...settings.account, phone: e.target.value },
                      })
                    }
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.account.language}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          account: { ...settings.account, language: value },
                        })
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.account.timezone}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          account: { ...settings.account, timezone: value },
                        })
                      }
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="CST">Central Time</SelectItem>
                        <SelectItem value="MST">Mountain Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="GMT">GMT</SelectItem>
                        <SelectItem value="CET">Central European Time</SelectItem>
                        <SelectItem value="JST">Japan Standard Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailNotifications: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, pushNotifications: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="price-alerts">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when prices hit your targets</p>
                  </div>
                  <Switch
                    id="price-alerts"
                    checked={settings.notifications.priceAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, priceAlerts: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="news-updates">News Updates</Label>
                    <p className="text-sm text-muted-foreground">Market news and important updates</p>
                  </div>
                  <Switch
                    id="news-updates"
                    checked={settings.notifications.newsUpdates}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, newsUpdates: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="trading-signals">Trading Signals</Label>
                    <p className="text-sm text-muted-foreground">AI-powered trading signals and recommendations</p>
                  </div>
                  <Switch
                    id="trading-signals"
                    checked={settings.notifications.tradingSignals}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, tradingSignals: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Weekly performance and market summary</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, weeklyReports: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Promotional offers and product updates</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, marketingEmails: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <Badge variant="outline" className="text-xs">
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactorEnabled: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="biometric">Biometric Authentication</Label>
                    <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                  </div>
                  <Switch
                    id="biometric"
                    checked={settings.security.biometricEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, biometricEnabled: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    id="login-alerts"
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, loginAlerts: checked },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <Select
                    value={settings.security.sessionTimeout}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: value },
                      })
                    }
                  >
                    <SelectTrigger id="session-timeout">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">Chrome on Windows • Active now</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  View All Sessions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, profileVisibility: value },
                      })
                    }
                  >
                    <SelectTrigger id="profile-visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Who can see your profile information</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="trading-activity">Show Trading Activity</Label>
                    <p className="text-sm text-muted-foreground">Display your trades and performance publicly</p>
                  </div>
                  <Switch
                    id="trading-activity"
                    checked={settings.privacy.showTradingActivity}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showTradingActivity: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Share anonymized data to improve our services</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.privacy.dataSharing}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, dataSharing: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">Help us improve by tracking usage patterns</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.privacy.analyticsTracking}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, analyticsTracking: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how TradeVision looks for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Monitor className="h-6 w-6" />
                      <span className="text-sm font-medium">System</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Trading Preferences</Label>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="default-order">Default Order Type</Label>
                      <Select
                        value={settings.trading.defaultOrderType}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            trading: { ...settings.trading, defaultOrderType: value },
                          })
                        }
                      >
                        <SelectTrigger id="default-order">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                          <SelectItem value="stop">Stop Order</SelectItem>
                          <SelectItem value="stop-limit">Stop-Limit Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="confirm-trade">Confirm Before Trade</Label>
                        <p className="text-sm text-muted-foreground">
                          Show confirmation dialog before executing trades
                        </p>
                      </div>
                      <Switch
                        id="confirm-trade"
                        checked={settings.trading.confirmBeforeTrade}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            trading: { ...settings.trading, confirmBeforeTrade: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="risk-warnings">Risk Warnings</Label>
                        <p className="text-sm text-muted-foreground">Display risk warnings for high-risk trades</p>
                      </div>
                      <Switch
                        id="risk-warnings"
                        checked={settings.trading.riskWarnings}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            trading: { ...settings.trading, riskWarnings: checked },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-save">Auto-Save Charts</Label>
                        <p className="text-sm text-muted-foreground">Automatically save your chart configurations</p>
                      </div>
                      <Switch
                        id="auto-save"
                        checked={settings.trading.autoSaveCharts}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            trading: { ...settings.trading, autoSaveCharts: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export or delete your account data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
                    <Download className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">Export Your Data</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Download a copy of your account data, trading history, and settings
                      </p>
                      <Button onClick={handleExportData} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 border border-destructive/50 bg-destructive/5 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1 text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button onClick={handleDeleteAccount} variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
