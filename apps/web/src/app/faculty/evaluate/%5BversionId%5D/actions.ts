"use server"

import { createServerClient } from "@capstone/auth"
import { prisma } from "@capstone/database"
import { revalidatePath } from "next/cache"

export async function saveAnnotation(data: {
  versionId: string
  paragraphId: string
  content: string
  selectedText?: string
}) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  const annotation = await prisma.annotation.create({
    data: {
      versionId: data.versionId,
      paragraphId: data.paragraphId,
      content: data.content,
      selectedText: data.selectedText,
      authorId: session.user.id
    }
  })

  revalidatePath(`/faculty/evaluate/${data.versionId}`)
  return annotation
}

export async function deleteAnnotation(id: string, versionId: string) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  await prisma.annotation.delete({
    where: { id }
  })

  revalidatePath(`/faculty/evaluate/${versionId}`)
}
