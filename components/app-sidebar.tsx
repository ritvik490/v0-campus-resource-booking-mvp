"use client"

import { Calendar, LayoutDashboard, FolderKanban, QrCode, BarChart3, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AppSidebarProps {
  role: "admin" | "student" | "organizer"
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname()

  const adminItems = [
    { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Resources", url: "/dashboard/admin/resources", icon: FolderKanban },
    { title: "Bookings", url: "/dashboard/admin/bookings", icon: Calendar },
    { title: "Analytics", url: "/dashboard/admin/analytics", icon: BarChart3 },
  ]

  const studentItems = [
    { title: "Dashboard", url: "/dashboard/student", icon: LayoutDashboard },
    { title: "Browse Resources", url: "/dashboard/student/domains", icon: FolderKanban },
    { title: "My Bookings", url: "/dashboard/student/bookings", icon: Calendar },
    { title: "QR Check-in", url: "/qr-checkin", icon: QrCode },
  ]

  const organizerItems = [
    { title: "Dashboard", url: "/dashboard/organizer", icon: LayoutDashboard },
    { title: "Browse Events", url: "/dashboard/organizer/domains", icon: FolderKanban },
    { title: "My Requests", url: "/dashboard/organizer/bookings", icon: Calendar },
    { title: "QR Check-in", url: "/qr-checkin", icon: QrCode },
  ]

  const items = role === "admin" ? adminItems : role === "student" ? studentItems : organizerItems

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-sm">Campus Booking</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
