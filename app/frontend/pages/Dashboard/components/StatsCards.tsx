import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, TrendingUp } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Setoran Hari Ini</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            67 <span className="text-lg font-normal text-muted-foreground">Juz</span>
          </div>
          <p className="text-xs text-muted-foreground">+15% dari kemarin</p>
        </CardContent>
      </Card>

      <Card className="border-gray-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress Keseluruhan</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">78%</div>
          <p className="text-xs text-muted-foreground">+5% dari bulan lalu</p>
        </CardContent>
      </Card>
    </div>
  )
}
