"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Badge } from "@capstone/ui/components/badge"
import { Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react"
import { MilestoneStatus } from "@prisma/client"

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

export function KanbanBoard({ initialMilestones }: { initialMilestones: Milestone[] }) {
  const [milestones, setMilestones] = useState(initialMilestones)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId === destination.droppableId) return

    const newStatus = destination.droppableId as MilestoneStatus
    const updatedMilestones = milestones.map(m => 
      m.id === draggableId ? { ...m, status: newStatus } : m
    )
    
    setMilestones(updatedMilestones)
    // TODO: Call Server Action to sync with DB
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
                    <button className="w-full py-3 border-2 border-dashed rounded-lg text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-xs font-medium mt-2">
                      <Plus className="w-4 h-4" /> Add Task
                    </button>
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
