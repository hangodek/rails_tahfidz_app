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

// Juz distribution (30 Juz total) (would come from Rails props)
const juzDistribution = [
  { name: "Juz 1-5", value: 25, color: "#3b82f6" },
  { name: "Juz 6-10", value: 30, color: "#10b981" },
  { name: "Juz 11-15", value: 35, color: "#f59e0b" },
  { name: "Juz 16-20", value: 28, color: "#ef4444" },
  { name: "Juz 21-25", value: 22, color: "#8b5cf6" },
  { name: "Juz 26-30", value: 16, color: "#06b6d4" },
]

export function JuzDistributionChart() {
  return (
    <Card className="border-gray-200/60 shadow-sm">
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
              data={juzDistribution}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {juzDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              labelStyle={{ fontSize: '14px' }}
              contentStyle={{ fontSize: '14px' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
