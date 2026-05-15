"use server"

import { createServerClient } from "@capstone/auth"
import { prisma, DefenseStage, EvaluationVerdict } from "@capstone/database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitEvaluation(data: {
  projectId: string
  stage: DefenseStage
  scores: { criteriaId: string, score: number, comment?: string }[]
  verdict: EvaluationVerdict
  generalComments?: string
}) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  // 1. Create the main evaluation record
  const evaluation = await prisma.evaluation.create({
    data: {
      projectId: data.projectId,
      stage: data.stage,
      panelistId: session.user.id,
      verdict: data.verdict,
      comments: data.generalComments,
      scores: {
        create: data.scores.map(s => ({
          criteriaId: s.criteriaId,
          score: s.score,
          comment: s.comment
        }))
      }
    }
  })

  // 2. Update project status if this is a Pass
  if (data.verdict === EvaluationVerdict.PASS) {
    const nextStageMap: Record<DefenseStage, DefenseStage | null> = {
      [DefenseStage.TITLE_DEFENSE]: DefenseStage.PRE_ORAL,
      [DefenseStage.PRE_ORAL]: DefenseStage.TECHNICAL_DEFENSE,
      [DefenseStage.TECHNICAL_DEFENSE]: DefenseStage.FINAL_DEFENSE,
      [DefenseStage.FINAL_DEFENSE]: null
    }

    const nextStage = nextStageMap[data.stage]
    if (nextStage) {
      await prisma.capstoneProject.update({
        where: { id: data.projectId },
        data: { 
          status: "APPROVED", // Or update to next stage logic
        }
      })
    }
  }

  revalidatePath(`/faculty/evaluate/project/${data.projectId}`)
  redirect("/faculty/dashboard")
}
