import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"

export function NoStudentsFound() {
  return (
    <Card className="border-gray-200/60 shadow-lg">
      <CardContent className="text-center py-8 sm:py-12">
        <User className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium mb-2">No students found</h3>
        <p className="text-sm text-muted-foreground">Try changing your filters or search keywords</p>
      </CardContent>
    </Card>
  )
}
