"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Building2, Users } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  const roles = [
    {
      id: "admin",
      title: "Admin",
      description: "Manage resources and approve bookings",
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      id: "student",
      title: "Student",
      description: "Book labs and view availability",
      icon: Users,
      color: "bg-teal-500",
    },
    {
      id: "organizer",
      title: "Organizer",
      description: "Request event spaces and manage bookings",
      icon: Calendar,
      color: "bg-amber-500",
    },
  ]

  const handleRoleSelect = (roleId: string) => {
    router.push(`/dashboard/${roleId}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Campus Resource Booking System</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Streamline your campus resource management. Book labs, classrooms, and event spaces with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Card key={role.id} className="relative overflow-hidden transition-all hover:shadow-lg">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleRoleSelect(role.id)} className="w-full" size="lg">
                    Continue as {role.title}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Hackathon MVP Demo • All data is simulated for evaluation purposes</p>
        </div>
      </div>
    </div>
  )
}
