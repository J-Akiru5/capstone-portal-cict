export const dynamic = "force-dynamic"

import { prisma } from "@capstone/database"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Button } from "@capstone/ui/components/button"
import { Badge } from "@capstone/ui/components/badge"
import { Download, Users, FileText, ArrowLeft, GraduationCap, MapPin, Globe, Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const project = await prisma.capstoneProject.findUnique({
    where: { id },
    include: {
      group: {
        include: { 
          members: { include: { user: true } },
          adviser: true
        }
      },
      documentVersions: {
        orderBy: { versionNumber: "desc" },
        take: 1
      },
      panelAssignments: { include: { user: true } }
    }
  })

  if (!project) notFound()

  return (
    <div className="bg-muted/30 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b pt-12 pb-16 px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/archive" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Archive
          </Link>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary px-3">{project.domain}</Badge>
            {project.techStack.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-outfit leading-[1.1] tracking-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Publication Year</p>
                <p className="font-bold text-sm">{new Date(project.createdAt).getFullYear()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Adviser</p>
                <p className="font-bold text-sm">Prof. {project.group.adviser?.lastName ?? "TBA"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-8 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-2xl border-none">
              <CardContent className="p-10 space-y-8">
                <div>
                  <h2 className="text-xl font-bold font-outfit mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Abstract
                  </h2>
                  <p className="text-md text-gray-700 leading-relaxed font-serif">
                    {project.abstract || "The abstract for this research project is currently being finalized. Please check back later for full details on the methodology and findings."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Research Team</h3>
                    <div className="space-y-4">
                      {project.group.members.map(m => (
                        <div key={m.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                            {m.user.firstName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{m.user.firstName} {m.user.lastName}</p>
                            <p className="text-[10px] text-muted-foreground">{m.isLeader ? "Leader" : "Member"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">The Panel</h3>
                    <div className="space-y-4">
                      {project.panelAssignments.map(p => (
                        <div key={p.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                            {p.user.firstName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{p.user.firstName} {p.user.lastName}</p>
                            <p className="text-[10px] text-muted-foreground">Panelist</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-primary text-white border-none shadow-xl">
              <CardContent className="p-8 space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-outfit">Access Manuscript</h3>
                  <p className="text-primary-foreground/70 text-xs">
                    Download the official research document as verified by the CICT Panel.
                  </p>
                </div>
                <Button className="w-full bg-white text-primary hover:bg-primary-foreground font-bold h-12 shadow-inner">
                  Download Full PDF
                </Button>
                <p className="text-[10px] text-primary-foreground/50 italic">
                  Institutional use only • © {new Date().getFullYear()} ISUFST
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Technical Specs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground flex items-center gap-2"><Globe className="w-3 h-3" /> Tech Stack</span>
                  <span className="font-bold">{project.techStack.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-3 h-3" /> Campus</span>
                  <span className="font-bold">Dingle Campus</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


