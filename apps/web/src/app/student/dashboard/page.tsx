import { createServerClient } from "@capstone/auth/server"
import { prisma } from "@capstone/database"
import { Button } from "@capstone/ui/components/button"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@capstone/ui/components/card"
import { Badge } from "@capstone/ui/components/badge"
import { FileText, Users, Calendar, CheckCircle2 } from "lucide-react"

export default async function StudentDashboard() {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      groupMemberships: {
        include: {
          group: {
            include: {
              project: true,
              members: { include: { user: true } },
              adviser: true
            }
          }
        }
      }
    }
  })

  const group = user?.groupMemberships[0]?.group
  const project = group?.project

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-outfit">Student Workspace</h1>
          <p className="text-muted-foreground">Manage your capstone journey and research progress.</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary px-3 py-1">
          SY 2025-2026
        </Badge>
      </header>

      {!group ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Group Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You are not currently assigned to a capstone group. Please contact your 
              Program Chair or form a group to get started.
            </p>
            <Button>Request Group Formation</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Project Status */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {project?.title || "No Project Title Yet"}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {group.name} • Adviser: {group.adviser?.firstName} {group.adviser?.lastName}
                  </CardDescription>
                </div>
                <Badge className="bg-primary text-primary-foreground uppercase tracking-wider text-[10px]">
                  {project?.status || "INITIALIZING"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
                  <div className="bg-primary/10 p-2 rounded">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Latest Manuscript</p>
                    <p className="text-xs text-muted-foreground">No documents uploaded yet.</p>
                  </div>
                  <Link href="/student/project/documents">
                    <Button size="sm" variant="outline">Upload</Button>
                  </Link>
                </div>

                {!project && (
                  <div className="p-6 text-center border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground mb-4">
                      Start your journey by proposing a research title.
                    </p>
                    <Link href="/student/project/title-check">
                      <Button variant="default">Propose Title</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Group Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Group Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.members.map((m) => (
                <div key={m.userId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                    {m.user.firstName[0]}{m.user.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">
                      {m.user.firstName} {m.user.lastName}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase">
                      {m.isLeader ? "Leader" : "Member"}
                    </p>
                  </div>
                  {m.isLeader && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
