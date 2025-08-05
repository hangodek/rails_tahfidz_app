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
  { student: "Ahmad Fauzi", activity: "Menyelesaikan Al-Baqarah ayat 1-10", time: "2 jam lalu", type: "hafalan" },
  { student: "Fatimah Zahra", activity: "Muroja'ah Ali Imran ayat 50-75", time: "3 jam lalu", type: "muroja" },
  { student: "Muhammad Rizki", activity: "Setoran baru An-Nisa ayat 1-5", time: "4 jam lalu", type: "setoran" },
  { student: "Aisyah Putri", activity: "Menyelesaikan Juz 12", time: "5 jam lalu", type: "completion" },
]

export function RecentActivities() {
  return (
    <Card className="border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Aktivitas Terbaru
        </CardTitle>
        <CardDescription>Aktivitas hafalan siswa dalam beberapa jam terakhir</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {globalRecentActivities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs ${
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
                <BookOpen className="h-4 w-4" />
              ) : activity.type === "muroja" ? (
                <Star className="h-4 w-4" />
              ) : activity.type === "setoran" ? (
                <CalendarIcon className="h-4 w-4" />
              ) : activity.type === "completion" ? (
                <Award className="h-4 w-4" />
              ) : (
                <Target className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.student}</p>
              <p className="text-xs text-muted-foreground">{activity.activity}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
