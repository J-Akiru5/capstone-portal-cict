import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Button } from "@capstone/ui/components/button"
import { Badge } from "@capstone/ui/components/badge"
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight, User } from "lucide-react"

export default function DefenseSchedulingPage() {
  const mockSchedules = [
    { id: "1", time: "09:00 AM", group: "Team Aquaculture AI", stage: "Title Defense", venue: "CICT Conf. Room", panelists: ["Jose Rizal", "Andres Bonifacio"] },
    { id: "2", time: "11:00 AM", group: "Team AgriBot", stage: "Pre-Oral Defense", venue: "Virtual Room A", panelists: ["Melchora Aquino", "Juan Luna"] },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-outfit">Defense Scheduler</h1>
          <p className="text-muted-foreground">Manage and coordinate all departmental defense schedules.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Schedule New Defense
        </Button>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <CardTitle className="text-sm">May 2026</CardTitle>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-6 w-6"><ChevronLeft className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" className="h-6 w-6"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: 31 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors ${i === 14 ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20" : ""}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Scheduled for May 15, 2026</h2>
          </div>

          <div className="space-y-4">
            {mockSchedules.map((s) => (
              <Card key={s.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-muted/50 p-6 flex flex-col items-center justify-center border-r md:w-32">
                      <p className="text-lg font-black text-primary font-outfit leading-none">{s.time.split(' ')[0]}</p>
                      <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{s.time.split(' ')[1]}</p>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className="text-[9px] mb-2 border-primary text-primary">
                            {s.stage}
                          </Badge>
                          <h3 className="text-xl font-bold font-outfit">{s.group}</h3>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>

                      <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary/60" /> {s.venue}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary/60" /> 2 Hours Duration
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Panelists:</span>
                        {s.panelists.map((p) => (
                          <div key={p} className="flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded text-[10px] font-medium border border-primary/10">
                            <User className="w-3 h-3" /> {p}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
