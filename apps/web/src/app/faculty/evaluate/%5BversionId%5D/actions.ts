"use server"

import { createServerClient } from "@capstone/auth/server"
import { prisma } from "@capstone/database"
import { revalidatePath } from "next/cache"

export async function saveAnnotation(data: {
  versionId: string
  paragraphId: string
  content: string
  selectedText?: string
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  const paragraphIndex = parseInt(data.paragraphId.replace("p-", ""))

  const annotation = await prisma.documentAnnotation.create({
    data: {
      documentVersionId: data.versionId,
      paragraphIndex: paragraphIndex,
      comment: data.content,
      selectedText: data.selectedText,
      authorId: session.user.id
    }
  })

  revalidatePath(`/faculty/evaluate/${data.versionId}`)
  return annotation
}

export async function deleteAnnotation(id: string, versionId: string) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  await prisma.documentAnnotation.delete({
    where: { id }
  })

  revalidatePath(`/faculty/evaluate/${versionId}`)
}
