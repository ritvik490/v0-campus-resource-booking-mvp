export type Resource = {
  id: string
  name: string
  domain: "events" | "labs"
  type: string
  capacity: number
  approver: string
  description: string
}

export type Booking = {
  id: string
  resourceId: string
  resourceName: string
  userId: string
  userName: string
  userRole: "student" | "organizer"
  date: string
  timeSlot: string
  status: "pending" | "approved" | "rejected"
  purpose?: string
  qrCode?: string
}

export const mockResources: Resource[] = [
  {
    id: "r1",
    name: "Main Auditorium",
    domain: "events",
    type: "Auditorium",
    capacity: 500,
    approver: "Dr. Sarah Johnson",
    description: "Large auditorium with stage and audio-visual equipment",
  },
  {
    id: "r2",
    name: "Room 101",
    domain: "events",
    type: "Classroom",
    capacity: 50,
    approver: "Prof. Michael Chen",
    description: "Standard classroom with projector and whiteboard",
  },
  {
    id: "r3",
    name: "Central Ground",
    domain: "events",
    type: "Open Grounds",
    capacity: 1000,
    approver: "Dr. Emily Davis",
    description: "Open space for outdoor events and gatherings",
  },
  {
    id: "r4",
    name: "Computer Lab A",
    domain: "labs",
    type: "Computer Lab",
    capacity: 40,
    approver: "Dr. Robert Wilson",
    description: "Computer lab with 40 workstations and development tools",
  },
  {
    id: "r5",
    name: "IoT Innovation Lab",
    domain: "labs",
    type: "IoT Lab",
    capacity: 25,
    approver: "Prof. Lisa Anderson",
    description: "IoT lab with sensors, microcontrollers, and prototyping equipment",
  },
  {
    id: "r6",
    name: "Electronics Workshop",
    domain: "labs",
    type: "Electronics Lab",
    capacity: 30,
    approver: "Dr. James Martinez",
    description: "Electronics lab with oscilloscopes, soldering stations, and testing equipment",
  },
]

export const mockBookings: Booking[] = [
  {
    id: "b1",
    resourceId: "r4",
    resourceName: "Computer Lab A",
    userId: "u1",
    userName: "Alice Cooper",
    userRole: "student",
    date: "2026-01-10",
    timeSlot: "10:00 AM - 12:00 PM",
    status: "approved",
    purpose: "Programming practice",
    qrCode: "QR-B1-2026",
  },
  {
    id: "b2",
    resourceId: "r1",
    resourceName: "Main Auditorium",
    userId: "u2",
    userName: "Tech Club",
    userRole: "organizer",
    date: "2026-01-15",
    timeSlot: "2:00 PM - 5:00 PM",
    status: "pending",
    purpose: "Annual Tech Fest Opening Ceremony",
  },
  {
    id: "b3",
    resourceId: "r5",
    resourceName: "IoT Innovation Lab",
    userId: "u3",
    userName: "Bob Smith",
    userRole: "student",
    date: "2026-01-12",
    timeSlot: "3:00 PM - 5:00 PM",
    status: "approved",
    purpose: "IoT project development",
    qrCode: "QR-B3-2026",
  },
]

// Mock calendar data for availability
export const getAvailableSlots = (resourceId: string, date: string) => {
  const slots = ["9:00 AM - 11:00 AM", "11:00 AM - 1:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"]

  // Check if any bookings exist for this resource and date
  const bookedSlots = mockBookings
    .filter((b) => b.resourceId === resourceId && b.date === date && b.status !== "rejected")
    .map((b) => b.timeSlot)

  return slots.map((slot) => ({
    time: slot,
    available: !bookedSlots.includes(slot),
  }))
}
