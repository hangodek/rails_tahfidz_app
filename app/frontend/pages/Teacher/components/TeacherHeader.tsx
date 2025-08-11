import { Button } from "@/components/ui/button"
import { ArrowLeft, Users } from "lucide-react"
import { router } from "@inertiajs/react"

export function TeacherHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Hifz Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor and analyze student Quran memorization progress</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/students")}>
          <Users className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">View All Students</span>
          <span className="sm:hidden">Students</span>
        </Button>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>
    </div>
  )
}
