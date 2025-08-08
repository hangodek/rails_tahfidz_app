"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, User, Users, Target } from "lucide-react"
import { router } from "@inertiajs/react"

interface StudentFormData {
  name: string
  address: string
  birth_date: string
  mother_name: string
  father_name: string
  date_joined: string
  hifz_in_juz: string
  hifz_in_page: string
}

export default function CreateStudent() {
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    address: "",
    birth_date: "",
    mother_name: "",
    father_name: "",
    date_joined: "",
    hifz_in_juz: "0",
    hifz_in_page: "0",
  })

  const [errors, setErrors] = useState<Partial<StudentFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {}

    if (!formData.name.trim()) newErrors.name = "Nama siswa wajib diisi"
    if (!formData.birth_date) newErrors.birth_date = "Tanggal lahir wajib diisi"
    if (!formData.address.trim()) newErrors.address = "Alamat wajib diisi"
    if (!formData.father_name.trim()) newErrors.father_name = "Nama ayah wajib diisi"
    if (!formData.mother_name.trim()) newErrors.mother_name = "Nama ibu wajib diisi"
    if (!formData.date_joined) newErrors.date_joined = "Tanggal bergabung wajib diisi"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Convert string values to appropriate types for Rails
      const studentData = {
        ...formData,
        hifz_in_juz: parseInt(formData.hifz_in_juz) || 0,
        hifz_in_page: parseInt(formData.hifz_in_page) || 0,
      }
      
      router.post('/students', { student: studentData })
    } catch (error) {
      console.error('Error creating student:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Student</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Add a new student to the Quran memorization program
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4 sm:gap-0">
            <Button 
              variant="outline" 
              className="border-gray-200/60 cursor-pointer" 
              onClick={() => router.visit("/students")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Students</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
              <CardDescription>
                Basic information about the student
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter student's full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Date of Birth *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange("birth_date", e.target.value)}
                    className={errors.birth_date ? "border-red-500" : ""}
                  />
                  {errors.birth_date && <p className="text-sm text-red-500">{errors.birth_date}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parent Information
              </CardTitle>
              <CardDescription>
                Information about student's parents or guardians
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="father_name">Father's Name *</Label>
                  <Input
                    id="father_name"
                    value={formData.father_name}
                    onChange={(e) => handleInputChange("father_name", e.target.value)}
                    placeholder="Enter father's full name"
                    className={errors.father_name ? "border-red-500" : ""}
                  />
                  {errors.father_name && <p className="text-sm text-red-500">{errors.father_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mother_name">Mother's Name *</Label>
                  <Input
                    id="mother_name"
                    value={formData.mother_name}
                    onChange={(e) => handleInputChange("mother_name", e.target.value)}
                    placeholder="Enter mother's full name"
                    className={errors.mother_name ? "border-red-500" : ""}
                  />
                  {errors.mother_name && <p className="text-sm text-red-500">{errors.mother_name}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Information */}
          <Card className="border-gray-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Program Information
              </CardTitle>
              <CardDescription>
                Tahfidz program settings and current progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_joined">Date Joined *</Label>
                  <Input
                    id="date_joined"
                    type="date"
                    value={formData.date_joined}
                    onChange={(e) => handleInputChange("date_joined", e.target.value)}
                    className={errors.date_joined ? "border-red-500" : ""}
                  />
                  {errors.date_joined && <p className="text-sm text-red-500">{errors.date_joined}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hifz_in_juz">Current Juz Memorized</Label>
                  <Input
                    id="hifz_in_juz"
                    type="number"
                    min="0"
                    max="30"
                    value={formData.hifz_in_juz}
                    onChange={(e) => handleInputChange("hifz_in_juz", e.target.value)}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">Enter number of Juz completed (0-30)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hifz_in_page">Current Page in Juz</Label>
                  <Input
                    id="hifz_in_page"
                    type="number"
                    min="0"
                    max="20"
                    value={formData.hifz_in_page}
                    onChange={(e) => handleInputChange("hifz_in_page", e.target.value)}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">Enter current page in ongoing Juz (0-20)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit("/students")}
              className="sm:w-auto border-gray-200/60 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="sm:w-auto cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
