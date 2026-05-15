"use client"

import { FileUpload } from "@capstone/ui/components/file-upload"
import { uploadManuscript } from "./actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function UploadForm({ groupId }: { groupId: string }) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("groupId", groupId)

    try {
      await uploadManuscript(formData)
      toast.success("Manuscript uploaded successfully!")
      router.refresh()
    } catch (error) {
      toast.error("Upload failed. Please try again.")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={isUploading ? "pointer-events-none opacity-50" : ""}>
      <FileUpload onUpload={handleUpload} />
      {isUploading && (
        <p className="text-center text-xs text-primary font-medium mt-4 animate-pulse">
          Processing and securing your file...
        </p>
      )}
    </div>
  )
}
