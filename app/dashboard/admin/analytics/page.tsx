"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { BarChart3, TrendingUp, Calendar, Users } from "lucide-react"

export default function AdminAnalyticsPage() {
  const { currentUser, setCurrentUser, bookings, resources } = useStore()

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ id: "admin1", name: "Admin User", role: "admin" })
    }
  }, [currentUser, setCurrentUser])

  const totalBookings = bookings.length
  const approvedBookings = bookings.filter((b) => b.status === "approved").length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length

  // Resource usage
  const resourceUsage = bookings.reduce(
    (acc, booking) => {
      acc[booking.resourceName] = (acc[booking.resourceName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const sortedResources = Object.entries(resourceUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Domain statistics
  const domainStats = resources.reduce(
    (acc, resource) => {
      acc[resource.domainId] = (acc[resource.domainId] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Peak booking times
  const timeSlotUsage = bookings.reduce(
    (acc, booking) => {
      acc[booking.startTime] = (acc[booking.startTime] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const peakTime = Object.entries(timeSlotUsage).sort((a, b) => b[1] - a[1])[0]

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">View booking statistics and usage trends</p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedBookings}</div>
              <p className="text-xs text-muted-foreground">
                {totalBookings > 0 ? Math.round((approvedBookings / totalBookings) * 100) : 0}% approval rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
              <p className="text-xs text-muted-foreground">
                {domainStats.labs || 0} labs, {domainStats.events || 0} event spaces
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Most Booked Resources</CardTitle>
            <CardDescription>Top 5 resources by booking count</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedResources.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No booking data yet</p>
            ) : (
              <div className="space-y-4">
                {sortedResources.map(([name, count]) => {
                  const percentage = (count / totalBookings) * 100
                  return (
                    <div key={name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{name}</span>
                        <span className="text-muted-foreground">{count} bookings</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Peak Booking Time */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Booking Time</CardTitle>
            <CardDescription>Most popular time slot for bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {peakTime ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{peakTime[0]}</p>
                  <p className="text-sm text-muted-foreground">{peakTime[1]} bookings at this time</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No booking data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
