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

type DashboardProps = {}

export default function DashboardIndex({}: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards */}
        <StatsCards />

        {/* Mobile Chart Notice */}
        <div className="md:hidden">
          <Card className="border-blue-200/60 bg-blue-50/30">
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
        <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Pages Chart with Date Range */}
          <DailySubmissionsChart />

          {/* Juz Distribution */}
          <JuzDistributionChart />
        </div>

        {/* Progress Chart - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:block">
          <ProgressChart />
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Top Students Ranking */}
          <TopStudentsRanking />

          {/* Recent Activities */}
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}
