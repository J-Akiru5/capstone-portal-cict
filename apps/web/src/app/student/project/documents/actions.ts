"use server"

import { createServerClient } from "@capstone/auth"
import { prisma } from "@capstone/database"
import { uploadFile } from "@capstone/storage"
import { redirect } from "next/navigation"
import { DocType } from "@prisma/client"

export async function uploadManuscript(formData: FormData) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  const file = formData.get("file") as File
  const groupId = formData.get("groupId") as string
  const docType = formData.get("docType") as DocType || DocType.FULL_MANUSCRIPT

  if (!file || !groupId) throw new Error("Missing file or group ID")

  // 1. Get project
  const project = await prisma.capstoneProject.findUnique({
    where: { groupId }
  })

  if (!project) throw new Error("Project not found")

  // 2. Upload to Supabase Storage
  const path = `${groupId}/${Date.now()}-${file.name}`
  const { data, error } = await uploadFile(supabase, "manuscripts", path, file)

  if (error) throw new Error(`Upload failed: ${error.message}`)

  // 3. Create database record for document version
  await prisma.documentVersion.create({
    data: {
      projectId: project.id,
      version: 1, // We should calculate actual version number in a real app
      fileUrl: path,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      docType: docType,
      uploadedById: session.user.id,
    }
  })

  // 4. Update project status if needed
  await prisma.capstoneProject.update({
    where: { id: project.id },
    data: { status: "DOCUMENT_SUBMITTED" }
  })

  redirect("/student/project/documents")
}
