"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore, type Booking } from "@/lib/store"
import { Check, X, Calendar, User, Clock } from "lucide-react"

export default function AdminBookingsPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, bookings, updateBookingStatus } = useStore()

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ id: "admin1", name: "Admin User", role: "admin" })
    }
  }, [currentUser, setCurrentUser])

  const handleApprove = (bookingId: string) => {
    updateBookingStatus(bookingId, "approved")
  }

  const handleReject = (bookingId: string) => {
    updateBookingStatus(bookingId, "rejected")
  }

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const approvedBookings = bookings.filter((b) => b.status === "approved")
  const rejectedBookings = bookings.filter((b) => b.status === "rejected")

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{booking.resourceName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <User className="w-3 h-3" />
              {booking.userName} ({booking.userRole})
            </CardDescription>
          </div>
          <Badge
            variant={
              booking.status === "approved" ? "default" : booking.status === "pending" ? "secondary" : "destructive"
            }
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </div>

        {booking.purpose && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Purpose</p>
            <p className="text-sm">{booking.purpose}</p>
          </div>
        )}

        {booking.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button onClick={() => handleApprove(booking.id)} className="flex-1" size="sm">
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button onClick={() => handleReject(booking.id)} variant="destructive" className="flex-1" size="sm">
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {booking.qrCode && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">QR Code</p>
            <code className="text-xs bg-muted px-2 py-1 rounded">{booking.qrCode}</code>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage all booking requests</p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending <Badge className="ml-2 bg-amber-500">{pendingBookings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedBookings.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">No pending bookings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {approvedBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">No approved bookings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {approvedBookings.map((booking) => (
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
              <div className="grid gap-4 md:grid-cols-2">
                {rejectedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
