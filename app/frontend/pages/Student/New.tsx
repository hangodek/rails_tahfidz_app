"use client"

import { useState } from "react"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { NewStudentForm } from "./components/NewStudentForm"

interface StudentFormData {
  name: string
  current_hifz_in_juz: string
  current_hifz_in_pages: string
  avatar: File | null
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

export default function CreateStudent() {
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    current_hifz_in_juz: "0",
    current_hifz_in_pages: "0",
    avatar: null,
    class: "",
    phone: "",
    email: "",
    status: "active",
    gender: "",
    birthPlace: "",
    birthDate: "",
    address: "",
    fatherName: "",
    motherName: "",
    fatherPhone: "",
    motherPhone: "",
    dateJoined: "",
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

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      avatar: file
    }))
    // Clear error when file is selected
    if (errors.avatar) {
      setErrors(prev => ({
        ...prev,
        avatar: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {}

    if (!formData.name.trim()) newErrors.name = "Student name is required"
    if (!formData.birthDate) newErrors.birthDate = "Date of birth is required"
    if (!formData.birthPlace.trim()) newErrors.birthPlace = "Place of birth is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.class) newErrors.class = "Class is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required"
    if (!formData.motherName.trim()) newErrors.motherName = "Mother's name is required"
    if (!formData.fatherPhone.trim()) newErrors.fatherPhone = "Father's phone is required"
    if (!formData.motherPhone.trim()) newErrors.motherPhone = "Mother's phone is required"
    if (!formData.dateJoined) newErrors.dateJoined = "Date joined is required"

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

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
      // Create FormData for file upload
      const formDataToSend = new FormData()
      
      // Add all form fields
      formDataToSend.append('student[name]', formData.name)
      formDataToSend.append('student[current_hifz_in_juz]', formData.current_hifz_in_juz)
      formDataToSend.append('student[current_hifz_in_pages]', formData.current_hifz_in_pages)
      formDataToSend.append('student[class]', formData.class)
      formDataToSend.append('student[phone]', formData.phone)
      formDataToSend.append('student[email]', formData.email)
      formDataToSend.append('student[status]', formData.status)
      formDataToSend.append('student[gender]', formData.gender)
      formDataToSend.append('student[birthPlace]', formData.birthPlace)
      formDataToSend.append('student[birthDate]', formData.birthDate)
      formDataToSend.append('student[address]', formData.address)
      formDataToSend.append('student[fatherName]', formData.fatherName)
      formDataToSend.append('student[motherName]', formData.motherName)
      formDataToSend.append('student[fatherPhone]', formData.fatherPhone)
      formDataToSend.append('student[motherPhone]', formData.motherPhone)
      formDataToSend.append('student[dateJoined]', formData.dateJoined)
      
      // Add avatar file if selected
      if (formData.avatar) {
        formDataToSend.append('student[avatar]', formData.avatar)
      }
      
      router.post('/students', formDataToSend, {
        forceFormData: true
      })
    } catch (error) {
      console.error('Error creating student:', error)
      setIsSubmitting(false)
    }
  }

  const handleBackClick = () => {
    router.visit('/students')
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="flex flex-col space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Student</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Create a new student profile and add to the system</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4 sm:gap-0">
            <Button
              variant="outline"
              className="border-gray-200/60 cursor-pointer"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Students</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <NewStudentForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
          />

          {/* Submit Actions */}
          <Card className="border-gray-200/60 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer border-gray-200/60"
                  onClick={handleBackClick}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create Student"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
