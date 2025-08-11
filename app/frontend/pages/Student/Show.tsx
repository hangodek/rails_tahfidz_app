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
  BarChart3,
} from "lucide-react"
import { router } from "@inertiajs/react"

// Student type definition matching database schema
interface Student {
  id: string
  name: string
  current_hifz_in_juz: string
  current_hifz_in_pages: string
  avatar?: string
  class_level: string
  phone?: string
  email?: string
  status: string
  gender: string
  birth_place: string
  birth_date: string
  address?: string
  father_name: string
  mother_name: string
  father_phone?: string
  mother_phone?: string
  date_joined: string
  created_at: string
  updated_at: string
}

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
const getStudentData = (student: Student, startDate: Date, endDate: Date) => {
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
      { month: "Jun", completed: parseInt(student.current_hifz_in_juz) || 0 },
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
  student: Student // The actual student data object from Rails controller
}

export default function StudentShow({ student }: StudentShowProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  })

  const studentData = student ? getStudentData(student, dateRange.from, dateRange.to) : null

  // Helper function to get avatar URL
  const getAvatarUrl = (avatar?: string): string => {
    if (!avatar) return "/placeholder.svg"
    
    // If avatar is already a full URL, use it
    if (avatar.startsWith('http')) return avatar
    
    // If avatar is a path starting with /, use it as is
    if (avatar.startsWith('/')) return avatar
    
    // If avatar looks like a Rails Active Storage signed ID or blob key
    if (avatar.includes('-') && avatar.length > 10) {
      return `/rails/active_storage/blobs/redirect/${avatar}/avatar`
    }
    
    // Fallback: try to construct Rails Active Storage URL
    return `/rails/active_storage/blobs/${avatar}`
  }

  if (!student) {
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
      <div className="flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Progress {student?.name}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Student's memorization progress and activity details</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4 sm:gap-0">
            <Button
              variant="outline"
              className="border-gray-200/60 cursor-pointer"
              onClick={() => router.visit('/students')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Students</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Avatar className="h-16 w-16 sm:h-16 sm:w-16">
                <AvatarImage src={getAvatarUrl(student.avatar)} alt={`${student.name}'s avatar`} />
                <AvatarFallback className="text-lg">
                  {student.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground">Juz {student.current_hifz_in_juz} of 30 Juz</p>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">{student.current_hifz_in_pages} pages memorized</div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <Badge variant="secondary" className="text-base sm:text-lg px-3 py-1">
                  Juz {student.current_hifz_in_juz}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student detailed information card */}
        <Card className="border-gray-200/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <User className="h-5 w-5" />
              Student Details
            </CardTitle>
            <CardDescription className="text-sm">Complete data and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-sm sm:text-base mt-1">{student.name}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Gender</label>
                  <p className="text-sm sm:text-base mt-1">{student.gender === 'male' ? 'Male' : 'Female'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Place, Date of Birth</label>
                  <p className="text-sm sm:text-base mt-1">
                    {student.birth_place}, {student.birth_date}
                  </p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm sm:text-base mt-1">{student.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Class</label>
                  <p className="text-sm sm:text-base mt-1">{student.class_level}</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Father's Name</label>
                  <p className="text-sm sm:text-base mt-1">{student.father_name}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Mother's Name</label>
                  <p className="text-sm sm:text-base mt-1">{student.mother_name}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Father's Phone</label>
                  <p className="text-sm sm:text-base mt-1">{student.father_phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Mother's Phone</label>
                  <p className="text-sm sm:text-base mt-1">{student.mother_phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-muted-foreground">Date Joined</label>
                  <p className="text-sm sm:text-base mt-1">{student.date_joined}</p>
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
              <div className="text-2xl font-bold">Juz {student?.current_hifz_in_juz || 0}</div>
              <p className="text-xs text-muted-foreground">{student?.current_hifz_in_pages || 0} pages memorized</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section - Hidden on mobile */}
        <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Daily Submissions Chart with Date Range */}
          <Card className="col-span-2 border-gray-200/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Daily Submissions
                  </CardTitle>
                  <CardDescription>{student?.name}'s daily memorization submissions</CardDescription>
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

        {/* Progress Chart - Hidden on mobile */}
        <Card className="hidden md:block border-gray-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Progress
            </CardTitle>
            <CardDescription>{student?.name}'s monthly memorization progress (cumulative)</CardDescription>
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

          {/* Mobile Chart Notice */}
          <div className="md:hidden">
            <Card className="border-blue-200/60 bg-blue-50/30 shadow-md">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">Charts Available on Larger Screens</p>
                    <p className="text-xs text-blue-600">View detailed analytics and progress charts on tablet or desktop</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Stats */}
          <Card className="border-gray-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Student Statistics
              </CardTitle>
              <CardDescription>Summary of {student?.name}'s achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{student?.current_hifz_in_juz}</div>
                  <div className="text-sm text-muted-foreground">Current Juz</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{student?.current_hifz_in_pages}</div>
                  <div className="text-sm text-muted-foreground">Pages Memorized</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg sm:col-span-2 lg:col-span-1">
                  <div className="text-2xl font-bold text-orange-600">22</div>
                  <div className="text-sm text-muted-foreground">Total Submissions</div>
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
              <CardDescription>Latest activities of {student?.name}</CardDescription>
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
