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
  class_level: string
  phone: string
  email: string
  status: string
  gender: string
  birth_place: string
  birth_date: string
  address: string
  father_name: string
  mother_name: string
  father_phone: string
  mother_phone: string
  date_joined: string
}

interface NewStudentFormProps {
  formData: StudentFormData
  errors: Partial<StudentFormData>
  handleInputChange: (field: keyof StudentFormData, value: string) => void
  handleFileChange: (file: File | null) => void
}

export function NewStudentForm({ formData, errors, handleInputChange, handleFileChange }: NewStudentFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleDateChange = (field: 'birth_date' | 'date_joined') => (date: Date | undefined) => {
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

  const selectedBirthDate = formData.birth_date ? new Date(formData.birth_date + 'T12:00:00') : undefined
  const selectedDateJoined = formData.date_joined ? new Date(formData.date_joined + 'T12:00:00') : undefined

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
              <Label htmlFor="birth_place">Place of Birth *</Label>
              <Input
                id="birth_place"
                value={formData.birth_place}
                onChange={(e) => handleInputChange("birth_place", e.target.value)}
                placeholder="Enter place of birth"
                className={errors.birth_place ? "border-red-500" : ""}
              />
              {errors.birth_place && <p className="text-sm text-red-500">{errors.birth_place}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Date of Birth *</Label>
              <DatePicker
                id="birth_date"
                date={selectedBirthDate}
                onDateChange={handleDateChange('birth_date')}
                placeholder="Select date of birth"
                className={`cursor-pointer border-gray-300/60 ${errors.birth_date ? "border-red-500" : ""}`}
              />
              {errors.birth_date && <p className="text-sm text-red-500">{errors.birth_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
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
              <Label htmlFor="email">Email Address</Label>
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
            <Label htmlFor="address">Address</Label>
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

            <div className="space-y-2">
              <Label htmlFor="father_phone">Father's Phone</Label>
              <Input
                id="father_phone"
                value={formData.father_phone}
                onChange={(e) => handleInputChange("father_phone", e.target.value)}
                placeholder="e.g., 081234567890"
                className={errors.father_phone ? "border-red-500" : ""}
              />
              {errors.father_phone && <p className="text-sm text-red-500">{errors.father_phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mother_phone">Mother's Phone</Label>
              <Input
                id="mother_phone"
                value={formData.mother_phone}
                onChange={(e) => handleInputChange("mother_phone", e.target.value)}
                placeholder="e.g., 081234567890"
                className={errors.mother_phone ? "border-red-500" : ""}
              />
              {errors.mother_phone && <p className="text-sm text-red-500">{errors.mother_phone}</p>}
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
              <Select value={formData.class_level} onValueChange={(value) => handleInputChange("class_level", value)}>
                <SelectTrigger className={`cursor-pointer ${errors.class_level ? "border-red-500" : ""}`}>
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
              {errors.class_level && <p className="text-sm text-red-500">{errors.class_level}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
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
              <Label htmlFor="date_joined">Date Joined *</Label>
              <DatePicker
                id="date_joined"
                date={selectedDateJoined}
                onDateChange={handleDateChange('date_joined')}
                placeholder="Select date joined"
                className={`cursor-pointer border-gray-300/60 ${errors.date_joined ? "border-red-500" : ""}`}
              />
              {errors.date_joined && <p className="text-sm text-red-500">{errors.date_joined}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_hifz_in_juz">Current Juz Memorized *</Label>
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
              <Label htmlFor="current_hifz_in_pages">Current Pages in Juz *</Label>
              <Input
                id="current_hifz_in_pages"
                type="number"
                min="0"
                max="604"
                value={formData.current_hifz_in_pages}
                onChange={(e) => handleInputChange("current_hifz_in_pages", e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Enter current pages in ongoing Juz (0-604)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
