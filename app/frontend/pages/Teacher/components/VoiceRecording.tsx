import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  Play,
  Pause,
  Square,
  Download,
  Database,
  CheckCircle,
} from "lucide-react"

interface VoiceRecordingProps {
  selectedStudent: string
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  audioUrl: string
  isPlaying: boolean
  isSaved: boolean
  startRecording: () => void
  pauseRecording: () => void
  stopRecording: () => void
  playAudio: () => void
  downloadAudio: () => void
  formatTime: (seconds: number) => string
}

export function VoiceRecording({
  selectedStudent,
  isRecording,
  isPaused,
  recordingTime,
  audioUrl,
  isPlaying,
  isSaved,
  startRecording,
  pauseRecording,
  stopRecording,
  playAudio,
  downloadAudio,
  formatTime,
}: VoiceRecordingProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Recording
          {isSaved && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
        <CardDescription>Record student voice during memorization session {isSaved && "- Saved to database"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-3 sm:space-x-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={!selectedStudent}
              size="lg"
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-sm sm:text-base"
            >
              <Mic className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden sm:inline">Start Recording</span>
              <span className="sm:hidden">Record</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={pauseRecording} variant="outline" size="lg" className="cursor-pointer border-gray-200/60">
                {isPaused ? <Play className="h-4 w-4 sm:h-5 sm:w-5" /> : <Pause className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <Button onClick={stopRecording} variant="outline" size="lg" className="cursor-pointer border-gray-200/60">
                <Square className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          )}
        </div>

        {isRecording && (
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-mono font-bold text-red-500">{formatTime(recordingTime)}</div>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-muted-foreground">{isPaused ? "Paused" : "Recording..."}</span>
            </div>
          </div>
        )}

        {audioUrl && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button onClick={playAudio} variant="outline" className="cursor-pointer border-gray-200/60">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground">Duration: {formatTime(recordingTime)}</span>
              <Button onClick={downloadAudio} variant="outline" size="sm" className="cursor-pointer border-gray-200/60">
                <Download className="h-4 w-4" />
              </Button>
              {!isSaved && (
                <Badge variant="outline" className="text-orange-600">
                  <Database className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Not Saved</span>
                  <span className="sm:hidden">Unsaved</span>
                </Badge>
              )}
            </div>
            <audio ref={audioRef} src={audioUrl} onEnded={() => {}} className="hidden" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
