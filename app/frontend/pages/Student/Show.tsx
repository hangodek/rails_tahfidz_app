"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import {
  BookOpen,
  CalendarIcon,
  TrendingUp,
  Award,
  Clock,
  Target,
  Star,
  User,
  ArrowLeft,
  ChevronDown,
} from "lucide-react"
import { router } from "@inertiajs/react"

// Student type definition
interface Student {
  id: string
  name: string
  current_hifz_in_juz: number
  current_hifz_in_pages: number
  avatar: string
  class: string
  phone: string
  email: string
  status: string
  gender: string
  birthPlace: string
  birthDate: string
  address: string
  fatherName: string
  motherName: string
  fatherPhone: string
  motherPhone: string
  dateJoined: string
}

// Sample student data (would come from Rails props)
const allStudents = [
  {
    id: "1",
    name: "Ahmad Fadhil",
    current_hifz_in_juz: 3,
    current_hifz_in_pages: 45,
    avatar: "/placeholder.svg",
    class: "Kelas A",
    phone: "081234567890",
    email: "ahmad.fadhil@email.com",
    status: "active",
    gender: "male",
    birthPlace: "Jakarta",
    birthDate: "15 Januari 2010",
    address: "Jl. Masjid Al-Ikhlas No. 123, Kelurahan Suka Maju, Jakarta Selatan 12345",
    fatherName: "Bapak Ahmad Suryadi",
    motherName: "Ibu Siti Nurhaliza",
    fatherPhone: "+62 812-3456-7890",
    motherPhone: "+62 813-4567-8901",
    dateJoined: "1 September 2023",
  },
  {
    id: "2", 
    name: "Fatimah Azzahra",
    current_hifz_in_juz: 2,
    current_hifz_in_pages: 30,
    avatar: "/placeholder.svg",
    class: "Kelas A",
    phone: "081234567891",
    email: "fatimah.azzahra@email.com",
    status: "active",
    gender: "female",
    birthPlace: "Bandung",
    birthDate: "22 Maret 2010",
    address: "Jl. Pesantren Indah No. 45, Kelurahan Bahagia, Bandung 40123",
    fatherName: "Bapak Muhammad Zainal",
    motherName: "Ibu Fatimah Azzahra",
    fatherPhone: "+62 822-3456-7890",
    motherPhone: "+62 823-4567-8901",
    dateJoined: "15 Agustus 2023",
  },
]

// Generate daily submissions data for date range
const generateDailySubmissions = (startDate: Date, endDate: Date) => {
  const data = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    data.push({
      date: format(currentDate, "dd/MM"),
      fullDate: format(currentDate, "yyyy-MM-dd"),
      submissions: Math.floor(Math.random() * 30) + 20, // Random data between 20-50
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

// Juz distribution (30 Juz total)
const juzDistribution = [
  { name: "Juz 1-5", value: 25, color: "#3b82f6" },
  { name: "Juz 6-10", value: 30, color: "#10b981" },
  { name: "Juz 11-15", value: 35, color: "#f59e0b" },
  { name: "Juz 16-20", value: 28, color: "#ef4444" },
  { name: "Juz 21-25", value: 22, color: "#8b5cf6" },
  { name: "Juz 26-30", value: 16, color: "#06b6d4" },
]

// Student specific data
const getStudentData = (studentId: string, startDate: Date, endDate: Date) => {
  const student = allStudents.find((s: Student) => s.id === studentId)
  if (!student) return null

  return {
    dailySubmissions: generateDailySubmissions(startDate, endDate).map((item) => ({
      ...item,
      submissions: Math.floor(Math.random() * 5) + 1, // 1-6 for individual student
    })),
    progressData: [
      { month: "Jan", completed: 8 },
      { month: "Feb", completed: 9 },
      { month: "Mar", completed: 11 },
      { month: "Apr", completed: 12 },
      { month: "Mei", completed: 14 },
      { month: "Jun", completed: student.current_hifz_in_juz },
    ],
    recentActivities: [
      { activity: "Menyelesaikan Al-Baqarah ayat 1-10", time: "2 jam lalu", type: "hafalan" },
      { activity: "Muroja'ah Ali Imran ayat 50-75", time: "1 hari lalu", type: "muroja" },
      { activity: "Setoran baru An-Nisa ayat 1-5", time: "2 hari lalu", type: "setoran" },
      { activity: "Menyelesaikan Juz 14", time: "3 hari lalu", type: "completion" },
    ],
  }
}

interface StudentShowProps {
  studentId: string // This would be passed as a prop from Rails
  // studentData: any; // The actual student data object
}

export default function StudentShow({ studentId }: StudentShowProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  })

  const currentStudent = allStudents.find((s: Student) => s.id === studentId)
  const studentData = currentStudent ? getStudentData(studentId, dateRange.from, dateRange.to) : null

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Siswa tidak ditemukan</h3>
            <p className="text-muted-foreground">Kembali ke daftar siswa atau dashboard.</p>
            <div className="mt-4 flex gap-2 justify-center">
              <Button onClick={() => router.visit("/students")} className="cursor-pointer">Daftar Siswa</Button>
              <Button variant="outline" onClick={() => router.visit("/dashboard")} className="cursor-pointer">
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Progress {currentStudent?.name}</h1>
              <p className="text-muted-foreground">Student's memorization progress and activity details</p>
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentStudent.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {currentStudent.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{currentStudent.name}</h2>
                <p className="text-muted-foreground">Juz {currentStudent.current_hifz_in_juz} of 30 Juz</p>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">{currentStudent.current_hifz_in_pages} pages memorized</div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  Juz {currentStudent.current_hifz_in_juz}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student detailed information card */}
        <Card className="border-gray-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Details
            </CardTitle>
            <CardDescription>Complete data and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-sm">{currentStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <p className="text-sm">{currentStudent.gender === 'male' ? 'Male' : 'Female'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Place, Date of Birth</label>
                  <p className="text-sm">
                    {currentStudent.birthPlace}, {currentStudent.birthDate}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm">{currentStudent.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Class</label>
                  <p className="text-sm">{currentStudent.class} - Intensive Tahfidz</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                  <p className="text-sm">{currentStudent.fatherName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                  <p className="text-sm">{currentStudent.motherName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Father's Phone</label>
                  <p className="text-sm">{currentStudent.fatherPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mother's Phone</label>
                  <p className="text-sm">{currentStudent.motherPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Joined</label>
                  <p className="text-sm">{currentStudent.dateJoined}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-gray-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Submission</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                3 <span className="text-lg font-normal text-muted-foreground">Verses</span>
              </div>
              <p className="text-xs text-muted-foreground">From selected period</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Juz</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Juz {currentStudent?.current_hifz_in_juz || 0}</div>
              <p className="text-xs text-muted-foreground">{currentStudent?.current_hifz_in_pages || 0} pages memorized</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Submissions Chart with Date Range */}
          <Card className="col-span-2 border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Daily Submissions
                  </CardTitle>
                  <CardDescription>{currentStudent?.name}'s daily memorization submissions</CardDescription>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="cursor-pointer border-gray-200/60">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {format(dateRange.from, "dd MMM", { locale: id })} -{" "}
                      {format(dateRange.to, "dd MMM", { locale: id })}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-gray-200/60" align="end">
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => date && setDateRange((prev) => ({ ...prev, from: date }))}
                          locale={id}
                          className="border-gray-200/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => date && setDateRange((prev) => ({ ...prev, to: date }))}
                          locale={id}
                          className="border-gray-200/60"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer border-gray-200/60"
                          onClick={() =>
                            setDateRange({
                              from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                              to: new Date(),
                            })
                          }
                        >
                          7 Days
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer border-gray-200/60"
                          onClick={() =>
                            setDateRange({
                              from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
                              to: new Date(),
                            })
                          }
                        >
                          30 Days
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentData?.dailySubmissions}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Juz Distribution */}
          <Card className="border-gray-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Progress per Juz
              </CardTitle>
              <CardDescription>Memorization distribution by juz</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={juzDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {juzDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="border-gray-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Progress
            </CardTitle>
            <CardDescription>{currentStudent?.name}'s monthly memorization progress (cumulative)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentData?.progressData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Juz Completed" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Student Stats */}
          <Card className="border-gray-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Student Statistics
              </CardTitle>
              <CardDescription>Summary of {currentStudent?.name}'s achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{currentStudent?.current_hifz_in_juz}</div>
                  <div className="text-sm text-muted-foreground">Current Juz</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{currentStudent?.current_hifz_in_pages}</div>
                  <div className="text-sm text-muted-foreground">Pages Memorized</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">22</div>
                  <div className="text-sm text-muted-foreground">Total Submissions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-muted-foreground">Attendance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-gray-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest activities of {currentStudent?.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(studentData?.recentActivities || []).map((activity, index) => (
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
                    <p className="text-xs text-muted-foreground">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
