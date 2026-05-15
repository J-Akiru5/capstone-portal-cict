import { createServerClient } from "@capstone/auth"
import { prisma } from "@capstone/database"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Badge } from "@capstone/ui/components/badge"
import { Button } from "@capstone/ui/components/button"
import { UploadForm } from "./upload-form"
import { FileText, Download, History, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export default async function DocumentsPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return null

  const member = await prisma.groupMember.findFirst({
    where: { userId: session.user.id },
    include: {
      group: {
        include: {
          project: {
            include: {
              documentVersions: {
                orderBy: { createdAt: "desc" },
                include: { uploader: true }
              }
            }
          }
        }
      }
    }
  })

  const group = member?.group
  const project = group?.project
  const versions = project?.documentVersions || []

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-outfit">Project Documents</h1>
        <p className="text-muted-foreground">Manage your manuscript versions and historical submissions.</p>
      </div>

      {!project ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Please propose a title first to enable document uploads.</p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload New Version</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadForm groupId={group.id} />
              </CardContent>
            </Card>

            {/* Version History */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Submission History</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {versions.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground italic">
                      No versions submitted yet.
                    </div>
                  ) : (
                    versions.map((v) => (
                      <div key={v.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-2 rounded">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate max-w-[200px] md:max-w-md">
                              {v.fileName}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                              <Badge variant="outline" className="text-[8px] h-4">v{v.version}</Badge>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 
                                {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
                              </span>
                              <span>•</span>
                              <span>By {v.uploader.firstName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/student/project/documents/view/${v.id}`}>
                            <Button size="icon" variant="ghost" title="View Manuscript">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button size="icon" variant="ghost" title="Download">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guidelines / Info */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-md flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Submission Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4 text-muted-foreground">
                <p>• Only <b>.docx</b> and <b>.pdf</b> formats are allowed.</p>
                <p>• Max file size is <b>50MB</b>.</p>
                <p>• Ensure your manuscript follows the <b>APA 7th Edition</b> formatting.</p>
                <p>• Every upload creates a new version. Old versions are archived for reference.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
