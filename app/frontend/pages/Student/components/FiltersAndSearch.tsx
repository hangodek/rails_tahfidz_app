import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface FiltersAndSearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  classFilter: string
  setClassFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  juzFilter: string
  setJuzFilter: (value: string) => void
  viewMode: "grid" | "list"
  setViewMode: (value: "grid" | "list") => void
}

export function FiltersAndSearch({
  searchTerm,
  setSearchTerm,
  classFilter,
  setClassFilter,
  statusFilter,
  setStatusFilter,
  juzFilter,
  setJuzFilter,
  viewMode,
  setViewMode
}: FiltersAndSearchProps) {
  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filter & Search</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center flex-1">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200/60"
              />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:flex sm:gap-4">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="border-gray-200/60 cursor-pointer">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent className="border-gray-200/60">
                  <SelectItem className="cursor-pointer" value="all">All Classes</SelectItem>
                  <SelectItem className="cursor-pointer" value="Class A">Class A</SelectItem>
                  <SelectItem className="cursor-pointer" value="Class B">Class B</SelectItem>
                  <SelectItem className="cursor-pointer" value="Class C">Class C</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-200/60 cursor-pointer">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="border-gray-200/60">
                  <SelectItem className="cursor-pointer" value="all">All Status</SelectItem>
                  <SelectItem className="cursor-pointer" value="active">Active</SelectItem>
                  <SelectItem className="cursor-pointer" value="inactive">Inactive</SelectItem>
                  <SelectItem className="cursor-pointer" value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={juzFilter} onValueChange={setJuzFilter}>
                <SelectTrigger className="border-gray-200/60 cursor-pointer">
                  <SelectValue placeholder="All Juz" />
                </SelectTrigger>
                <SelectContent className="border-gray-200/60">
                  <SelectItem className="cursor-pointer" value="all">All Juz</SelectItem>
                  <SelectItem className="cursor-pointer" value="Juz 1-5">Juz 1-5</SelectItem>
                  <SelectItem className="cursor-pointer" value="Juz 6-10">Juz 6-10</SelectItem>
                  <SelectItem className="cursor-pointer" value="Juz 11-15">Juz 11-15</SelectItem>
                  <SelectItem className="cursor-pointer" value="Juz 16-20">Juz 16-20</SelectItem>
                  <SelectItem className="cursor-pointer" value="Juz 21-25">Juz 21-25</SelectItem>
                  <SelectItem className="cursor-pointer" value="Juz 26-30">Juz 26-30</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center sm:justify-end gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="border-gray-200/60 cursor-pointer flex-1 sm:flex-none"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                className="border-gray-200/60 cursor-pointer flex-1 sm:flex-none"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
