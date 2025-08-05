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

// Global data (would come from Rails props)
const globalProgressData = [
  { month: "Jan", completed: 8 },
  { month: "Feb", completed: 9 },
  { month: "Mar", completed: 11 },
  { month: "Apr", completed: 12 },
  { month: "Mei", completed: 14 },
  { month: "Jun", completed: 15 },
]

export function ProgressChart() {
  return (
    <Card className="border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progress Hafalan Bulanan
        </CardTitle>
        <CardDescription>Progress hafalan semua siswa per bulan (akumulatif)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={globalProgressData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Juz Selesai" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
