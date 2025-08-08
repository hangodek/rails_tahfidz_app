"use client"

import { useState } from "react"
import { router } from "@inertiajs/react"
import {
  StudentFormHeader,
  StudentInformationForm,
  ParentInformationForm,
  ProgramInformationForm,
  StudentFormActions,
} from "./components"

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

    if (!formData.name.trim()) newErrors.name = "Student name is required"
    if (!formData.birth_date) newErrors.birth_date = "Date of birth is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.father_name.trim()) newErrors.father_name = "Father's name is required"
    if (!formData.mother_name.trim()) newErrors.mother_name = "Mother's name is required"
    if (!formData.date_joined) newErrors.date_joined = "Date joined is required"

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
        <StudentFormHeader />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <StudentInformationForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          {/* Parent Information */}
          <ParentInformationForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          {/* Program Information */}
          <ProgramInformationForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          {/* Submit Button */}
          <StudentFormActions isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  )
}
