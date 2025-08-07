import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  CalendarIcon,
  Award,
  Clock,
  Target,
  Star,
} from "lucide-react"

const globalRecentActivities = [
  { student: "Ahmad Fauzi", activity: "Completed Al-Baqarah verses 1-10", time: "2 hours ago", type: "hafalan" },
  { student: "Fatimah Zahra", activity: "Review Ali Imran verses 50-75", time: "3 hours ago", type: "muroja" },
  { student: "Muhammad Rizki", activity: "New submission An-Nisa verses 1-5", time: "4 hours ago", type: "setoran" },
  { student: "Aisyah Putri", activity: "Completed Juz 12", time: "5 hours ago", type: "completion" },
]

export function RecentActivities() {
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
        {globalRecentActivities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-white text-xs flex-shrink-0 ${
                activity.type === "hafalan"
                  ? "bg-blue-500"
                  : activity.type === "muroja"
                    ? "bg-green-500"
                    : activity.type === "setoran"
                      ? "bg-orange-500"
                      : activity.type === "completion"
                        ? "bg-purple-500"
                        : "bg-gray-500"
              }`}
            >
              {activity.type === "hafalan" ? (
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : activity.type === "muroja" ? (
                <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : activity.type === "setoran" ? (
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : activity.type === "completion" ? (
                <Award className="h-3 w-3 sm:h-4 sm:w-4" />
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
