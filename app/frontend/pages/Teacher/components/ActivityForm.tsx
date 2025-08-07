import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save } from "lucide-react"

interface ActivityType {
  value: string
  label: string
  color: string
}

interface ActivityDetails {
  surah: string
  ayatFrom: string
  ayatTo: string
  juz: string
  notes: string
  evaluation: string
}

interface ActivityFormProps {
  activityType: string
  setActivityType: (value: string) => void
  activityTypes: ActivityType[]
  surahList: string[]
  activityDetails: ActivityDetails
  setActivityDetails: (details: ActivityDetails | ((prev: ActivityDetails) => ActivityDetails)) => void
  handleSaveActivity: () => void
}

export function ActivityForm({
  activityType,
  setActivityType,
  activityTypes,
  surahList,
  activityDetails,
  setActivityDetails,
  handleSaveActivity,
}: ActivityFormProps) {
  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Activity
        </CardTitle>
        <CardDescription>Record student memorization activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Activity Type</Label>
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="border-gray-200/60 cursor-pointer">
              <SelectValue placeholder="Select activity type..." />
            </SelectTrigger>
            <SelectContent className="border-gray-200/60">
              {activityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {activityType && (
          <>
            {(activityType === "setoran_baru" ||
              activityType === "muroja" ||
              activityType === "menyelesaikan_ayat") && (
              <>
                <div className="space-y-2">
                  <Label>Surah</Label>
                  <Select
                    value={activityDetails.surah}
                    onValueChange={(value) => setActivityDetails((prev) => ({ ...prev, surah: value }))}
                  >
                    <SelectTrigger className="border-gray-200/60 cursor-pointer">
                      <SelectValue placeholder="Select surah..." />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200/60">
                      {surahList.map((surah, index) => (
                        <SelectItem key={index} value={surah} className="cursor-pointer">
                          {index + 1}. {surah}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Verse From</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={activityDetails.ayatFrom}
                      onChange={(e) => setActivityDetails((prev) => ({ ...prev, ayatFrom: e.target.value }))}
                      className="border-gray-200/60 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Verse To</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={activityDetails.ayatTo}
                      onChange={(e) => setActivityDetails((prev) => ({ ...prev, ayatTo: e.target.value }))}
                      className="border-gray-200/60 text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {activityType === "menyelesaikan_juz" && (
              <div className="space-y-2">
                <Label>Juz</Label>
                <Select
                  value={activityDetails.juz}
                  onValueChange={(value) => setActivityDetails((prev) => ({ ...prev, juz: value }))}
                >
                  <SelectTrigger className="border-gray-200/60">
                    <SelectValue placeholder="Select juz..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Juz {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add notes about this activity..."
                value={activityDetails.notes}
                onChange={(e) => setActivityDetails((prev) => ({ ...prev, notes: e.target.value }))}
                className="border-gray-200/60"
              />
            </div>

            <div className="space-y-2">
              <Label>Evaluation</Label>
              <Select
                value={activityDetails.evaluation}
                onValueChange={(value) => setActivityDetails((prev) => ({ ...prev, evaluation: value }))}
              >
                <SelectTrigger className="border-gray-200/60 cursor-pointer">
                  <SelectValue placeholder="Select evaluation..." />
                </SelectTrigger>
                <SelectContent className="border-gray-200/60">
                  <SelectItem value="sangat_baik" className="cursor-pointer">Excellent</SelectItem>
                  <SelectItem value="baik" className="cursor-pointer">Good</SelectItem>
                  <SelectItem value="cukup" className="cursor-pointer">Fair</SelectItem>
                  <SelectItem value="perlu_perbaikan" className="cursor-pointer">Needs Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSaveActivity} className="w-full cursor-pointer text-sm sm:text-base">
              <Save className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Save Activity</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
