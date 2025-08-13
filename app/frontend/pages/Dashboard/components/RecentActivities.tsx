import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Clock,
  Target,
  Star,
} from "lucide-react"

interface RecentActivity {
  student: string
  activity: string
  time: string
  type: string
}

interface RecentActivitiesProps {
  activities: RecentActivity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activities
        </CardTitle>
        <CardDescription>Student memorization activities in the last few hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-white text-xs flex-shrink-0 ${
                activity.type === "memorization"
                  ? "bg-blue-500"
                  : activity.type === "revision"
                    ? "bg-green-500"
                    : "bg-gray-500"
              }`}
            >
              {activity.type === "memorization" ? (
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : activity.type === "revision" ? (
                <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{activity.student}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{activity.activity}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
