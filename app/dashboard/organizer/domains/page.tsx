"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockResources } from "@/lib/mock-data"
import { Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function OrganizerDomainsPage() {
  const eventSpaces = mockResources.filter((r) => r.domain === "Event Spaces")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="organizer" />
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Event Spaces</h1>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Browse Event Venues</h2>
              <p className="text-muted-foreground">Select a venue to view availability and book for your event</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eventSpaces.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{resource.name}</CardTitle>
                    <CardDescription>{resource.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Capacity: {resource.capacity} people</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Approver</p>
                      <p className="text-sm font-medium">{resource.approver}</p>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/organizer/resource/${resource.id}`}>
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
