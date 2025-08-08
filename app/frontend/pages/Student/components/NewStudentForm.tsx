import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { User, Upload } from "lucide-react"
import { useState } from "react"

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

interface NewStudentFormProps {
  formData: StudentFormData
  errors: Partial<StudentFormData>
  handleInputChange: (field: keyof StudentFormData, value: string) => void
  handleFileChange: (file: File | null) => void
}

export function NewStudentForm({ formData, errors, handleInputChange, handleFileChange }: NewStudentFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleDateChange = (field: 'birthDate' | 'dateJoined') => (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      handleInputChange(field, formattedDate)
    } else {
      handleInputChange(field, "")
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileChange(file)
    
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setAvatarPreview(null)
    }
  }

  const selectedBirthDate = formData.birthDate ? new Date(formData.birthDate + 'T12:00:00') : undefined
  const selectedDateJoined = formData.dateJoined ? new Date(formData.dateJoined + 'T12:00:00') : undefined

  const classes = ["Class A", "Class B", "Class C"]
  const statuses = ["active", "inactive", "graduated"]
  const genders = ["male", "female"]

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <Card className="border-gray-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Student Photo
          </CardTitle>
          <CardDescription>
            Upload a profile photo for the student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: Square image, max 5MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="border-gray-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Student's personal details
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
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className={`cursor-pointer border-gray-300/60 ${errors.gender ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="border-gray-200/60">
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender} className="cursor-pointer" >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace">Place of Birth *</Label>
              <Input
                id="birthPlace"
                value={formData.birthPlace}
                onChange={(e) => handleInputChange("birthPlace", e.target.value)}
                placeholder="Enter place of birth"
                className={errors.birthPlace ? "border-red-500" : ""}
              />
              {errors.birthPlace && <p className="text-sm text-red-500">{errors.birthPlace}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Date of Birth *</Label>
              <DatePicker
                id="birthDate"
                date={selectedBirthDate}
                onDateChange={handleDateChange('birthDate')}
                placeholder="Select date of birth"
                className={`cursor-pointer border-gray-300/60 ${errors.birthDate ? "border-red-500" : ""}`}
              />
              {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="e.g., 081234567890"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="student@email.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
            <User className="h-5 w-5" />
            Parent Information
          </CardTitle>
          <CardDescription>
            Information about student's parents or guardians
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name *</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange("fatherName", e.target.value)}
                placeholder="Enter father's full name"
                className={errors.fatherName ? "border-red-500" : ""}
              />
              {errors.fatherName && <p className="text-sm text-red-500">{errors.fatherName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherName">Mother's Name *</Label>
              <Input
                id="motherName"
                value={formData.motherName}
                onChange={(e) => handleInputChange("motherName", e.target.value)}
                placeholder="Enter mother's full name"
                className={errors.motherName ? "border-red-500" : ""}
              />
              {errors.motherName && <p className="text-sm text-red-500">{errors.motherName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherPhone">Father's Phone *</Label>
              <Input
                id="fatherPhone"
                value={formData.fatherPhone}
                onChange={(e) => handleInputChange("fatherPhone", e.target.value)}
                placeholder="e.g., 081234567890"
                className={errors.fatherPhone ? "border-red-500" : ""}
              />
              {errors.fatherPhone && <p className="text-sm text-red-500">{errors.fatherPhone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherPhone">Mother's Phone *</Label>
              <Input
                id="motherPhone"
                value={formData.motherPhone}
                onChange={(e) => handleInputChange("motherPhone", e.target.value)}
                placeholder="e.g., 081234567890"
                className={errors.motherPhone ? "border-red-500" : ""}
              />
              {errors.motherPhone && <p className="text-sm text-red-500">{errors.motherPhone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="border-gray-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Academic Information
          </CardTitle>
          <CardDescription>
            Class and program information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
                <SelectTrigger className={`cursor-pointer ${errors.class ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="border-gray-200/60">
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls} className="cursor-pointer">
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="border-gray-200/60">
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status} className="cursor-pointer">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateJoined">Date Joined *</Label>
              <DatePicker
                id="dateJoined"
                date={selectedDateJoined}
                onDateChange={handleDateChange('dateJoined')}
                placeholder="Select date joined"
                className={`cursor-pointer border-gray-300/60 ${errors.dateJoined ? "border-red-500" : ""}`}
              />
              {errors.dateJoined && <p className="text-sm text-red-500">{errors.dateJoined}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_hifz_in_juz">Current Juz Memorized</Label>
              <Input
                id="current_hifz_in_juz"
                type="number"
                min="0"
                max="30"
                value={formData.current_hifz_in_juz}
                onChange={(e) => handleInputChange("current_hifz_in_juz", e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Enter number of Juz completed (0-30)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_hifz_in_pages">Current Pages in Juz</Label>
              <Input
                id="current_hifz_in_pages"
                type="number"
                min="0"
                max="20"
                value={formData.current_hifz_in_pages}
                onChange={(e) => handleInputChange("current_hifz_in_pages", e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Enter current pages in ongoing Juz (0-20)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
