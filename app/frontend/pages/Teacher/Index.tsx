"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mic,
  Play,
  Pause,
  Square,
  Save,
  ArrowLeft,
  Plus,
  BookOpen,
  Star,
  Calendar,
  Award,
  Volume2,
  Download,
  Database,
  CheckCircle,
  Users,
  Shield,
  LogOut
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { router } from "@inertiajs/react"

// Audio storage utility
class AudioStorage {
  private dbName = "TahfidzAudioDB"
  private version = 1
  private db: IDBDatabase | null = null

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("recordings")) {
          const store = db.createObjectStore("recordings", { keyPath: "id", autoIncrement: true })
          store.createIndex("studentId", "studentId", { unique: false })
          store.createIndex("date", "date", { unique: false })
        }
      }
    })
  }

  async saveRecording(recording: {
    studentId: string
    studentName: string
    activityType: string
    audioBlob: Blob
    duration: number
    date: string
    notes?: string
    evaluation?: string
  }) {
    if (!this.db) await this.init()

    return new Promise<number>((resolve, reject) => {
      const transaction = this.db!.transaction(["recordings"], "readwrite")
      const store = transaction.objectStore("recordings")

      const recordingData = {
        ...recording,
        audioData: recording.audioBlob,
        timestamp: new Date().toISOString(),
      }

      const request = store.add(recordingData)
      request.onsuccess = () => resolve(request.result as number)
      request.onerror = () => reject(request.error)
    })
  }

  async getRecordingsByStudent(studentId: string) {
    if (!this.db) await this.init()

    return new Promise<any[]>((resolve, reject) => {
      const transaction = this.db!.transaction(["recordings"], "readonly")
      const store = transaction.objectStore("recordings")
      const index = store.index("studentId")

      const request = index.getAll(studentId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllRecordings() {
    if (!this.db) await this.init()

    return new Promise<any[]>((resolve, reject) => {
      const transaction = this.db!.transaction(["recordings"], "readonly")
      const store = transaction.objectStore("recordings")

      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

// Sample students data (would come from Rails props)
const students = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    currentJuz: 15,
    progress: 85,
    avatar: "/placeholder.svg?height=32&width=32",
    class: "Kelas A",
  },
  {
    id: "2",
    name: "Fatimah Zahra",
    currentJuz: 14,
    progress: 82,
    avatar: "/placeholder.svg?height=32&width=32",
    class: "Kelas A",
  },
  {
    id: "3",
    name: "Muhammad Rizki",
    currentJuz: 13,
    progress: 78,
    avatar: "/placeholder.svg?height=32&width=32",
    class: "Kelas B",
  },
  {
    id: "4",
    name: "Aisyah Putri",
    currentJuz: 12,
    progress: 75,
    avatar: "/placeholder.svg?height=32&width=32",
    class: "Kelas A",
  },
  {
    id: "5",
    name: "Abdullah Malik",
    currentJuz: 11,
    progress: 70,
    avatar: "/placeholder.svg?height=32&width=32",
    class: "Kelas B",
  },
]

// Activity types
const activityTypes = [
  { value: "setoran_baru", label: "New Submission", icon: BookOpen, color: "bg-blue-500" },
  { value: "muroja", label: "Murajaah", icon: Star, color: "bg-green-500" },
  { value: "menyelesaikan_ayat", label: "Complete Verses", icon: Calendar, color: "bg-orange-500" },
  { value: "menyelesaikan_juz", label: "Complete Juz", icon: Award, color: "bg-purple-500" },
  { value: "evaluasi", label: "Evaluation", icon: Volume2, color: "bg-red-500" },
]

// Surah list for reference
const surahList = [
  "Al-Fatihah",
  "Al-Baqarah",
  "Ali Imran",
  "An-Nisa",
  "Al-Maidah",
  "Al-An'am",
  "Al-A'raf",
  "Al-Anfal",
  "At-Taubah",
  "Yunus",
  "Hud",
  "Yusuf",
  "Ar-Ra'd",
  "Ibrahim",
  "Al-Hijr",
  "An-Nahl",
  "Al-Isra",
  "Al-Kahf",
  "Maryam",
  "Ta-Ha",
  "Al-Anbiya",
  "Al-Hajj",
  "Al-Mu'minun",
  "An-Nur",
  "Al-Furqan",
  "Ash-Shu'ara",
  "An-Naml",
  "Al-Qasas",
  "Al-Ankabut",
  "Ar-Rum",
  "Luqman",
  "As-Sajdah",
  "Al-Ahzab",
  "Saba",
  "Fatir",
  "Ya-Sin",
  "As-Saffat",
  "Sad",
  "Az-Zumar",
  "Ghafir",
  "Fussilat",
  "Ash-Shura",
  "Az-Zukhruf",
  "Ad-Dukhan",
  "Al-Jathiyah",
  "Al-Ahqaf",
  "Muhammad",
  "Al-Fath",
  "Al-Hujurat",
  "Qaf",
  "Adh-Dhariyat",
  "At-Tur",
  "An-Najm",
  "Al-Qamar",
  "Ar-Rahman",
  "Al-Waqi'ah",
  "Al-Hadid",
  "Al-Mujadila",
  "Al-Hashr",
  "Al-Mumtahanah",
  "As-Saff",
  "Al-Jumu'ah",
  "Al-Munafiqun",
  "At-Taghabun",
  "At-Talaq",
  "At-Tahrim",
  "Al-Mulk",
  "Al-Qalam",
  "Al-Haqqah",
  "Al-Ma'arij",
  "Nuh",
  "Al-Jinn",
  "Al-Muzzammil",
  "Al-Muddaththir",
  "Al-Qiyamah",
  "Al-Insan",
  "Al-Mursalat",
  "An-Naba",
  "An-Nazi'at",
  "Abasa",
  "At-Takwir",
  "Al-Infitar",
  "Al-Mutaffifin",
  "Al-Inshiqaq",
  "Al-Buruj",
  "At-Tariq",
  "Al-A'la",
  "Al-Ghashiyah",
  "Al-Fajr",
  "Al-Balad",
  "Ash-Shams",
  "Al-Layl",
  "Ad-Duha",
  "Ash-Sharh",
  "At-Tin",
  "Al-Alaq",
  "Al-Qadr",
  "Al-Bayyinah",
  "Az-Zalzalah",
  "Al-Adiyat",
  "Al-Qari'ah",
  "At-Takathur",
  "Al-Asr",
  "Al-Humazah",
  "Al-Fil",
  "Quraysh",
  "Al-Ma'un",
  "Al-Kawthar",
  "Al-Kafirun",
  "An-Nasr",
  "Al-Masad",
  "Al-Ikhlas",
  "Al-Falaq",
  "An-Nas",
]

type TeacherIndexProps = {}

export default function TeacherIndex({}: TeacherIndexProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [activityType, setActivityType] = useState<string>("")
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [savedRecordings, setSavedRecordings] = useState<any[]>([])

  // Activity form fields
  const [activityDetails, setActivityDetails] = useState({
    surah: "",
    ayatFrom: "",
    ayatTo: "",
    juz: "",
    notes: "",
    evaluation: "",
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<number | null>(null)
  const audioStorage = useRef(new AudioStorage())

  const currentStudent = students.find((s) => s.id === selectedStudent)

  useEffect(() => {
    audioStorage.current.init()
    loadSavedRecordings()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const loadSavedRecordings = async () => {
    try {
      const recordings = await audioStorage.current.getAllRecordings()
      setSavedRecordings(recordings.slice(-5)) // Show last 5 recordings
    } catch (error) {
      console.error("Error loading recordings:", error)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setIsSaved(false)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      toast({
        title: "Recording Started",
        description: "Started recording student voice...",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Cannot access microphone. Please ensure microphone permission is granted.",
        variant: "destructive",
      })
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
      setIsPaused(!isPaused)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      toast({
        title: "Recording Completed",
        description: "Voice recording has been saved. Don't forget to save to database!",
      })
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSaveActivity = async () => {
    if (!selectedStudent || !activityType) {
      toast({
        title: "Error",
        description: "Please select student and activity type first.",
        variant: "destructive",
      })
      return
    }

    try {
      // Save recording to IndexedDB if exists
      if (audioBlob && currentStudent) {
        await audioStorage.current.saveRecording({
          studentId: selectedStudent,
          studentName: currentStudent.name,
          activityType,
          audioBlob,
          duration: recordingTime,
          date: new Date().toISOString().split("T")[0],
          notes: activityDetails.notes,
          evaluation: activityDetails.evaluation,
        })
        setIsSaved(true)
      }

      // Here you would typically save activity to your backend via Inertia.post or similar
      toast({
        title: "Activity Saved",
        description: `Activity for ${currentStudent?.name} has been saved${audioBlob ? " with audio recording" : ""}.`,
      })

      // Reset form
      setActivityDetails({
        surah: "",
        ayatFrom: "",
        ayatTo: "",
        juz: "",
        notes: "",
        evaluation: "",
      })
      setAudioBlob(null)
      setAudioUrl("")
      setRecordingTime(0)
      setIsSaved(false)

      // Reload saved recordings
      loadSavedRecordings()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const downloadAudio = () => {
    if (audioBlob && currentStudent) {
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentStudent.name}_${new Date().toISOString().split("T")[0]}.wav`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hidz Dashboard</h1>
            <p className="text-muted-foreground">Monitor and analyze student Quran memorization progress</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/students")}>
              <Users className="h-4 w-4 mr-2" />
              View All Students
            </Button>
            <Button variant="outline" className="border-gray-200/60 cursor-pointer" onClick={() => router.visit("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Student Selection & Recording */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Selection */}
            <Card className="border-gray-200/60 shadow-sm">
              <CardHeader>
                <CardTitle>Select Student</CardTitle>
                <CardDescription>Choose student for memorization session</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="border-gray-200/60">
                    <SelectValue placeholder="Select student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={student.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{student.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {student.class} - Juz {student.currentJuz}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {currentStudent && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={currentStudent.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {currentStudent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{currentStudent.name}</h3>
                        <p className="text-sm text-muted-foreground">{currentStudent.class}</p>
                        <Badge variant="secondary">Juz {currentStudent.currentJuz}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Voice Recording */}
            <Card className="border-gray-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Recording
                  {isSaved && <CheckCircle className="h-5 w-5 text-green-500" />}
                </CardTitle>
                <CardDescription>Record student voice during memorization session {isSaved && "- Saved to database"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      disabled={!selectedStudent}
                      size="lg"
                      className="bg-red-500 hover:bg-red-600 cursor-pointer"
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={pauseRecording} variant="outline" size="lg" className="cursor-pointer border-gray-200/60">
                        {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                      </Button>
                      <Button onClick={stopRecording} variant="outline" size="lg" className="cursor-pointer border-gray-200/60">
                        <Square className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>

                {isRecording && (
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-red-500">{formatTime(recordingTime)}</div>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">{isPaused ? "Paused" : "Recording..."}</span>
                    </div>
                  </div>
                )}

                {audioUrl && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-4">
                      <Button onClick={playAudio} variant="outline" className="cursor-pointer border-gray-200/60">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <span className="text-sm text-muted-foreground">Duration: {formatTime(recordingTime)}</span>
                      <Button onClick={downloadAudio} variant="outline" size="sm" className="cursor-pointer border-gray-200/60">
                        <Download className="h-4 w-4" />
                      </Button>
                      {!isSaved && (
                        <Badge variant="outline" className="text-orange-600">
                          <Database className="h-3 w-3 mr-1" />
                          Not Saved
                        </Badge>
                      )}
                    </div>
                    <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Recordings */}
            {savedRecordings.length > 0 && (
              <Card className="border-gray-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Saved Recordings
                  </CardTitle>
                  <CardDescription>Latest 5 saved recordings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedRecordings.map((recording, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {recording.studentName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{recording.studentName}</p>
                          <p className="text-xs text-muted-foreground">
                            {recording.activityType} - {formatTime(recording.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{recording.date}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Activity Form */}
          <div className="space-y-6">
            <Card className="border-gray-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Activity
                </CardTitle>
                <CardDescription>Record student memorization activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Activity Type</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger className="border-gray-200/60">
                      <SelectValue placeholder="Select activity type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activityType && (
                  <>
                    {(activityType === "setoran_baru" ||
                      activityType === "muroja" ||
                      activityType === "menyelesaikan_ayat") && (
                      <>
                        <div className="space-y-2">
                          <Label>Surah</Label>
                          <Select
                            value={activityDetails.surah}
                            onValueChange={(value) => setActivityDetails((prev) => ({ ...prev, surah: value }))}
                          >
                            <SelectTrigger className="border-gray-200/60">
                              <SelectValue placeholder="Select surah..." />
                            </SelectTrigger>
                            <SelectContent>
                              {surahList.map((surah, index) => (
                                <SelectItem key={index} value={surah}>
                                  {index + 1}. {surah}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>Verse From</Label>
                            <Input
                              type="number"
                              placeholder="1"
                              value={activityDetails.ayatFrom}
                              onChange={(e) => setActivityDetails((prev) => ({ ...prev, ayatFrom: e.target.value }))}
                              className="border-gray-200/60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Verse To</Label>
                            <Input
                              type="number"
                              placeholder="10"
                              value={activityDetails.ayatTo}
                              onChange={(e) => setActivityDetails((prev) => ({ ...prev, ayatTo: e.target.value }))}
                              className="border-gray-200/60"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {activityType === "menyelesaikan_juz" && (
                      <div className="space-y-2">
                        <Label>Juz</Label>
                        <Select
                          value={activityDetails.juz}
                          onValueChange={(value) => setActivityDetails((prev) => ({ ...prev, juz: value }))}
                        >
                          <SelectTrigger className="border-gray-200/60">
                            <SelectValue placeholder="Select juz..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 30 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                Juz {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        placeholder="Add notes about this activity..."
                        value={activityDetails.notes}
                        onChange={(e) => setActivityDetails((prev) => ({ ...prev, notes: e.target.value }))}
                        className="border-gray-200/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Evaluation</Label>
                      <Select
                        value={activityDetails.evaluation}
                        onValueChange={(value) => setActivityDetails((prev) => ({ ...prev, evaluation: value }))}
                      >
                        <SelectTrigger className="border-gray-200/60">
                          <SelectValue placeholder="Select evaluation..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sangat_baik">Excellent</SelectItem>
                          <SelectItem value="baik">Good</SelectItem>
                          <SelectItem value="cukup">Fair</SelectItem>
                          <SelectItem value="perlu_perbaikan">Needs Improvement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleSaveActivity} className="w-full cursor-pointer">
                      <Save className="h-4 w-4 mr-2" />
                      Save Activity
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities for Selected Student */}
            {currentStudent && (
              <Card className="border-gray-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>{currentStudent.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { type: "setoran_baru", activity: "New Submission Al-Baqarah 1-10", time: "2 hours ago" },
                    { type: "muroja", activity: "Murajaah Ali Imran 50-75", time: "1 day ago" },
                    { type: "menyelesaikan_juz", activity: "Completed Juz 14", time: "3 days ago" },
                  ].map((activity, index) => {
                    const activityType = activityTypes.find((t) => t.value === activity.type)
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs ${activityType?.color}`}
                        >
                          {activityType && <activityType.icon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.activity}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
