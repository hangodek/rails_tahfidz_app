import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Target } from "lucide-react"

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

interface ProgramInformationFormProps {
  formData: StudentFormData
  errors: Partial<StudentFormData>
  handleInputChange: (field: keyof StudentFormData, value: string) => void
}

export function ProgramInformationForm({ formData, errors, handleInputChange }: ProgramInformationFormProps) {
  const handleDateJoinedChange = (date: Date | undefined) => {
    if (date) {
      // Use local date formatting to avoid timezone issues
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      handleInputChange("date_joined", formattedDate)
    } else {
      handleInputChange("date_joined", "")
    }
  }

  const selectedDateJoined = formData.date_joined ? new Date(formData.date_joined + 'T12:00:00') : undefined

  return (
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
            <DatePicker
              id="date_joined"
              date={selectedDateJoined}
              onDateChange={handleDateJoinedChange}
              placeholder="Select date joined"
              className={`cursor-pointer border-gray-200/60 ${errors.date_joined ? "border-red-500" : ""}`}
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
              max="604"
              value={formData.hifz_in_page}
              onChange={(e) => handleInputChange("hifz_in_page", e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Enter current page in ongoing Juz (0-604)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
