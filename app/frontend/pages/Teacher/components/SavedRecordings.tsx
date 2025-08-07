import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Database } from "lucide-react"

interface SavedRecording {
  studentName: string
  activityType: string
  duration: number
  date: string
}

interface SavedRecordingsProps {
  savedRecordings: SavedRecording[]
  formatTime: (seconds: number) => string
}

export function SavedRecordings({ savedRecordings, formatTime }: SavedRecordingsProps) {
  if (savedRecordings.length === 0) {
    return null
  }

  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Saved Recordings
        </CardTitle>
        <CardDescription>Latest 5 saved recordings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {savedRecordings.map((recording, index) => (
          <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  {recording.studentName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">{recording.studentName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {recording.activityType} - {formatTime(recording.duration)}
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground flex-shrink-0">{recording.date}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
