"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, ArrowRight } from "lucide-react"

export default function StudentDashboard() {
  const router = useRouter()
  const { currentUser, setCurrentUser, bookings } = useStore()

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ id: "student1", name: "Alex Morgan", role: "student" })
    }
  }, [currentUser, setCurrentUser])

  const userBookings = bookings.filter((b) => b.userId === currentUser?.id)
  const approvedBookings = userBookings.filter((b) => b.status === "approved")
  const pendingBookings = userBookings.filter((b) => b.status === "pending")
  const upcomingBooking = approvedBookings[0]

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {currentUser?.name}!</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedBookings.length}</div>
              <p className="text-xs text-muted-foreground">Approved bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBookings.length}</div>
              <p className="text-xs text-muted-foreground">All bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/dashboard/student/domains")}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Browse Labs
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>Find and book available lab spaces</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push("/dashboard/student/bookings")}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                My Bookings
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>View and manage your bookings</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/qr-checkin")}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                QR Check-in
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
              <CardDescription>Check in to your booking</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Upcoming Booking */}
        {upcomingBooking && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Booking
              </CardTitle>
              <CardDescription>Your next approved booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{upcomingBooking.resourceName}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {upcomingBooking.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {upcomingBooking.startTime} - {upcomingBooking.endTime}
                  </div>
                </div>
              </div>
              {upcomingBooking.qrCode && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">QR Code for Check-in</p>
                  <code className="text-sm font-mono">{upcomingBooking.qrCode}</code>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest booking requests</CardDescription>
              </div>
              {userBookings.length > 0 && (
                <Button variant="outline" onClick={() => router.push("/dashboard/student/bookings")}>
                  View All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {userBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No bookings yet. Start by browsing labs!</p>
                <Button onClick={() => router.push("/dashboard/student/domains")}>Browse Labs</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{booking.resourceName}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} • {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <Badge
                      variant={
                        booking.status === "approved"
                          ? "default"
                          : booking.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {booking.status === "approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {booking.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {booking.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
