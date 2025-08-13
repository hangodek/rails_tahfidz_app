"use client"
import {
  DashboardHeader,
  StatsCards,
  DailySubmissionsChart,
  JuzDistributionChart,
  ProgressChart,
  TopStudentsRanking,
  RecentActivities,
} from "./components"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface DashboardStats {
  today_submissions: number
  students_revising_today: number
  students_memorizing_today: number
  total_active_students: number
}

interface TopStudent {
  id: string
  name: string
  current_juz: string
  activity_count: number
  progress: number
  avatar?: string
}

interface RecentActivity {
  student: string
  activity: string
  time: string
  type: string
}

interface DailySubmission {
  date: string
  submissions: number
}

interface JuzDistribution {
  juz: string
  students: number
}

interface DashboardProps {
  user: any
  stats: DashboardStats
  top_students: TopStudent[]
  recent_activities: RecentActivity[]
  daily_submissions: DailySubmission[]
  juz_distribution: JuzDistribution[]
}

export default function DashboardIndex({ 
  stats, 
  top_students, 
  recent_activities, 
  daily_submissions, 
  juz_distribution 
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Mobile Chart Notice */}
        <div className="md:hidden">
          <Card className="border-blue-200/60 bg-blue-50/30 shadow-md">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Charts Available on Larger Screens</p>
                  <p className="text-xs text-blue-600">View detailed analytics and progress charts on tablet or desktop</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:flex md:flex-col lg:grid gap-6 lg:grid-cols-3">
          {/* Daily Pages Chart with Date Range */}
          <DailySubmissionsChart data={daily_submissions} />

          {/* Juz Distribution */}
          <JuzDistributionChart data={juz_distribution} />
        </div>

        {/* Progress Chart - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:block">
          <ProgressChart />
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Top Students Ranking */}
          <TopStudentsRanking students={top_students} />

          {/* Recent Activities */}
          <RecentActivities activities={recent_activities} />
        </div>
      </div>
    </div>
  )
}
