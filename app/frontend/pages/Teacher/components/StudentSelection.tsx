import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Student {
  id: string
  name: string
  currentJuz: number
  progress: number
  avatar: string
  class: string
}

interface StudentSelectionProps {
  students: Student[]
  selectedStudent: string
  setSelectedStudent: (value: string) => void
  currentStudent: Student | undefined
}

export function StudentSelection({ students, selectedStudent, setSelectedStudent, currentStudent }: StudentSelectionProps) {
  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardHeader>
        <CardTitle>Select Student</CardTitle>
        <CardDescription>Choose student for hifz session</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="border-gray-200/60 cursor-pointer">
            <SelectValue placeholder="Select student..." />
          </SelectTrigger>
          <SelectContent className="border-gray-200/60">
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id} className="cursor-pointer">
                <div className="flex gap-2 items-centerspace-x-2 sm:space-x-3">
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-sm sm:text-base">{student.name}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground ml-1 sm:ml-2">
                      {student.class} - Juz {student.currentJuz}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentStudent && (
          <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarImage src={currentStudent.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {currentStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm sm:text-base font-semibold">{currentStudent.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{currentStudent.class}</p>
                <Badge variant="secondary" className="text-xs">Juz {currentStudent.currentJuz}</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
