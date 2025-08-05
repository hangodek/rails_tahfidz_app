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
    <Card className="border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Ranking Siswa Terbaik
        </CardTitle>
        <CardDescription>5 siswa dengan hafalan terbanyak bulan ini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {students.map((student, index) => (
          <div key={student.name} className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {index + 1}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={student.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{student.name}</p>
                <Badge variant="secondary" className="text-xs">
                  Juz {student.currentJuz}
                </Badge>
              </div>
              <Progress value={student.progress} className="h-2" />
            </div>
            <Button variant="ghost" size="sm" className="border border-gray-200/60" onClick={() => router.visit(`/students/${student.id}`)}>
              <User className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
