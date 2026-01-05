"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, QrCode, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function QRCheckinPage() {
  const [qrCode, setQrCode] = useState("")
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "success" | "error" | "invalid-time">("idle")
  const [bookingInfo, setBookingInfo] = useState<any>(null)

  const handleCheckIn = () => {
    // Simulate QR code validation
    if (qrCode === "QR-ABC123" || qrCode === "QR-XYZ789") {
      setCheckInStatus("success")
      setBookingInfo({
        resourceName: "Computer Lab A",
        date: "2024-01-15",
        timeSlot: "09:00 AM - 11:00 AM",
        userName: "John Doe",
      })
    } else if (qrCode === "QR-EARLY") {
      setCheckInStatus("invalid-time")
    } else {
      setCheckInStatus("error")
    }
  }

  const resetForm = () => {
    setQrCode("")
    setCheckInStatus("idle")
    setBookingInfo(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">QR Check-In</CardTitle>
            <CardDescription>Scan or enter your booking QR code to check in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkInStatus === "idle" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="qrCode">QR Code</Label>
                  <Input
                    id="qrCode"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    placeholder="Enter QR code (e.g., QR-ABC123)"
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
                  <p className="font-semibold">Demo QR Codes:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <code>QR-ABC123</code> - Valid booking
                    </li>
                    <li>
                      <code>QR-XYZ789</code> - Valid booking
                    </li>
                    <li>
                      <code>QR-EARLY</code> - Too early to check in
                    </li>
                    <li>Any other code - Invalid</li>
                  </ul>
                </div>

                <Button onClick={handleCheckIn} className="w-full" size="lg" disabled={!qrCode}>
                  Check In
                </Button>
              </>
            )}

            {checkInStatus === "success" && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-500 mb-2">Check-In Successful!</h3>
                  <p className="text-muted-foreground mb-4">Welcome to {bookingInfo?.resourceName}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg text-left space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resource:</span>
                    <span className="font-medium">{bookingInfo?.resourceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{bookingInfo?.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{bookingInfo?.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User:</span>
                    <span className="font-medium">{bookingInfo?.userName}</span>
                  </div>
                </div>

                <Button onClick={resetForm} variant="outline" className="w-full bg-transparent">
                  Check In Another
                </Button>
              </div>
            )}

            {checkInStatus === "error" && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-500 mb-2">Invalid QR Code</h3>
                  <p className="text-muted-foreground">
                    This QR code is not valid or the booking does not exist. Please check and try again.
                  </p>
                </div>
                <Button onClick={resetForm} variant="outline" className="w-full bg-transparent">
                  Try Again
                </Button>
              </div>
            )}

            {checkInStatus === "invalid-time" && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-2">Too Early</h3>
                  <p className="text-muted-foreground">
                    You can only check in within 15 minutes of your booking start time.
                  </p>
                </div>
                <Button onClick={resetForm} variant="outline" className="w-full bg-transparent">
                  Try Again Later
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
