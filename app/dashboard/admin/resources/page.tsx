"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Users, Trash2 } from "lucide-react"

export default function AdminResourcesPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, resources, domains, addResource, deleteResource } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newResource, setNewResource] = useState({
    domainId: "labs",
    name: "",
    capacity: 0,
    approver: "",
    description: "",
  })

  useEffect(() => {
    if (!currentUser) {
      setCurrentUser({ id: "admin1", name: "Admin User", role: "admin" })
    }
  }, [currentUser, setCurrentUser])

  const handleAddResource = () => {
    if (newResource.name && newResource.capacity && newResource.approver) {
      addResource({
        id: `res-${Date.now()}`,
        name: newResource.name,
        domainId: newResource.domainId,
        capacity: newResource.capacity,
        approver: newResource.approver,
        description: newResource.description,
      })
      setIsDialogOpen(false)
      setNewResource({
        domainId: "labs",
        name: "",
        capacity: 0,
        approver: "",
        description: "",
      })
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Resource Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage campus resources</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>Create a new resource for students and organizers to book</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select
                    value={newResource.domainId}
                    onValueChange={(value) => setNewResource({ ...newResource, domainId: value })}
                  >
                    <SelectTrigger id="domain">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    placeholder="e.g., Computer Lab B"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newResource.capacity || ""}
                    onChange={(e) => setNewResource({ ...newResource, capacity: Number.parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approver">Approver (Faculty/Admin)</Label>
                  <Input
                    id="approver"
                    value={newResource.approver}
                    onChange={(e) => setNewResource({ ...newResource, approver: e.target.value })}
                    placeholder="e.g., Dr. John Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    placeholder="Brief description of the resource"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddResource}>Add Resource</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {domains.map((domain) => {
          const domainResources = resources.filter((r) => r.domainId === domain.id)
          return (
            <div key={domain.id}>
              <h2 className="text-2xl font-semibold mb-4">{domain.name} Domain</h2>
              {domainResources.length === 0 ? (
                <Card>
                  <CardContent className="py-12">
                    <p className="text-center text-muted-foreground">No resources in this domain yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {domainResources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{resource.name}</CardTitle>
                            <CardDescription className="mt-1">{domain.name}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>Capacity: {resource.capacity}</span>
                        </div>
                        <p className="text-sm">{resource.description}</p>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">Approver</p>
                          <p className="text-sm font-medium">{resource.approver}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
