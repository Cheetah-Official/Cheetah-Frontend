"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard?tab=notifications")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Redirecting to notifications…</div>
    </div>
  )
}