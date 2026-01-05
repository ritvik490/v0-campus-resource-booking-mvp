"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, BookOpen, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { mockBookings, mockResources } from "@/lib/mock-data"

export default function OrganizerDashboard() {
  const organizerBookings = mockBookings.filter((b) => b.userRole === "organizer")
  const approvedBookings = organizerBookings.filter((b) => b.status === "approved")
  const pendingBookings = organizerBookings.filter((b) => b.status === "pending")
  const eventSpaces = mockResources.filter((r) => r.domain === "Event Spaces")

  const stats = [
    {
      title: "Total Bookings",
      value: organizerBookings.length,
      icon: BookOpen,
      description: "All event requests",
    },
    {
      title: "Approved Events",
      value: approvedBookings.length,
      icon: CheckCircle2,
      description: "Confirmed bookings",
    },
    {
      title: "Pending Approval",
      value: pendingBookings.length,
      icon: Clock,
      description: "Awaiting review",
    },
    {
      title: "Available Venues",
      value: eventSpaces.length,
      icon: Calendar,
      description: "Event spaces",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="organizer" />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Event Organizer Dashboard</h1>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your events and bookings</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Button asChild size="lg" className="h-auto flex-col items-start p-6">
                  <Link href="/dashboard/organizer/domains">
                    <Calendar className="w-6 h-6 mb-2" />
                    <div className="text-left">
                      <div className="font-semibold">Browse Venues</div>
                      <div className="text-xs font-normal opacity-90">Find and book event spaces</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-auto flex-col items-start p-6 bg-transparent">
                  <Link href="/dashboard/organizer/bookings">
                    <BookOpen className="w-6 h-6 mb-2" />
                    <div className="text-left">
                      <div className="font-semibold">My Bookings</div>
                      <div className="text-xs font-normal opacity-70">View booking status</div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Event Requests</CardTitle>
                <CardDescription>Your latest venue booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                {organizerBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No bookings yet. Start by browsing venues!</p>
                ) : (
                  <div className="space-y-3">
                    {organizerBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.resourceName}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.date} at {booking.timeSlot}
                          </p>
                          {booking.eventName && (
                            <p className="text-xs text-muted-foreground mt-1">Event: {booking.eventName}</p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "approved"
                              ? "bg-green-500/10 text-green-500"
                              : booking.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
