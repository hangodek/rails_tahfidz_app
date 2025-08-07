import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Student {
  id: string
  name: string
  currentJuz: number
  progress: number
  avatar: string
  class: string
}

interface ActivityType {
  value: string
  label: string
  icon: any
  color: string
}

interface RecentActivitiesProps {
  currentStudent: Student | undefined
  activityTypes: ActivityType[]
}

export function RecentActivities({ currentStudent, activityTypes }: RecentActivitiesProps) {
  if (!currentStudent) {
    return null
  }

  const recentActivities = [
    { type: "setoran_baru", activity: "New Submission Al-Baqarah 1-10", time: "2 hours ago" },
    { type: "muroja", activity: "Murajaah Ali Imran 50-75", time: "1 day ago" },
    { type: "menyelesaikan_juz", activity: "Completed Juz 14", time: "3 days ago" },
  ]

  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>{currentStudent.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivities.map((activity, index) => {
          const activityType = activityTypes.find((t) => t.value === activity.type)
          return (
            <div key={index} className="flex items-start space-x-2 sm:space-x-3">
              <div
                className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-white text-xs ${activityType?.color}`}
              >
                {activityType && <activityType.icon className="h-3 w-3 sm:h-4 sm:w-4" />}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">{activity.activity}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
