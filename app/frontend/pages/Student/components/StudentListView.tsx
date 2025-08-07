import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { ReactElement } from "react"

interface Student {
  id: string
  name: string
  currentJuz: number
  progress: number
  avatar: string
  class: string
  status: string
  fatherName: string
  birthPlace: string
  birthDate: string
}

interface StudentListViewProps {
  filteredStudents: Student[]
  getStatusBadge: (status: string) => ReactElement
  handleSelectStudent: (studentId: string) => void
}

export function StudentListView({ filteredStudents, getStatusBadge, handleSelectStudent }: StudentListViewProps) {
  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200/60">
          {filteredStudents.map((student) => (
            <div key={student.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-2 flex-1">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium truncate">{student.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{student.class}</p>
                    <p className="text-xs text-muted-foreground truncate hidden sm:block">{student.fatherName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 sm:space-x-6">
                  <div className="text-center hidden sm:block w-16">
                    <div className="text-sm font-medium">Juz {student.currentJuz}</div>
                    <div className="text-xs text-muted-foreground">Current</div>
                  </div>
                  <div className="text-center w-16">
                    <div className="text-sm font-medium">{student.progress}%</div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                  <div className="text-center hidden md:block w-24">
                    <div className="text-xs font-medium">{student.birthPlace}</div>
                    <div className="text-xs text-muted-foreground">{student.birthDate}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(student.status)}
                    <Button size="sm" variant="outline" className="border-gray-200/60 cursor-pointer p-1 sm:p-2" onClick={() => handleSelectStudent(student.id)}>
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Mobile-only additional info */}
              <div className="mt-2 sm:hidden">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="w-16 text-left">Juz {student.currentJuz}</span>
                  <span className="w-24 text-right">{student.birthPlace}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
