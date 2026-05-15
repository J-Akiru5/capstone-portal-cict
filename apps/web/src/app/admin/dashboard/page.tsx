import { getDashboardStats } from "./data"
import { AnalyticsCharts } from "./charts"
import { Card, CardContent } from "@capstone/ui/components/card"
import { Users, GraduationCap, FolderOpen, CheckCircle2 } from "lucide-react"

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    { label: "Active Projects", value: stats.overview.totalProjects, icon: FolderOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Students", value: stats.overview.totalStudents, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Faculty Mentors", value: stats.overview.totalFaculty, icon: GraduationCap, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Completion Rate", value: `${stats.overview.completionRate}%`, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-outfit">Institutional Analytics</h1>
        <p className="text-muted-foreground">Real-time oversight of the CICT capstone research ecosystem.</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Card key={c.label} className="border-none shadow-md overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${c.bg}`}>
                <c.icon className={`w-6 h-6 ${c.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{c.label}</p>
                <h4 className="text-2xl font-black font-outfit">{c.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <AnalyticsCharts data={stats} />
    </div>
  )
}
