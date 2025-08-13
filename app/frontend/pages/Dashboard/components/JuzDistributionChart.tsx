import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { BookOpen } from "lucide-react"

interface JuzDistribution {
  juz: string
  students: number
}

interface JuzDistributionChartProps {
  data: JuzDistribution[]
}

// Colors for the pie chart
const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#6366f1"]

export function JuzDistributionChart({ data }: JuzDistributionChartProps) {
  // Transform data for the chart
  const chartData = data.map((item, index) => ({
    name: item.juz,
    value: item.students,
    color: colors[index % colors.length]
  }))

  return (
    <Card className="border-gray-200/60 shadow-lg ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Student Juz Distribution
        </CardTitle>
        <CardDescription>Student distribution based on current memorization juz</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              labelStyle={{ fontSize: '13px' }}
              contentStyle={{ fontSize: '13px' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
