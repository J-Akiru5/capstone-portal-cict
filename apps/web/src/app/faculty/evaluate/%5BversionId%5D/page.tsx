import { createServerClient } from "@capstone/auth"
import { prisma } from "@capstone/database"
import { convertDocxToHtml } from "@capstone/storage"
import { AnnotationClient } from "./annotation-client"
import { Button } from "@capstone/ui/components/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EvaluateManuscriptPage({ params }: { params: { versionId: string } }) {
  const { versionId } = await params
  const supabase = createServerClient()

  const version = await prisma.documentVersion.findUnique({
    where: { id: versionId },
    include: { 
      project: {
        include: { group: true }
      },
      annotations: {
        include: { author: true },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!version) notFound()

  // Download and convert
  const { data } = await supabase.storage
    .from("manuscripts")
    .download(version.fileUrl)

  let htmlContent = ""
  if (data && version.fileName.endsWith(".docx")) {
    const arrayBuffer = await data.arrayBuffer()
    htmlContent = await convertDocxToHtml(Buffer.from(arrayBuffer))
  } else {
    htmlContent = `<div class="p-8 text-center text-muted-foreground italic">Manuscript content unavailable for preview.</div>`
  }

  return (
    <div className="bg-muted/10 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={`/faculty/dashboard`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-xl font-outfit leading-tight">
                Evaluating: {version.project.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                Group: {version.project.group.name} • {version.docType} v{version.version}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="h-7 text-xs border-primary text-primary capitalize">
              {version.project.status.replace(/_/g, " ")}
            </Badge>
            <Link href={`/faculty/evaluate/project/${version.projectId}`}>
              <Button size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" /> Go to Grading
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <AnnotationClient 
          htmlContent={htmlContent} 
          versionId={versionId} 
          initialAnnotations={version.annotations as any} 
        />
      </div>
    </div>
  )
}

function Badge({ className, variant, children }: any) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}
