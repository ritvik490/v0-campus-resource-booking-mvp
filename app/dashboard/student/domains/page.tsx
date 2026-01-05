"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { Monitor, Cpu, Zap, Users } from "lucide-react"

export default function StudentDomainsPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, resources, domains } = useStore()

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ id: "student1", name: "Alex Morgan", role: "student" })
    }
  }, [currentUser, setCurrentUser])

  const labDomain = domains.find((d) => d.id === "labs")
  const labResources = resources.filter((r) => r.domainId === "labs")

  const getResourceIcon = (name: string) => {
    if (name.toLowerCase().includes("computer")) return Monitor
    if (name.toLowerCase().includes("iot")) return Cpu
    if (name.toLowerCase().includes("electronics")) return Zap
    return Monitor
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{labDomain?.name || "Labs"} Domain</h1>
          <p className="text-muted-foreground mt-1">
            {labDomain?.description || "Browse and book available lab spaces"}
          </p>
        </div>

        {labResources.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">No labs available at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {labResources.map((resource) => {
              const Icon = getResourceIcon(resource.name)
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle>{resource.name}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Capacity: {resource.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Approver</p>
                        <p className="text-sm font-medium">{resource.approver}</p>
                      </div>
                      <Button onClick={() => router.push(`/dashboard/student/resource/${resource.id}`)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
