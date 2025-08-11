import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Plus, Mic } from "lucide-react"
import { router } from "@inertiajs/react"

export function StudentHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Student List</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage and monitor Quran memorization student data</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="border-gray-200/60 cursor-pointer md:w-full" onClick={() => router.visit("/teachers")}>
          <Mic className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Teacher Mode</span>
          <span className="sm:hidden">Teacher</span>
        </Button>
        <Button
          variant="outline" 
          className="border-gray-200/60 cursor-pointer md:w-full"
          onClick={() => router.visit("/students/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Add Student</span>
          <span className="sm:hidden">Add</span>
        </Button>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer md:w-full">
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Export Data</span>
          <span className="sm:hidden">Export</span>
        </Button>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer md:w-full" onClick={() => router.visit("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>
    </div>
  )
}
