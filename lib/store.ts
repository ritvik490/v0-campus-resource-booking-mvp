"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type BookingStatus = "pending" | "approved" | "rejected"

export interface Resource {
  id: string
  name: string
  domainId: string
  description: string
  capacity?: number
  approver: string
}

export interface Domain {
  id: string
  name: string
  description: string
  icon: string
}

export interface Booking {
  id: string
  resourceId: string
  resourceName: string
  domainName: string
  userId: string
  userName: string
  userRole: "student" | "organizer"
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  purpose?: string
  qrCode?: string
}

interface StoreState {
  currentUser: { id: string; name: string; role: "admin" | "student" | "organizer" } | null
  domains: Domain[]
  resources: Resource[]
  bookings: Booking[]
  setCurrentUser: (user: { id: string; name: string; role: "admin" | "student" | "organizer" } | null) => void
  addDomain: (domain: Domain) => void
  updateDomain: (id: string, domain: Partial<Domain>) => void
  deleteDomain: (id: string) => void
  addResource: (resource: Resource) => void
  updateResource: (id: string, resource: Partial<Resource>) => void
  deleteResource: (id: string) => void
  addBooking: (booking: Booking) => void
  updateBookingStatus: (id: string, status: BookingStatus) => void
  deleteBooking: (id: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      currentUser: null,
      domains: [
        {
          id: "events",
          name: "Events",
          description: "Book venues for events, gatherings, and activities",
          icon: "calendar",
        },
        {
          id: "labs",
          name: "Labs",
          description: "Reserve laboratory spaces for projects and research",
          icon: "flask",
        },
      ],
      resources: [
        {
          id: "auditorium",
          name: "Main Auditorium",
          domainId: "events",
          description: "Large auditorium with 500 seating capacity",
          capacity: 500,
          approver: "Dr. Sarah Johnson",
        },
        {
          id: "classroom-a",
          name: "Classroom A",
          domainId: "events",
          description: "Standard classroom for 50 students",
          capacity: 50,
          approver: "Prof. Mike Davis",
        },
        {
          id: "open-grounds",
          name: "Open Grounds",
          domainId: "events",
          description: "Outdoor space for large gatherings",
          capacity: 1000,
          approver: "Admin Office",
        },
        {
          id: "computer-lab",
          name: "Computer Lab",
          domainId: "labs",
          description: "Lab with 40 computer workstations",
          capacity: 40,
          approver: "Dr. Alan Smith",
        },
        {
          id: "iot-lab",
          name: "IoT Lab",
          domainId: "labs",
          description: "IoT development and testing lab",
          capacity: 30,
          approver: "Dr. Emily Chen",
        },
        {
          id: "electronics-lab",
          name: "Electronics Lab",
          domainId: "labs",
          description: "Electronics and circuit design lab",
          capacity: 25,
          approver: "Prof. Robert Lee",
        },
      ],
      bookings: [
        {
          id: "b1",
          resourceId: "computer-lab",
          resourceName: "Computer Lab",
          domainName: "Labs",
          userId: "s1",
          userName: "Alex Morgan",
          userRole: "student",
          date: "2026-01-08",
          startTime: "10:00",
          endTime: "12:00",
          status: "approved",
          qrCode: "QR-b1-approved",
        },
        {
          id: "b2",
          resourceId: "auditorium",
          resourceName: "Main Auditorium",
          domainName: "Events",
          userId: "o1",
          userName: "Tech Club",
          userRole: "organizer",
          date: "2026-01-10",
          startTime: "14:00",
          endTime: "18:00",
          status: "pending",
          purpose: "Annual Tech Fest 2026",
        },
      ],
      setCurrentUser: (user) => set({ currentUser: user }),
      addDomain: (domain) => set((state) => ({ domains: [...state.domains, domain] })),
      updateDomain: (id, domain) =>
        set((state) => ({
          domains: state.domains.map((d) => (d.id === id ? { ...d, ...domain } : d)),
        })),
      deleteDomain: (id) => set((state) => ({ domains: state.domains.filter((d) => d.id !== id) })),
      addResource: (resource) => set((state) => ({ resources: [...state.resources, resource] })),
      updateResource: (id, resource) =>
        set((state) => ({
          resources: state.resources.map((r) => (r.id === id ? { ...r, ...resource } : r)),
        })),
      deleteResource: (id) => set((state) => ({ resources: state.resources.filter((r) => r.id !== id) })),
      addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status, qrCode: status === "approved" ? `QR-${id}-approved` : undefined } : b,
          ),
        })),
      deleteBooking: (id) => set((state) => ({ bookings: state.bookings.filter((b) => b.id !== id) })),
    }),
    {
      name: "campus-booking-storage",
    },
  ),
)
