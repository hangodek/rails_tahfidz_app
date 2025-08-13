import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, BookOpen } from "lucide-react"

interface DashboardStats {
  today_submissions: number
  students_revising_today: number
  students_memorizing_today: number
  total_active_students: number
}

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Card className="border-gray-200/60 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Submissions</CardTitle>
          <CalendarIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.today_submissions} <span className="text-lg font-normal text-blue-500">Submissions</span>
          </div>
          <p className="text-xs text-muted-foreground">Student activities recorded by teachers</p>
        </CardContent>
      </Card>

      <Card className="border-gray-200/60 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students Doing Revision Today</CardTitle>
          <BookOpen className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.students_revising_today}<span className="text-lg font-normal text-green-500"> / {stats.total_active_students}</span>
          </div>
          <p className="text-xs text-muted-foreground">Active students practicing review</p>
        </CardContent>
      </Card>
      
      <Card className="border-gray-200/60 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students Memorizing Today</CardTitle>
          <BookOpen className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {stats.students_memorizing_today}<span className="text-lg font-normal text-orange-500"> / {stats.total_active_students}</span>
          </div>
          <p className="text-xs text-muted-foreground">Active students learning new verses</p>
        </CardContent>
      </Card>
    </div>
    
  )
}
