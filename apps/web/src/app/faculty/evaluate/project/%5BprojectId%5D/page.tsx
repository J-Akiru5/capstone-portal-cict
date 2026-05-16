export const dynamic = "force-dynamic"

import { createServerClient } from "@capstone/auth/server"
import { prisma, DefenseStage } from "@capstone/database"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Button } from "@capstone/ui/components/button"
import { Badge } from "@capstone/ui/components/badge"
import { CheckCircle2, AlertCircle, Trophy, ClipboardCheck } from "lucide-react"
import { notFound } from "next/navigation"

export default async function ProjectGradingPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  
  const project = await prisma.capstoneProject.findUnique({
    where: { id: projectId },
    include: { group: true }
  })

  if (!project) notFound()

  const activeStage = DefenseStage.TITLE
  
  const rubric = await prisma.evaluationRubric.findFirst({
    where: { defenseStage: activeStage },
    include: { criteria: true }
  })

  if (!rubric) {
    return <div className="p-12 text-center text-muted-foreground">No active rubric found for this stage.</div>
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-outfit">Digital Scoresheet</h1>
          <p className="text-muted-foreground">Evaluating {project.title}</p>
        </div>
        <Badge className="bg-primary px-4 py-1.5 uppercase tracking-widest text-[10px]">
          {activeStage.replace(/_/g, " ")}
        </Badge>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary" /> Evaluation Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {rubric.criteria.map((c) => (
                  <div key={c.id} className="p-6 space-y-4 hover:bg-muted/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm">{c.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        Weight: {(c.weight * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        className="flex-1 accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer" 
                      />
                      <div className="w-16 h-10 border rounded flex items-center justify-center font-bold text-sm bg-white">
                        85
                      </div>
                    </div>
                    <textarea 
                      className="w-full text-xs p-2 rounded border border-dashed focus:ring-1 focus:ring-primary outline-none"
                      placeholder={`Feedback for ${c.name}...`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="sticky top-24">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-md flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> Final Verdict
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Current Weighted Score</p>
                <h2 className="text-5xl font-black text-primary font-outfit">85.0</h2>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Select Verdict</label>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start gap-3 border-green-200 hover:bg-green-50 hover:text-green-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Pass
                  </Button>
                  <Button variant="outline" className="justify-start gap-3 border-amber-200 hover:bg-amber-50 hover:text-amber-700">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Conditional Pass
                  </Button>
                  <Button variant="outline" className="justify-start gap-3 border-red-200 hover:bg-red-50 hover:text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-600" /> Failed
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">General Comments</label>
                <textarea 
                  className="w-full h-24 text-xs p-3 rounded border focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Final summary for the student group..."
                />
              </div>

              <Button className="w-full h-12 text-md font-bold shadow-lg shadow-primary/20">
                Submit & Finalize
              </Button>
              <p className="text-[9px] text-center text-muted-foreground italic">
                *Submitting will lock this evaluation and notify the student group.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
