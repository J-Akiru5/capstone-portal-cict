"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Badge } from "@capstone/ui/components/badge"
import { Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react"
import { MilestoneStatus } from "@prisma/client"

import { updateMilestoneStatus, createMilestone } from "./actions"
import { toast } from "sonner"

interface Milestone {
  id: string
  title: string
  description: string | null
  status: MilestoneStatus
  dueDate: Date | null
}

const COLUMNS = [
  { id: MilestoneStatus.TODO, title: "To Do", icon: <Clock className="w-4 h-4" /> },
  { id: MilestoneStatus.IN_PROGRESS, title: "In Progress", icon: <AlertCircle className="w-4 h-4 text-amber-500" /> },
  { id: MilestoneStatus.COMPLETED, title: "Done", icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
]

export function KanbanBoard({ initialMilestones, projectId }: { initialMilestones: Milestone[], projectId: string }) {
  const [milestones, setMilestones] = useState(initialMilestones)
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId === destination.droppableId) return

    const newStatus = destination.droppableId as MilestoneStatus
    
    // Optimistic Update
    const oldMilestones = [...milestones]
    const updatedMilestones = milestones.map(m => 
      m.id === draggableId ? { ...m, status: newStatus } : m
    )
    setMilestones(updatedMilestones)

    try {
      await updateMilestoneStatus(draggableId, newStatus)
      toast.success("Status updated")
    } catch (error) {
      setMilestones(oldMilestones)
      toast.error("Failed to update status")
    }
  }

  const handleAddMilestone = async () => {
    if (!newTitle.trim()) return
    
    try {
      const created = await createMilestone({
        title: newTitle,
        projectId
      })
      setMilestones([...milestones, created])
      setNewTitle("")
      setIsAdding(false)
      toast.success("Task added")
    } catch (error) {
      toast.error("Failed to add task")
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold flex items-center gap-2">
                {col.icon} {col.title}
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {milestones.filter(m => m.status === col.id).length}
                </span>
              </h3>
            </div>

            <Droppable droppableId={col.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-muted/30 p-3 rounded-xl min-h-[500px] border-2 border-dashed border-transparent transition-colors"
                >
                  {milestones
                    .filter((m) => m.status === col.id)
                    .map((m, index) => (
                      <Draggable key={m.id} draggableId={m.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
                              snapshot.isDragging && "shadow-2xl border-primary ring-2 ring-primary/20"
                            )}
                          >
                            <CardContent className="p-4">
                              <h4 className="text-sm font-bold leading-tight">{m.title}</h4>
                              {m.description && (
                                <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">
                                  {m.description}
                                </p>
                              )}
                              {m.dueDate && (
                                <div className="mt-3 flex items-center gap-1 text-[9px] text-muted-foreground font-medium">
                                  <Clock className="w-3 h-3" />
                                  {new Date(m.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  
                  {col.id === MilestoneStatus.TODO && (
                    <div className="mt-2">
                      {isAdding ? (
                        <div className="bg-card p-3 rounded-lg border shadow-sm animate-in zoom-in-95">
                          <input
                            autoFocus
                            className="w-full text-xs p-2 rounded border mb-2 outline-none focus:ring-1 focus:ring-primary"
                            placeholder="What needs to be done?"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" className="h-7 text-[10px]" onClick={handleAddMilestone}>Save</Button>
                            <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setIsAdding(false)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsAdding(true)}
                          className="w-full py-3 border-2 border-dashed rounded-lg text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-xs font-medium"
                        >
                          <Plus className="w-4 h-4" /> Add Task
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
