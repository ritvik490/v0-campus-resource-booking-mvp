"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, Home, LogOut, Settings, Users, BarChart3 } from "lucide-react"
import { useStore } from "@/lib/store"

interface DashboardLayoutProps {
  children: ReactNode
  role: "admin" | "student" | "organizer"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter()
  const { currentUser, setCurrentUser } = useStore()

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  const navigation = {
    admin: [
      { name: "Dashboard", icon: Home, href: "/dashboard/admin" },
      { name: "Domains", icon: Building2, href: "/dashboard/admin/domains" },
      { name: "Resources", icon: Settings, href: "/dashboard/admin/resources" },
      { name: "Bookings", icon: Calendar, href: "/dashboard/admin/bookings" },
      { name: "Analytics", icon: BarChart3, href: "/dashboard/admin/analytics" },
    ],
    student: [
      { name: "Dashboard", icon: Home, href: "/dashboard/student" },
      { name: "Browse Labs", icon: Building2, href: "/dashboard/student/domains" },
      { name: "My Bookings", icon: Calendar, href: "/dashboard/student/bookings" },
    ],
    organizer: [
      { name: "Dashboard", icon: Home, href: "/dashboard/organizer" },
      { name: "Browse Events", icon: Building2, href: "/dashboard/organizer/domains" },
      { name: "My Requests", icon: Calendar, href: "/dashboard/organizer/bookings" },
    ],
  }

  const currentNav = navigation[role]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-semibold">Campus Booking</span>
          </div>

          {/* User Info */}
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{currentUser?.name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {currentNav.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="mx-auto max-w-7xl p-8">{children}</div>
      </main>
    </div>
  )
}
