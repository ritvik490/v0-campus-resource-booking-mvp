"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useStore } from "@/lib/store"
import { Plus, Calendar, Flag as Flask, Trash2 } from "lucide-react"

export default function AdminDomainsPage() {
  const { currentUser, setCurrentUser, domains, addDomain, deleteDomain, resources } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDomain, setNewDomain] = useState({
    name: "",
    description: "",
    icon: "calendar",
  })

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ id: "admin1", name: "Admin User", role: "admin" })
    }
  }, [currentUser, setCurrentUser])

  const handleAddDomain = () => {
    if (newDomain.name && newDomain.description) {
      addDomain({
        id: newDomain.name.toLowerCase().replace(/\s+/g, "-"),
        name: newDomain.name,
        description: newDomain.description,
        icon: newDomain.icon,
      })
      setIsDialogOpen(false)
      setNewDomain({
        name: "",
        description: "",
        icon: "calendar",
      })
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons = {
      calendar: Calendar,
      flask: Flask,
    }
    return icons[iconName as keyof typeof icons] || Calendar
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Domain Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage resource domains</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Domain</DialogTitle>
                <DialogDescription>Create a new domain category for resources</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Domain Name</Label>
                  <Input
                    id="name"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                    placeholder="e.g., Sports Facilities"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDomain.description}
                    onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
                    placeholder="Brief description of the domain"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDomain}>Add Domain</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => {
            const Icon = getIconComponent(domain.icon)
            const domainResources = resources.filter((r) => r.domainId === domain.id)
            return (
              <Card key={domain.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{domain.name}</CardTitle>
                        <CardDescription className="mt-1">{domain.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteDomain(domain.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{domainResources.length} resources</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
