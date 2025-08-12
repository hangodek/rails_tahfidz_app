import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save } from "lucide-react"
import { router } from "@inertiajs/react"

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
  selectedStudent: string
}

// Map frontend evaluation values to backend enum values
const evaluationMapping = {
  excellent: 'excellent',
  good: 'good', 
  fair: 'fair',
  needs_improvement: 'needs_improvement'
}

export function ActivityForm({
  activityType,
  setActivityType,
  activityTypes,
  surahList,
  activityDetails,
  setActivityDetails,
  handleSaveActivity,
  selectedStudent,
}: ActivityFormProps) {
  
  const handleSubmit = () => {
    if (!selectedStudent || !activityType || !activityDetails.surah || !activityDetails.ayatFrom || !activityDetails.ayatTo) {
      alert('Please fill in all required fields');
      return;
    }

    const activityData = {
      activity_type: activityType,
      activity_grade: evaluationMapping[activityDetails.evaluation as keyof typeof evaluationMapping] || 'excellent',
      surah_name: activityDetails.surah,
      verse_from: parseInt(activityDetails.ayatFrom),
      verse_to: parseInt(activityDetails.ayatTo),
      juz: activityDetails.juz ? parseInt(activityDetails.juz) : null,
      notes: activityDetails.notes || ''
    };

    router.post(`/students/${selectedStudent}/activities`, {
      activity: activityData
    }, {
      onSuccess: () => {
        // Reset form
        setActivityDetails({
          surah: "",
          ayatFrom: "",
          ayatTo: "",
          juz: "",
          notes: "",
          evaluation: "",
        });
        setActivityType("");
        // Also call the original handler for any additional local actions
        handleSaveActivity();
      },
      onError: (errors) => {
        console.error('Failed to save activity:', errors);
        alert('Failed to save activity. Please try again.');
      }
    });
  };

  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Activity
        </CardTitle>
        <CardDescription>Record student activity</CardDescription>
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
            {(activityType === "memorization" ||
              activityType === "revision" ||
              activityType === "evaluation") && (
              <>
                <div className="space-y-2">
                  <Label>Surah <span className="text-red-500">*</span></Label>
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
                    <Label className="text-xs sm:text-sm">Verse From <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={activityDetails.ayatFrom}
                      onChange={(e) => setActivityDetails((prev) => ({ ...prev, ayatFrom: e.target.value }))}
                      className="border-gray-200/60 text-sm"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Verse To <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={activityDetails.ayatTo}
                      onChange={(e) => setActivityDetails((prev) => ({ ...prev, ayatTo: e.target.value }))}
                      className="border-gray-200/60 text-sm"
                      min="1"
                    />
                  </div>
                </div>

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
              </>
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
              <Label>Evaluation <span className="text-red-500">*</span></Label>
              <Select
                value={activityDetails.evaluation}
                onValueChange={(value) => setActivityDetails((prev) => ({ ...prev, evaluation: value }))}
              >
                <SelectTrigger className="border-gray-200/60 cursor-pointer">
                  <SelectValue placeholder="Select evaluation..." />
                </SelectTrigger>
                <SelectContent className="border-gray-200/60">
                  <SelectItem value="excellent" className="cursor-pointer">Excellent</SelectItem>
                  <SelectItem value="good" className="cursor-pointer">Good</SelectItem>
                  <SelectItem value="fair" className="cursor-pointer">Fair</SelectItem>
                  <SelectItem value="needs_improvement" className="cursor-pointer">Needs Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full cursor-pointer text-sm sm:text-base"
              disabled={!selectedStudent || !activityType || !activityDetails.surah || !activityDetails.ayatFrom || !activityDetails.ayatTo || !activityDetails.evaluation}
            >
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
