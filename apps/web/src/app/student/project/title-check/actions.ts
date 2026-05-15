"use server"

import { createServerClient } from "@capstone/auth"
import { redirect } from "next/navigation"
import { prisma } from "@capstone/database"

export type SimilarityResult = {
  id: string
  title: string
  year: number
  similarity: number
}

export async function checkTitleSimilarity(title: string) {
  if (!title || title.length < 5) return []

  try {
    const results = await prisma.$queryRawUnsafe<SimilarityResult[]>(
      `SELECT * FROM search_similar_titles($1, 0.2)`,
      title
    )
    return results
  } catch (error) {
    console.error("Error checking similarity:", error)
    return []
  }
}

export async function submitTitleProposal(title: string, abstract: string) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  // Find the group the student belongs to
  const member = await prisma.groupMember.findFirst({
    where: { userId: session.user.id },
    include: { group: true }
  })

  if (!member) throw new Error("No group found for user")

  // Check if project exists or create new one
  await prisma.capstoneProject.upsert({
    where: { groupId: member.groupId },
    update: {
      title,
      abstract,
      status: "TITLE_PROPOSAL"
    },
    create: {
      groupId: member.groupId,
      title,
      abstract,
      status: "TITLE_PROPOSAL"
    }
  })

  redirect("/student/dashboard")
}
