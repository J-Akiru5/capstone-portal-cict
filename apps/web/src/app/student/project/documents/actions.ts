"use server"

import { createServerClient } from "@capstone/auth/server"
import { prisma } from "@capstone/database"
import { uploadFile, convertDocxToHtml } from "@capstone/storage"
import { redirect } from "next/navigation"
import { DocType } from "@capstone/database"

export async function uploadManuscript(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) throw new Error("Unauthorized")

  const file = formData.get("file") as File
  const groupId = formData.get("groupId") as string
  const fileType = file.name.endsWith(".pdf") ? DocType.PDF : DocType.DOCX

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

  // 3. Get latest version number
  const latestVersion = await prisma.documentVersion.findFirst({
    where: { projectId: project.id },
    orderBy: { versionNumber: "desc" },
    select: { versionNumber: true }
  })
  const nextVersion = (latestVersion?.versionNumber || 0) + 1

  // 4. Convert docx to HTML if applicable
  let htmlContent: string | null = null
  if (fileType === DocType.DOCX) {
    try {
      const buffer = await file.arrayBuffer()
      htmlContent = await convertDocxToHtml(Buffer.from(buffer))
    } catch {
      console.warn("Failed to convert docx to HTML")
    }
  }

  // 5. Create database record for document version
  await prisma.documentVersion.create({
    data: {
      projectId: project.id,
      versionNumber: nextVersion,
      fileUrl: path,
      fileName: file.name,
      fileType: fileType,
      fileSize: 0,
      htmlContent: htmlContent,
      uploadedBy: session.user.id,
    }
  })

  // 6. Update project status if needed
  await prisma.capstoneProject.update({
    where: { id: project.id },
    data: { status: project.status === "TITLE_PROPOSAL" ? "TITLE_APPROVED" : "IN_PROGRESS" }
  })

  redirect("/student/project/documents")
}
