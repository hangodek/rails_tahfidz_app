import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Plus, Mic, FileText, FileSpreadsheet, ChevronDown } from "lucide-react"
import { router } from "@inertiajs/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Student {
  id: string
  name: string
  current_hifz_in_juz: string
  current_hifz_in_pages: string
  avatar?: string
  class_level: string
  phone?: string
  email?: string
  status: string
  gender: string
  birth_place: string
  birth_date: string
  address?: string
  father_name: string
  mother_name: string
  father_phone?: string
  mother_phone?: string
  date_joined: string
  created_at: string
  updated_at: string
}

interface StudentHeaderProps {
  students?: Student[]
  filteredStudents?: Student[]
}

export function StudentHeader({ students = [], filteredStudents }: StudentHeaderProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      const { exportStudentsToPDF } = await import('@/utils/exportUtils')
      exportStudentsToPDF(students, filteredStudents)
    } catch (error) {
      console.error('Failed to export PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      const { exportStudentsToCSV } = await import('@/utils/exportUtils')
      exportStudentsToCSV(students, filteredStudents)
    } catch (error) {
      console.error('Failed to export CSV:', error)
    } finally {
      setIsExporting(false)
    }
  }

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-gray-200/60 cursor-pointer md:w-full" disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export Data'}</span>
              <span className="sm:hidden">{isExporting ? '...' : 'Export'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-gray-200/60">
            <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer" disabled={isExporting}>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer" disabled={isExporting}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="border-gray-200/60 cursor-pointer md:w-full" onClick={() => router.visit("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>
    </div>
  )
}
