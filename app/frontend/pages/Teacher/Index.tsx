"use client"

import { useState, useRef, useEffect } from "react"
import {
  BookOpen,
  Star,
  Calendar,
  Award,
  Volume2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  TeacherHeader,
  StudentSelection,
  VoiceRecording,
  SavedRecordings,
  ActivityForm,
  RecentActivities,
} from "./components"

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

// Activity types
const activityTypes = [
  { value: "memorization", label: "Memorization", icon: BookOpen, color: "bg-blue-500" },
  { value: "revision", label: "Revision", icon: Star, color: "bg-green-500" },
  { value: "evaluation", label: "Evaluation", icon: Award, color: "bg-orange-500" },
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

type TeacherIndexProps = {
  students: Array<{
    id: string
    name: string
    class_level: string
    current_hifz_in_juz: string
  }>
}

export default function TeacherIndex({ students }: TeacherIndexProps) {
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
      <div className="flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <TeacherHeader />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Student Selection & Recording */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Student Selection */}
            <StudentSelection
              students={students}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              currentStudent={currentStudent}
            />

            {/* Voice Recording */}
            <VoiceRecording
              selectedStudent={selectedStudent}
              isRecording={isRecording}
              isPaused={isPaused}
              recordingTime={recordingTime}
              audioUrl={audioUrl}
              isPlaying={isPlaying}
              isSaved={isSaved}
              startRecording={startRecording}
              pauseRecording={pauseRecording}
              stopRecording={stopRecording}
              playAudio={playAudio}
              downloadAudio={downloadAudio}
              formatTime={formatTime}
            />

            {/* Saved Recordings */}
            <SavedRecordings
              savedRecordings={savedRecordings}
              formatTime={formatTime}
            />
          </div>

          {/* Activity Form */}
          <div className="space-y-4 sm:space-y-6">
            <ActivityForm
              activityType={activityType}
              setActivityType={setActivityType}
              activityTypes={activityTypes}
              surahList={surahList}
              activityDetails={activityDetails}
              setActivityDetails={setActivityDetails}
              handleSaveActivity={handleSaveActivity}
            />

            {/* Recent Activities for Selected Student */}
            <RecentActivities
              currentStudent={currentStudent}
              activityTypes={activityTypes}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
