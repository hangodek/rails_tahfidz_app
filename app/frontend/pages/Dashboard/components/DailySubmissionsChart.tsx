import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { CalendarIcon, ChevronDown } from "lucide-react"

// Generate daily pages data for date range
const generateDailyPages = (startDate: Date, endDate: Date) => {
  const data = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    data.push({
      date: format(currentDate, "dd/MM"),
      fullDate: format(currentDate, "yyyy-MM-dd"),
      pages: Math.floor(Math.random() * 30) + 20, // Random data between 20-50 pages
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return data
}

export function DailySubmissionsChart() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  })

  const dailyPages = generateDailyPages(dateRange.from, dateRange.to)

  return (
    <Card className="col-span-2 border-gray-200/60 shadow-lg">
      <CardHeader>
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Daily Memorized Pages
            </CardTitle>
            <CardDescription>Number of Quran pages memorized by all students per day</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-200/60 cursor-pointer w-full md:w-auto">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span className="text-xs sm:text-sm">
                  {format(dateRange.from, "dd MMM", { locale: id })} -{" "}
                  {format(dateRange.to, "dd MMM", { locale: id })}
                </span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200/60" align="end">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange((prev) => ({ ...prev, from: date }))}
                    locale={id}
                    className="border-gray-200/60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange((prev) => ({ ...prev, to: date }))}
                    locale={id}
                    className="border-gray-200/60"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-200/60 cursor-pointer text-xs"
                    onClick={() =>
                      setDateRange({
                        from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                        to: new Date(),
                      })
                    }
                  >
                    7 Days
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-200/60 cursor-pointer text-xs"
                    onClick={() =>
                      setDateRange({
                        from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
                        to: new Date(),
                      })
                    }
                  >
                    30 Days
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyPages} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            <Bar dataKey="pages" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
