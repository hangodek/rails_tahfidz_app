import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Award, User } from "lucide-react"
import { router } from "@inertiajs/react"

// Sample students data (would come from Rails props)
const students = [
  { id: "1", name: "Ahmad Fauzi", currentJuz: 15, progress: 85, avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Fatimah Zahra", currentJuz: 14, progress: 82, avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Muhammad Rizki", currentJuz: 13, progress: 78, avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Aisyah Putri", currentJuz: 12, progress: 75, avatar: "/placeholder.svg?height=32&width=32" },
  { id: "5", name: "Abdullah Malik", currentJuz: 11, progress: 70, avatar: "/placeholder.svg?height=32&width=32" },
]

export function TopStudentsRanking() {
  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Top Students Ranking
        </CardTitle>
        <CardDescription>Top 5 students with most memorization this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {students.map((student, index) => (
          <div key={student.name} className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-xs sm:text-sm font-bold text-primary">
                {index + 1}
              </div>
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarImage src={student.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium truncate pr-2">{student.name}</p>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  Juz {student.currentJuz}
                </Badge>
              </div>
              <Progress value={student.progress} className="h-1.5 sm:h-2" />
            </div>
            <Button variant="ghost" size="sm" className="border border-gray-200/60 cursor-pointer h-8 w-8 p-0 flex-shrink-0" onClick={() => router.visit(`/students/${student.id}`)}>
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
