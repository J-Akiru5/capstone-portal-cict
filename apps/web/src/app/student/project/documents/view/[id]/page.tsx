import { createServerClient } from "@capstone/auth"
import { prisma } from "@capstone/database"
import { convertDocxToHtml } from "@capstone/storage"
import { DocumentViewer } from "@capstone/ui/components/document-viewer"
import { Button } from "@capstone/ui/components/button"
import { ArrowLeft, Download, FileText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ViewDocumentPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = createServerClient()

  const version = await prisma.documentVersion.findUnique({
    where: { id },
    include: { project: true }
  })

  if (!version) notFound()

  // Download from Supabase Storage
  const { data, error } = await supabase.storage
    .from("manuscripts")
    .download(version.fileUrl)

  if (error || !data) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-destructive">Error Loading Document</h2>
        <p className="text-muted-foreground">{error?.message || "Could not retrieve file from storage."}</p>
      </div>
    )
  }

  let htmlContent = ""
  if (version.fileName.endsWith(".docx")) {
    const arrayBuffer = await data.arrayBuffer()
    htmlContent = await convertDocxToHtml(Buffer.from(arrayBuffer))
  } else {
    htmlContent = `<div class="p-8 text-center"><p>Preview only available for .docx files. Please download the PDF to view.</p></div>`
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student/project/documents">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-lg leading-none">{version.fileName}</h1>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-tighter">
                Version {version.version} • {version.docType}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <DocumentViewer htmlContent={htmlContent} />
      </div>
    </div>
  )
}
