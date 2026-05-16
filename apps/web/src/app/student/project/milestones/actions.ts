"use server"

import { createServerClient } from "@capstone/auth/server"
import { prisma } from "@capstone/database"
import { MilestoneStatus } from "@capstone/database"
import { revalidatePath } from "next/cache"

export async function updateMilestoneStatus(id: string, status: MilestoneStatus) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  await prisma.milestone.update({
    where: { id },
    data: { status }
  })

  revalidatePath("/student/project/milestones")
}

export async function createMilestone(data: {
  title: string
  description?: string
  dueDate?: string
  projectId: string
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  const maxOrder = await prisma.milestone.aggregate({
    where: { projectId: data.projectId },
    _max: { order: true }
  })

  const milestone = await prisma.milestone.create({
    data: {
      ...data,
      order: (maxOrder._max.order ?? 0) + 1,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      status: MilestoneStatus.TODO
    }
  })

  revalidatePath("/student/project/milestones")
  return milestone
}
