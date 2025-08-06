import { Button } from "@/components/ui/button"
import { Users, Mic, LogOut } from "lucide-react"
import { router } from "@inertiajs/react"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hidz Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor and analyze student Quran memorization progress</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4 sm:gap-0">
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/students")}>
          <Users className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">View All Students</span>
          <span className="sm:hidden">Students</span>
        </Button>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/teachers")}>
          <Mic className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Teacher Mode</span>
          <span className="sm:hidden">Teacher</span>
        </Button>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.delete("/session")}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
