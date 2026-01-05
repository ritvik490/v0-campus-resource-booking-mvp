"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { mockResources, getAvailableSlots } from "@/lib/mock-data"
import { Users, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function OrganizerResourcePage() {
  const params = useParams()
  const router = useRouter()
  const resourceId = params.id as string
  const resource = mockResources.find((r) => r.id === resourceId)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [expectedAttendees, setExpectedAttendees] = useState("")
  const [isBooked, setIsBooked] = useState(false)

  if (!resource) {
    return <div>Resource not found</div>
  }

  const availableSlots = selectedDate ? getAvailableSlots(resourceId, format(selectedDate, "yyyy-MM-dd")) : []

  const handleBooking = () => {
    if (selectedDate && selectedSlot && eventName) {
      setIsBooked(true)
      setTimeout(() => {
        router.push("/dashboard/organizer/bookings")
      }, 2000)
    }
  }

  if (isBooked) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar role="organizer" />
          <main className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Event Request Submitted!</h2>
                  <p className="text-muted-foreground">
                    Your event booking request has been submitted for approval. You will be notified once it's reviewed.
                  </p>
                </div>
                <Button onClick={() => router.push("/dashboard/organizer/bookings")} className="w-full">
                  View My Bookings
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="organizer" />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/organizer/domains">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">{resource.name}</h1>
            </div>
          </header>

          <div className="p-6 max-w-5xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Resource Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Venue Details</CardTitle>
                  <CardDescription>{resource.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{resource.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Capacity: {resource.capacity} people</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Approver</p>
                    <p className="text-sm font-medium">{resource.approver}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>Choose a date to view available time slots</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Available Time Slots</CardTitle>
                  <CardDescription>{format(selectedDate, "MMMM d, yyyy")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot.time}
                        onClick={() => slot.available && setSelectedSlot(slot.time)}
                        disabled={!slot.available}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          selectedSlot === slot.time
                            ? "border-primary bg-primary text-primary-foreground"
                            : slot.available
                              ? "hover:border-primary hover:bg-primary/5 cursor-pointer"
                              : "opacity-50 cursor-not-allowed bg-muted"
                        }`}
                      >
                        <p className="font-medium">{slot.time}</p>
                        <Badge variant={slot.available ? "default" : "secondary"} className="mt-2">
                          {slot.available ? "Available" : "Booked"}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Booking Form */}
            {selectedSlot && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>Provide information about your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventName">
                      Event Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="eventName"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g., Tech Talk Series, Workshop"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDescription">Event Description</Label>
                    <Textarea
                      id="eventDescription"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Brief description of your event"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attendees">Expected Number of Attendees</Label>
                    <Input
                      id="attendees"
                      type="number"
                      value={expectedAttendees}
                      onChange={(e) => setExpectedAttendees(e.target.value)}
                      placeholder="e.g., 50"
                      max={resource.capacity}
                    />
                    <p className="text-xs text-muted-foreground">Maximum capacity: {resource.capacity} people</p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-semibold">Booking Summary</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Venue:</span> {resource.name}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Date:</span>{" "}
                        {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Time:</span> {selectedSlot}
                      </p>
                      {eventName && (
                        <p>
                          <span className="text-muted-foreground">Event:</span> {eventName}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button onClick={handleBooking} className="w-full" size="lg" disabled={!eventName}>
                    Submit Event Request
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
