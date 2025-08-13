import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { CalendarIcon } from "lucide-react"

interface DailySubmission {
  date: string
  submissions: number
}

interface DailySubmissionsChartProps {
  data: DailySubmission[]
}

export function DailySubmissionsChart({ data }: DailySubmissionsChartProps) {

  return (
    <Card className="col-span-2 border-gray-200/60 shadow-lg">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Daily Submissions
          </CardTitle>
          <CardDescription>Number of student activities submitted per day (last 7 days)</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelStyle={{ fontSize: '12px' }}
              contentStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
