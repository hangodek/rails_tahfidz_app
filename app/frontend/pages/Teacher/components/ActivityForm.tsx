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
  pageFrom: string
  pageTo: string
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
  currentStudent?: {
    id: string
    name: string
    class_level: string
    current_hifz_in_juz: string
    current_hifz_in_pages: string
  }
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
  currentStudent,
}: ActivityFormProps) {
  
  const calculateNewProgress = () => {
    if (!activityDetails.juz || !activityDetails.pageTo) return null;
    
    const juz = parseInt(activityDetails.juz);
    const pageTo = parseInt(activityDetails.pageTo);
    
    // For memorization activities, the new progress is simply the page they completed up to
    return { newJuz: juz, newPages: pageTo };
  };

  const validateMemorizationProgress = () => {
    if (activityType !== 'memorization' || !currentStudent) return true;
    
    const newProgress = calculateNewProgress();
    if (!newProgress) return true;
    
    const currentJuz = parseInt(currentStudent.current_hifz_in_juz) || 0;
    const currentPages = parseInt(currentStudent.current_hifz_in_pages) || 0;
    const { newJuz, newPages } = newProgress;
    
    // New progress must be greater than current progress
    if (newJuz < currentJuz || (newJuz === currentJuz && newPages <= currentPages)) {
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = () => {
    if (!selectedStudent || !activityType || !activityDetails.surah || !activityDetails.pageFrom || !activityDetails.pageTo) {
      alert('Please fill in all required fields');
      return;
    }

    if (!validateMemorizationProgress()) {
      alert('New memorization progress must be greater than current progress');
      return;
    }

    const newProgress = calculateNewProgress();

    const activityData = {
      activity_type: activityType,
      activity_grade: evaluationMapping[activityDetails.evaluation as keyof typeof evaluationMapping] || 'excellent',
      surah_name: activityDetails.surah,
      page_from: parseInt(activityDetails.pageFrom),
      page_to: parseInt(activityDetails.pageTo),
      juz: activityDetails.juz ? parseInt(activityDetails.juz) : null,
      notes: activityDetails.notes || '',
      new_hifz_juz: activityType === 'memorization' && newProgress ? newProgress.newJuz : null,
      new_hifz_pages: activityType === 'memorization' && newProgress ? newProgress.newPages : null
    };

    router.post(`/students/${selectedStudent}/activities`, {
      activity: activityData
    }, {
      onSuccess: () => {
        // Reset form
        setActivityDetails({
          surah: "",
          pageFrom: "",
          pageTo: "",
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
                    <Label className="text-xs sm:text-sm">Page From <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={activityDetails.pageFrom}
                      onChange={(e) => setActivityDetails((prev) => ({ ...prev, pageFrom: e.target.value }))}
                      className="border-gray-200/60 text-sm"
                      min="1"
                      max="604"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Page To <span className="text-red-500">*</span></Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={activityDetails.pageTo}
                      onChange={(e) => setActivityDetails((prev) => ({ ...prev, pageTo: e.target.value }))}
                      className="border-gray-200/60 text-sm"
                      min="1"
                      max="604"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Juz {activityType === "memorization" && <span className="text-red-500">*</span>}</Label>
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

                {activityType === "memorization" && currentStudent && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Current Progress: Juz {currentStudent.current_hifz_in_juz}, {currentStudent.current_hifz_in_pages} pages
                    </Label>
                    {activityDetails.juz && activityDetails.pageTo && (() => {
                      const newProgress = calculateNewProgress();
                      return newProgress ? (
                        <div className="text-sm text-muted-foreground">
                          New Progress will be: Juz {newProgress.newJuz}, {newProgress.newPages} pages
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
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
              disabled={
                !selectedStudent || 
                !activityType || 
                !activityDetails.surah || 
                !activityDetails.pageFrom || 
                !activityDetails.pageTo || 
                !activityDetails.evaluation ||
                (activityType === 'memorization' && !activityDetails.juz) ||
                !validateMemorizationProgress()
              }
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
