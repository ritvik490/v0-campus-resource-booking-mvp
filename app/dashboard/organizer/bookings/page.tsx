"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockBookings } from "@/lib/mock-data"
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react"

export default function OrganizerBookingsPage() {
  const [bookings] = useState(mockBookings.filter((b) => b.userRole === "organizer"))

  const approvedBookings = bookings.filter((b) => b.status === "approved")
  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const rejectedBookings = bookings.filter((b) => b.status === "rejected")

  const BookingCard = ({ booking }: { booking: (typeof bookings)[0] }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{booking.resourceName}</CardTitle>
            {booking.eventName && <p className="text-sm font-medium mt-1">{booking.eventName}</p>}
            <CardDescription className="flex items-center gap-2 mt-1">
              <Calendar className="w-3 h-3" />
              {booking.date}
            </CardDescription>
          </div>
          <Badge
            variant={
              booking.status === "approved" ? "default" : booking.status === "pending" ? "secondary" : "destructive"
            }
          >
            {booking.status === "approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {booking.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
            {booking.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {booking.timeSlot}
        </div>

        {booking.purpose && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Event Description</p>
            <p className="text-sm">{booking.purpose}</p>
          </div>
        )}

        {booking.qrCode && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">QR Code for Check-in</p>
            <code className="text-xs bg-muted px-2 py-1 rounded block">{booking.qrCode}</code>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="organizer" />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">My Event Bookings</h1>
            </div>
          </header>

          <div className="p-6">
            <Tabs defaultValue="approved" className="w-full">
              <TabsList>
                <TabsTrigger value="approved">
                  Approved <Badge className="ml-2">{approvedBookings.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedBookings.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="approved" className="mt-6">
                {approvedBookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <p className="text-center text-muted-foreground">No approved bookings yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {approvedBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                {pendingBookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <p className="text-center text-muted-foreground">No pending bookings</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                {rejectedBookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <p className="text-center text-muted-foreground">No rejected bookings</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rejectedBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
