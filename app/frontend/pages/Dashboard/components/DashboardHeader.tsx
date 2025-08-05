import { Button } from "@/components/ui/button"
import { Users, Mic, Shield, LogOut } from "lucide-react"
import { router } from "@inertiajs/react"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tahfidz Dashboard</h1>
        <p className="text-muted-foreground">Monitor and analyze student Quran memorization progress</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/students")}>
          <Users className="h-4 w-4 mr-2" />
          View All Students
        </Button>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/teacher")}>
          <Mic className="h-4 w-4 mr-2" />
          Teacher Mode
        </Button>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/admin")}>
          <Shield className="h-4 w-4 mr-2" />
          Admin Panel
        </Button>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.delete("/session")}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
