"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  current_hifz_in_surah: string
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

// Activity type from backend
interface Activity {
  id: number
  activity: string
  time: string
  type: string
  date: string
  created_at: string
}

// Detailed activity type for modal
interface DetailedActivity {
  id: number
  activity: string
  time: string
  type: string
  date: string
  created_at: string
  grade: string
  surah_from: string
  surah_to: string
  page_from: number
  page_to: number
  juz: number
  notes?: string
}

// Monthly progress data
interface MonthlyProgress {
  month: string
  completed: number
}

// Grade distribution data
interface GradeDistribution {
  name: string
  value: number
  color: string
}

// Type distribution data
interface TypeDistribution {
  name: string
  value: number
  color: string
}

// Monthly activities data
interface MonthlyActivities {
  month: string
  revision: number
  memorization: number
}

// Generate daily submissions data for date range
const generateDailySubmissions = (startDate: Date, endDate: Date, activities: Activity[]) => {
  const data = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd")
    const dayActivities = activities.filter(activity => 
      activity.date === dateStr
    ).length

    data.push({
      date: format(currentDate, "dd/MM"),
      fullDate: dateStr,
      submissions: dayActivities,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

// Student specific data
const getStudentData = (student: Student, recent_activities: Activity[], startDate: Date, endDate: Date) => {
  if (!student) return null

  return {
    dailySubmissions: generateDailySubmissions(startDate, endDate, recent_activities),
    recentActivities: recent_activities,
  }
}

interface StudentShowProps {
  student: Student // The actual student data object from Rails controller
  recent_activities: Activity[] // Recent activities from backend (limited to 5)
  all_activities: DetailedActivity[] // All activities for modal
  total_activities: number // Total count of activities
  monthly_progress: MonthlyProgress[] // Monthly progress data
  grade_distribution: GradeDistribution[] // Grade distribution data
  type_distribution: TypeDistribution[] // Activity type distribution data
  monthly_activities: MonthlyActivities[] // Monthly activities data
}

export default function StudentShow({ student, recent_activities, all_activities, total_activities, monthly_progress, grade_distribution, type_distribution, monthly_activities }: StudentShowProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  })

  const studentData = student ? getStudentData(student, recent_activities, dateRange.from, dateRange.to) : null

  // Calculate today's submissions
  const todayStr = format(new Date(), "yyyy-MM-dd")
  const todaySubmissions = recent_activities.filter(activity => activity.date === todayStr).length

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

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
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
                <p className="text-muted-foreground">Currently memorizing: {student.current_hifz_in_surah}</p>
                <p className="text-muted-foreground">Juz {student.current_hifz_in_juz} of 30 Juz</p>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">{student.current_hifz_in_pages} pages memorized</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student detailed information card */}
        <Card className="border-gray-200/60 shadow-lg">
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
          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Submission</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todaySubmissions} <span className="text-lg font-normal text-muted-foreground">Activities</span>
              </div>
              <p className="text-xs text-muted-foreground">Submissions today</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student?.current_hifz_in_surah}</div>
              <p className="text-xs text-muted-foreground">Juz {student?.current_hifz_in_juz || 0} • {student?.current_hifz_in_pages || 0} pages memorized</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Submissions Chart - Full Width, Hidden on mobile */}
        <Card className="hidden md:block border-gray-200/60 shadow-lg">
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

        {/* Progress Chart - Hidden on mobile */}
        <Card className="hidden md:block border-gray-200/60 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Progress
            </CardTitle>
            <CardDescription>
              {student?.name}'s Quran memorization progress over time (starting from join date: {student?.date_joined})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthly_progress}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 30]} />
                <Tooltip 
                  formatter={(value, name) => [`${value} Juz`, name]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  name="Juz Completed"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Activities Chart - Hidden on mobile */}
        <Card className="hidden md:block border-gray-200/60 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Monthly Revision & Memorization Activities
            </CardTitle>
            <CardDescription>
              {student?.name}'s monthly activity breakdown - revision vs memorization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthly_activities}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value} activities`, name]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revision" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  name="Revision Activities"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="memorization" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  name="Memorization Activities"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Charts Section - Side by Side, Hidden on mobile */}
        <div className="hidden md:grid gap-6 md:grid-cols-2">
          {/* Activity Grade Distribution */}
          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Distribution
              </CardTitle>
              <CardDescription>Quality of memorization activities</CardDescription>
            </CardHeader>
            <CardContent>
              {grade_distribution && grade_distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={grade_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {grade_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} activities`, name]}
                      labelFormatter={(label) => `Grade: ${label}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-center">
                  <div>
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No performance data available</p>
                    <p className="text-sm text-muted-foreground">Data will appear when activities are graded</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Type Distribution */}
          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Activity Types
              </CardTitle>
              <CardDescription>Memorization vs Revision balance</CardDescription>
            </CardHeader>
            <CardContent>
              {type_distribution && type_distribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={type_distribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {type_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} activities`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-center">
                  <div>
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No activity data available</p>
                    <p className="text-sm text-muted-foreground">Data will appear when activities are recorded</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Student Statistics
              </CardTitle>
              <CardDescription>Summary of {student?.name}'s achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600 truncate">{student?.current_hifz_in_surah}</div>
                  <div className="text-sm text-muted-foreground">Current Surah</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{student?.current_hifz_in_juz}</div>
                  <div className="text-sm text-muted-foreground">Current Juz</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{student?.current_hifz_in_pages}</div>
                  <div className="text-sm text-muted-foreground">Current Pages</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{total_activities}</div>
                  <div className="text-sm text-muted-foreground">Total Submissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>Latest activities of {student?.name}</CardDescription>
                </div>
                {all_activities.length > 5 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="cursor-pointer border-gray-200/60">
                        View All ({all_activities.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>All Activities - {student?.name}</DialogTitle>
                        <DialogDescription>
                          Complete history of memorization and revision activities
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {all_activities.map((activity, index) => (
                          <div key={activity.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs flex-shrink-0 ${
                                activity.type === "memorization"
                                  ? "bg-blue-500"
                                  : activity.type === "revision"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                              }`}
                            >
                              {activity.type === "memorization" ? (
                                <BookOpen className="h-4 w-4" />
                              ) : activity.type === "revision" ? (
                                <Star className="h-4 w-4" />
                              ) : (
                                <Target className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{activity.activity}</p>
                                <Badge variant={activity.grade === "Excellent" ? "default" : 
                                              activity.grade === "Good" ? "secondary" : 
                                              activity.grade === "Fair" ? "outline" : "destructive"}>
                                  {activity.grade}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                <div>
                                  <span className="font-medium">Surah:</span> {activity.surah_from}
                                  {activity.surah_from !== activity.surah_to && ` - ${activity.surah_to}`}
                                </div>
                                <div>
                                  <span className="font-medium">Pages:</span> {activity.page_from}-{activity.page_to}
                                </div>
                                <div>
                                  <span className="font-medium">Juz:</span> {activity.juz || 'N/A'}
                                </div>
                                <div>
                                  <span className="font-medium">Time:</span> {activity.time}
                                </div>
                              </div>
                              {activity.notes && (
                                <div className="text-xs text-muted-foreground">
                                  <span className="font-medium">Notes:</span> {activity.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recent_activities.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs ${
                      activity.type === "memorization"
                        ? "bg-blue-500"
                        : activity.type === "revision"
                          ? "bg-green-500"
                          : "bg-gray-500"
                    }`}
                  >
                    {activity.type === "memorization" ? (
                      <BookOpen className="h-4 w-4" />
                    ) : activity.type === "revision" ? (
                      <Star className="h-4 w-4" />
                    ) : (
                      <Target className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              {recent_activities.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activities found</p>
                  <p className="text-sm text-muted-foreground">Activities will appear here when the student starts memorizing</p>
                </div>
              )}
              {all_activities.length > 5 && (
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-muted-foreground">
                    Showing 5 most recent activities. 
                    <span className="font-medium"> {all_activities.length - 5} more activities available.</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
