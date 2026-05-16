"use server"

import { createServerClient } from "@capstone/auth/server"
import { prisma, DefenseVerdict } from "@capstone/database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitEvaluation(data: {
  projectId: string
  rubricId: string
  scores: { criteriaId: string, score: number, comment?: string }[]
  verdict: DefenseVerdict
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  // 1. Calculate total score (weighted average)
  const rubric = await prisma.evaluationRubric.findUnique({
    where: { id: data.rubricId },
    include: { criteria: true }
  })
  if (!rubric) throw new Error("Rubric not found")

  const totalWeight = rubric.criteria.reduce((sum, c) => sum + c.weight, 0)
  const totalScore = data.scores.reduce((sum, s) => {
    const criterion = rubric.criteria.find(c => c.id === s.criteriaId)
    return sum + (s.score * (criterion?.weight || 0))
  }, 0) / (totalWeight || 1)

  // 2. Create the main evaluation record
  const evaluation = await prisma.evaluation.create({
    data: {
      projectId: data.projectId,
      rubricId: data.rubricId,
      panelistId: session.user.id,
      verdict: data.verdict,
      totalScore: Math.round(totalScore * 10) / 10,
      scores: {
        create: data.scores.map(s => ({
          criterionId: s.criteriaId,
          score: s.score,
          comment: s.comment
        }))
      }
    }
  })

  // 3. Update project status if this is a Pass
  if (data.verdict === DefenseVerdict.PASS) {
    await prisma.capstoneProject.update({
      where: { id: data.projectId },
      data: { status: "IN_PROGRESS" }
    })
  }

  revalidatePath(`/faculty/evaluate/project/${data.projectId}`)
  redirect("/faculty/dashboard")
}
