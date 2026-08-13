"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, TrendingUp, User, Shield } from "lucide-react"

interface UserMenuProps {
  user: { email: string; name: string }
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("tradevision_user")
    setIsOpen(false)
    onLogout()
  }

  const handleBackdropClick = () => {
    setIsOpen(false)
  }

  const handleProfileClick = () => {
    setIsOpen(false)
    router.push("/profile")
  }

  const handleSettingsClick = () => {
    setIsOpen(false)
    router.push("/settings")
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={handleBackdropClick} />}
      <div className="relative">
        <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:block">{user.name}</span>
        </Button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-foreground">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors">
                <TrendingUp className="h-4 w-4" />
                Portfolio
              </button>
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-muted rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
