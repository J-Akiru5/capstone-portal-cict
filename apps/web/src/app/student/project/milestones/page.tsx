import { createServerClient } from "@capstone/auth"
import { prisma } from "@capstone/database"
import { KanbanBoard } from "./kanban-board"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"

export default async function MilestonesPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return null

  const member = await prisma.groupMember.findFirst({
    where: { userId: session.user.id },
    include: {
      group: {
        include: {
          project: {
            include: {
              milestones: {
                orderBy: { dueDate: "asc" }
              }
            }
          }
        }
      }
    }
  })

  const group = member?.group
  const project = group?.project
  const milestones = project?.milestones || []

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-outfit">Milestone Tracker</h1>
        <p className="text-muted-foreground">Plan and track your research deliverables using the Kanban board.</p>
      </div>

      {!project ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Please propose a title first to enable milestone tracking.</p>
        </Card>
      ) : (
        <KanbanBoard initialMilestones={milestones} />
      )}
    </div>
  )
}
