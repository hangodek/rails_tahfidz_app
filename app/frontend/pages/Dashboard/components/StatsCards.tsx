import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, BookOpen, Star } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Submissions</CardTitle>
          <CalendarIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            67 <span className="text-lg font-normal text-blue-500">Submissions</span>
          </div>
          <p className="text-xs text-muted-foreground">Student activities recorded by teachers</p>
        </CardContent>
      </Card>

      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students Doing Murajaah Today</CardTitle>
          <BookOpen className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            23<span className="text-lg font-normal text-green-500"> / 30</span>
          </div>
          <p className="text-xs text-muted-foreground">Active students practicing review</p>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students Memorizing Today</CardTitle>
          <BookOpen className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            18<span className="text-lg font-normal text-orange-500"> / 30</span>
          </div>
          <p className="text-xs text-muted-foreground">Active students learning new verses</p>
        </CardContent>
      </Card>
    </div>
    
  )
}
