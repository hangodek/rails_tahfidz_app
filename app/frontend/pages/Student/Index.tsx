"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { router } from "@inertiajs/react"
import {
  StudentHeader,
  FiltersAndSearch,
  StatsSummary,
  StudentGridView,
  StudentListView,
  NoStudentsFound,
} from "./components"

// Extended student data with detailed information (would come from Rails props)
const allStudents = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    currentJuz: 15,
    progress: 85,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas A",
    phone: "081234567890",
    email: "ahmad.fauzi@email.com",
    lastActivity: "2 jam lalu",
    weeklyTarget: 2,
    weeklyCompleted: 3,
    totalSetoran: 45,
    status: "active",
    // Detailed information
    birthPlace: "Jakarta",
    birthDate: "15 Januari 2010",
    address: "Jl. Masjid Al-Ikhlas No. 123, Kelurahan Suka Maju, Jakarta Selatan 12345",
    fatherName: "Bapak Ahmad Suryadi",
    motherName: "Ibu Siti Nurhaliza",
    parentPhone: "+62 812-3456-7890 (Ayah) | +62 813-4567-8901 (Ibu)",
    parentEmail: "ahmad.suryadi@email.com",
    startDate: "1 September 2023",
    targetCompletion: "Desember 2025",
  },
  {
    id: "2",
    name: "Fatimah Zahra",
    currentJuz: 14,
    progress: 82,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas A",
    phone: "081234567891",
    email: "fatimah.zahra@email.com",
    lastActivity: "3 jam lalu",
    weeklyTarget: 2,
    weeklyCompleted: 2,
    totalSetoran: 42,
    status: "active",
    birthPlace: "Bandung",
    birthDate: "22 Maret 2010",
    address: "Jl. Pesantren Indah No. 45, Kelurahan Bahagia, Bandung 40123",
    fatherName: "Bapak Muhammad Zainal",
    motherName: "Ibu Fatimah Azzahra",
    parentPhone: "+62 822-3456-7890 (Ayah) | +62 823-4567-8901 (Ibu)",
    parentEmail: "m.zainal@email.com",
    startDate: "15 Agustus 2023",
    targetCompletion: "November 2025",
  },
  {
    id: "3",
    name: "Muhammad Rizki",
    currentJuz: 13,
    progress: 78,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas B",
    phone: "081234567892",
    email: "muhammad.rizki@email.com",
    lastActivity: "4 jam lalu",
    weeklyTarget: 2,
    weeklyCompleted: 1,
    totalSetoran: 39,
    status: "active",
    birthPlace: "Surabaya",
    birthDate: "8 Juli 2009",
    address: "Jl. Masjid Agung No. 67, Kelurahan Sejahtera, Surabaya 60111",
    fatherName: "Bapak Rizki Pratama",
    motherName: "Ibu Dewi Sartika",
    parentPhone: "+62 831-2345-6789 (Ayah) | +62 832-3456-7890 (Ibu)",
    parentEmail: "rizki.pratama@email.com",
    startDate: "10 September 2023",
    targetCompletion: "Januari 2026",
  },
  {
    id: "4",
    name: "Aisyah Putri",
    currentJuz: 12,
    progress: 75,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas A",
    phone: "081234567893",
    email: "aisyah.putri@email.com",
    lastActivity: "5 jam lalu",
    weeklyTarget: 2,
    weeklyCompleted: 2,
    totalSetoran: 36,
    status: "active",
    birthPlace: "Yogyakarta",
    birthDate: "12 November 2010",
    address: "Jl. Pondok Pesantren No. 89, Kelurahan Damai, Yogyakarta 55123",
    fatherName: "Bapak Hendra Wijaya",
    motherName: "Ibu Aisyah Rahmawati",
    parentPhone: "+62 274-123-4567 (Ayah) | +62 274-234-5678 (Ibu)",
    parentEmail: "hendra.wijaya@email.com",
    startDate: "5 September 2023",
    targetCompletion: "Februari 2026",
  },
  {
    id: "5",
    name: "Abdullah Malik",
    currentJuz: 11,
    progress: 70,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas B",
    phone: "081234567894",
    email: "abdullah.malik@email.com",
    lastActivity: "1 hari lalu",
    weeklyTarget: 2,
    weeklyCompleted: 1,
    totalSetoran: 33,
    status: "active",
    birthPlace: "Medan",
    birthDate: "3 Februari 2010",
    address: "Jl. Islamic Center No. 12, Kelurahan Makmur, Medan 20111",
    fatherName: "Bapak Malik Ibrahim",
    motherName: "Ibu Khadijah Sari",
    parentPhone: "+62 61-123-4567 (Ayah) | +62 61-234-5678 (Ibu)",
    parentEmail: "malik.ibrahim@email.com",
    startDate: "20 Agustus 2023",
    targetCompletion: "Maret 2026",
  },
  {
    id: "6",
    name: "Khadijah Sari",
    currentJuz: 10,
    progress: 68,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas C",
    phone: "081234567895",
    email: "khadijah.sari@email.com",
    lastActivity: "1 hari lalu",
    weeklyTarget: 2,
    weeklyCompleted: 2,
    totalSetoran: 30,
    status: "active",
    birthPlace: "Makassar",
    birthDate: "18 September 2010",
    address: "Jl. Masjid Raya No. 34, Kelurahan Berkah, Makassar 90111",
    fatherName: "Bapak Usman Hakim",
    motherName: "Ibu Khadijah Aminah",
    parentPhone: "+62 411-123-456 (Ayah) | +62 411-234-567 (Ibu)",
    parentEmail: "usman.hakim@email.com",
    startDate: "12 September 2023",
    targetCompletion: "April 2026",
  },
  {
    id: "7",
    name: "Umar Faruq",
    currentJuz: 9,
    progress: 65,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas C",
    phone: "081234567896",
    email: "umar.faruq@email.com",
    lastActivity: "2 hari lalu",
    weeklyTarget: 2,
    weeklyCompleted: 1,
    totalSetoran: 27,
    status: "inactive",
    birthPlace: "Palembang",
    birthDate: "25 Juni 2009",
    address: "Jl. Pondok Tahfidz No. 56, Kelurahan Tenteram, Palembang 30111",
    fatherName: "Bapak Faruq Abdullah",
    motherName: "Ibu Maryam Salma",
    parentPhone: "+62 711-123-456 (Ayah) | +62 711-234-567 (Ibu)",
    parentEmail: "faruq.abdullah@email.com",
    startDate: "25 Agustus 2023",
    targetCompletion: "Mei 2026",
  },
  {
    id: "8",
    name: "Zainab Husna",
    currentJuz: 8,
    progress: 62,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas B",
    phone: "081234567897",
    email: "zainab.husna@email.com",
    lastActivity: "3 hari lalu",
    weeklyTarget: 2,
    weeklyCompleted: 2,
    totalSetoran: 24,
    status: "active",
    birthPlace: "Semarang",
    birthDate: "14 April 2010",
    address: "Jl. Masjid Besar No. 78, Kelurahan Harmoni, Semarang 50111",
    fatherName: "Bapak Husni Mubarak",
    motherName: "Ibu Zainab Fatimah",
    parentPhone: "+62 24-123-4567 (Ayah) | +62 24-234-5678 (Ibu)",
    parentEmail: "husni.mubarak@email.com",
    startDate: "8 September 2023",
    targetCompletion: "Juni 2026",
  },
  {
    id: "9",
    name: "Ali Hassan",
    currentJuz: 7,
    progress: 58,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas C",
    phone: "081234567898",
    email: "ali.hassan@email.com",
    lastActivity: "4 hari lalu",
    weeklyTarget: 2,
    weeklyCompleted: 1,
    totalSetoran: 21,
    status: "active",
    birthPlace: "Padang",
    birthDate: "30 Desember 2009",
    address: "Jl. Islamic School No. 90, Kelurahan Sejahtera, Padang 25111",
    fatherName: "Bapak Hassan Ali",
    motherName: "Ibu Aminah Zahra",
    parentPhone: "+62 751-123-456 (Ayah) | +62 751-234-567 (Ibu)",
    parentEmail: "hassan.ali@email.com",
    startDate: "18 September 2023",
    targetCompletion: "Juli 2026",
  },
  {
    id: "10",
    name: "Maryam Salma",
    currentJuz: 6,
    progress: 55,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas A",
    phone: "081234567899",
    email: "maryam.salma@email.com",
    lastActivity: "5 hari lalu",
    weeklyTarget: 2,
    weeklyCompleted: 0,
    totalSetoran: 18,
    status: "inactive",
    birthPlace: "Denpasar",
    birthDate: "7 Mei 2010",
    address: "Jl. Masjid Agung No. 23, Kelurahan Damai, Denpasar 80111",
    fatherName: "Bapak Salman Hakim",
    motherName: "Ibu Maryam Khadijah",
    parentPhone: "+62 361-123-456 (Ayah) | +62 361-234-567 (Ibu)",
    parentEmail: "salman.hakim@email.com",
    startDate: "22 September 2023",
    targetCompletion: "Agustus 2026",
  },
  {
    id: "11",
    name: "Ibrahim Yusuf",
    currentJuz: 5,
    progress: 52,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas B",
    phone: "081234567800",
    email: "ibrahim.yusuf@email.com",
    lastActivity: "1 minggu lalu",
    weeklyTarget: 2,
    weeklyCompleted: 1,
    totalSetoran: 15,
    status: "active",
    birthPlace: "Balikpapan",
    birthDate: "16 Agustus 2010",
    address: "Jl. Pondok Quran No. 45, Kelurahan Bahagia, Balikpapan 76111",
    fatherName: "Bapak Yusuf Ibrahim",
    motherName: "Ibu Sarah Aminah",
    parentPhone: "+62 542-123-456 (Ayah) | +62 542-234-567 (Ibu)",
    parentEmail: "yusuf.ibrahim@email.com",
    startDate: "30 September 2023",
    targetCompletion: "September 2026",
  },
  {
    id: "12",
    name: "Hafsah Amina",
    currentJuz: 4,
    progress: 48,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas C",
    phone: "081234567801",
    email: "hafsah.amina@email.com",
    lastActivity: "1 minggu lalu",
    weeklyTarget: 2,
    weeklyCompleted: 2,
    totalSetoran: 12,
    status: "active",
    birthPlace: "Pontianak",
    birthDate: "9 Oktober 2010",
    address: "Jl. Tahfidz Center No. 67, Kelurahan Makmur, Pontianak 78111",
    fatherName: "Bapak Amin Hakim",
    motherName: "Ibu Hafsah Khadijah",
    parentPhone: "+62 561-123-456 (Ayah) | +62 561-234-567 (Ibu)",
    parentEmail: "amin.hakim@email.com",
    startDate: "15 Oktober 2023",
    targetCompletion: "Oktober 2026",
  },
  {
    id: "13",
    name: "Omar Abdullah",
    currentJuz: 30,
    progress: 100,
    avatar: "/placeholder.svg?height=40&width=40",
    class: "Kelas A",
    phone: "081234567802",
    email: "omar.abdullah@email.com",
    lastActivity: "1 bulan lalu",
    weeklyTarget: 0,
    weeklyCompleted: 0,
    totalSetoran: 120,
    status: "graduated",
    birthPlace: "Jakarta",
    birthDate: "12 Januari 2009",
    address: "Jl. Al-Quran Center No. 88, Kelurahan Berkah, Jakarta Pusat 10110",
    fatherName: "Bapak Abdullah Rahman",
    motherName: "Ibu Khadijah Omar",
    parentPhone: "+62 21-123-4567 (Ayah) | +62 21-234-5678 (Ibu)",
    parentEmail: "abdullah.rahman@email.com",
    startDate: "1 Januari 2022",
    targetCompletion: "Completed in July 2025",
  },
]

interface StudentsIndexProps {
  students: typeof allStudents // In a real app, this would be passed from Rails
}

export default function StudentsIndex({ students = allStudents }: StudentsIndexProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [juzFilter, setJuzFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter and sort students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = classFilter === "all" || student.class === classFilter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    const matchesJuz =
      juzFilter === "all" ||
      (juzFilter === "Juz 1-5" && student.currentJuz >= 1 && student.currentJuz <= 5) ||
      (juzFilter === "Juz 6-10" && student.currentJuz >= 6 && student.currentJuz <= 10) ||
      (juzFilter === "Juz 11-15" && student.currentJuz >= 11 && student.currentJuz <= 15) ||
      (juzFilter === "Juz 16-20" && student.currentJuz >= 16 && student.currentJuz <= 20) ||
      (juzFilter === "Juz 21-25" && student.currentJuz >= 21 && student.currentJuz <= 25) ||
      (juzFilter === "Juz 26-30" && student.currentJuz >= 26 && student.currentJuz <= 30)
    return matchesSearch && matchesClass && matchesStatus && matchesJuz
  })

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Active
      </Badge>
    ) : status === "graduated" ? (
      <Badge variant="default" className="bg-orange-100 text-orange-800">
        Graduated
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Inactive
      </Badge>
    )
  }

  const handleSelectStudent = (studentId: string) => {
    router.visit(`/students/${studentId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <StudentHeader />

        {/* Filters and Search */}
        <FiltersAndSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          classFilter={classFilter}
          setClassFilter={setClassFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          juzFilter={juzFilter}
          setJuzFilter={setJuzFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Stats Summary */}
        <StatsSummary students={students} />

        {viewMode === "grid" ? (
          <StudentGridView
            filteredStudents={filteredStudents}
            getStatusBadge={getStatusBadge}
            handleSelectStudent={handleSelectStudent}
          />
        ) : (
          <StudentListView
            filteredStudents={filteredStudents}
            getStatusBadge={getStatusBadge}
            handleSelectStudent={handleSelectStudent}
          />
        )}

        {filteredStudents.length === 0 && <NoStudentsFound />}
      </div>
    </div>
  )
}
