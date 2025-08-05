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

type DashboardProps = {}

export default function DashboardIndex({}: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col space-y-6 p-6">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards */}
        <StatsCards />

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Pages Chart with Date Range */}
          <DailySubmissionsChart />

          {/* Juz Distribution */}
          <JuzDistributionChart />
        </div>

        {/* Progress Chart */}
        <ProgressChart />

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Students Ranking */}
          <TopStudentsRanking />

          {/* Recent Activities */}
          <RecentActivities />
        </div>
      </div>
    </div>
  )
}
