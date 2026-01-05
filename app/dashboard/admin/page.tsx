"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { Calendar, Building2, Clock, TrendingUp, ArrowRight } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { currentUser, setCurrentUser, resources, bookings } = useStore()

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ id: "admin1", name: "Admin User", role: "admin" })
    }
  }, [currentUser, setCurrentUser])

  const pendingCount = bookings.filter((b) => b.status === "pending").length
  const approvedCount = bookings.filter((b) => b.status === "approved").length
  const totalResources = resources.length

  // Calculate most used resource
  const resourceUsage = bookings.reduce(
    (acc, booking) => {
      acc[booking.resourceName] = (acc[booking.resourceName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const mostUsedResource = Object.entries(resourceUsage).sort((a, b) => b[1] - a[1])[0]

  const recentBookings = bookings.slice(0, 5)

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage resources and approve booking requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResources}</div>
              <p className="text-xs text-muted-foreground">Across all domains</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">{approvedCount} approved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mostUsedResource?.[1] || 0}</div>
              <p className="text-xs text-muted-foreground">{mostUsedResource?.[0] || "N/A"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/dashboard/admin/bookings")}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Manage Bookings
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>Review and approve booking requests</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/dashboard/admin/resources")}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Manage Resources
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>Create and edit campus resources</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/dashboard/admin/analytics")}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                View Analytics
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>See booking statistics and trends</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Booking Requests</CardTitle>
                <CardDescription>Latest booking requests from students and organizers</CardDescription>
              </div>
              <Button variant="outline" onClick={() => router.push("/dashboard/admin/bookings")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No bookings yet</p>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{booking.resourceName}</p>
                        <Badge
                          variant={
                            booking.status === "approved"
                              ? "default"
                              : booking.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {booking.userName} ({booking.userRole}) • {booking.date} • {booking.startTime} -{" "}
                        {booking.endTime}
                      </p>
                      {booking.purpose && <p className="text-sm mt-1 text-foreground">{booking.purpose}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
