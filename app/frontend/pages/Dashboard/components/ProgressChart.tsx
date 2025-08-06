import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { TrendingUp } from "lucide-react"

// Global murajaah data (would come from Rails props)
const globalMurajaahData = [
  { month: "Jan", recited: 45 },
  { month: "Feb", recited: 52 },
  { month: "Mar", recited: 68 },
  { month: "Apr", recited: 71 },
  { month: "May", recited: 84 },
  { month: "Jun", recited: 92 },
]

export function ProgressChart() {
  return (
    <Card className="border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Murajaah Progress
        </CardTitle>
        <CardDescription>Total juz recited by all students per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={globalMurajaahData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
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
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Line type="monotone" dataKey="recited" stroke="#10b981" strokeWidth={3} name="Recited Juz" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
