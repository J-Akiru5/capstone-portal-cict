import { createServerClient } from "@capstone/auth/server"
import { prisma } from "@capstone/database"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Button } from "@capstone/ui/components/button"
import { Badge } from "@capstone/ui/components/badge"
import { FileText, Users, ClipboardCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function FacultyDashboard() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const faculty = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      advisedGroups: {
        include: {
          project: { include: { documentVersions: { orderBy: { createdAt: "desc" }, take: 1 } } },
          members: { include: { user: true } }
        }
      },
      panelAssignments: {
        include: {
          project: { include: { group: true } }
        }
      }
    }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-outfit">Faculty Workspace</h1>
          <p className="text-muted-foreground">Manage your advisees and panel evaluation assignments.</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary px-3 py-1">
          {faculty?.facultyPosition?.replace(/_/g, " ") || "Faculty"}
        </Badge>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Advised Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faculty?.advisedGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No groups currently assigned.</p>
            ) : (
              faculty?.advisedGroups.map((g) => (
                <div key={g.id} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">{g.name || "Unnamed Group"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {g.members.length} members
                      </p>
                      {g.project && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          Project: {g.project.title}
                        </p>
                      )}
                    </div>
                    {g.project && (
                      <Link href={`/faculty/evaluate/${g.project.documentVersions[0]?.id || ""}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <FileText className="w-3 h-3" /> Review
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" /> Panel Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faculty?.panelAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No panel assignments yet.</p>
            ) : (
              faculty?.panelAssignments.map((pa) => (
                <div key={pa.id} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">{pa.project.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Group: {pa.project.group?.name || "N/A"}
                      </p>
                      <Badge variant="outline" className="text-[9px] mt-2">
                        {pa.status}
                      </Badge>
                    </div>
                    <Link href={`/faculty/evaluate/project/${pa.projectId}`}>
                      <Button size="sm" className="gap-1">
                        Evaluate <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
