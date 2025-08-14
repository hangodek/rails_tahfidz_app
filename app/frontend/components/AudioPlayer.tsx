import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Download, Volume2 } from "lucide-react"

interface AudioPlayerProps {
  audioUrl: string
  fileName?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function AudioPlayer({ audioUrl, fileName = "recording.webm", className = "", size = "md" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const downloadAudio = () => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sizeClasses = {
    sm: "text-xs p-1",
    md: "text-sm p-2",
    lg: "text-base p-3"
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  const buttonSizes = {
    sm: "sm" as const,
    md: "default" as const,
    lg: "lg" as const
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />
      
      <Badge variant="secondary" className="flex items-center gap-1 cursor-default">
        <Volume2 className={iconSizes[size]} />
        <span className="text-xs">Audio</span>
      </Badge>

      <Button
        onClick={togglePlay}
        variant="outline"
        size={buttonSizes[size]}
        className={`cursor-pointer ${sizeClasses[size]}`}
      >
        {isPlaying ? (
          <Pause className={iconSizes[size]} />
        ) : (
          <Play className={iconSizes[size]} />
        )}
      </Button>

      {duration > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}

      <Button
        onClick={downloadAudio}
        variant="ghost"
        size={buttonSizes[size]}
        className={`cursor-pointer text-muted-foreground hover:text-foreground ${sizeClasses[size]}`}
        title="Download audio"
      >
        <Download className={iconSizes[size]} />
      </Button>
    </div>
  )
}
