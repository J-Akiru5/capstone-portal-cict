import { prisma, DefenseStage } from "@capstone/database"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Button } from "@capstone/ui/components/button"
import { Badge } from "@capstone/ui/components/badge"
import { Plus, Edit3, Settings, AlertTriangle } from "lucide-react"

export default async function RubricBuilderPage() {
  const rubrics = await prisma.evaluationRubric.findMany({
    include: { criteria: true },
    orderBy: { defenseStage: "asc" }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-outfit">Rubric Builder</h1>
          <p className="text-muted-foreground">Define evaluation criteria and weights for each defense stage.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Rubric
        </Button>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {rubrics.map((r) => {
          const totalWeight = r.criteria.reduce((sum, c) => sum + c.weight, 0)
          const isInvalid = Math.abs(totalWeight - 1.0) > 0.001

          return (
            <Card key={r.id} className={isInvalid ? "border-red-200" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider mb-2">
                    {r.defenseStage.replace(/_/g, " ")}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">Standard Evaluation Rubric</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-4">
                  {r.criteria.map((c) => (
                    <div key={c.id} className="flex justify-between items-center text-sm p-2 rounded bg-muted/50">
                      <span className="font-medium">{c.name}</span>
                      <Badge variant="outline" className="font-mono text-[9px] bg-white">
                        {(c.weight * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Weight:</span>
                    <span className={`font-mono text-sm font-bold ${isInvalid ? "text-red-600" : "text-green-600"}`}>
                      {(totalWeight * 100).toFixed(0)}%
                    </span>
                  </div>
                  {isInvalid && (
                    <div className="flex items-center gap-1 text-[10px] text-red-600 font-bold animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Error: Weight must sum to 100%
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
