"use client"

import { useState, useEffect } from "react"
import { Button } from "@capstone/ui/components/button"
import { checkTitleSimilarity, type SimilarityResult } from "./actions"
import { AlertCircle, CheckCircle2, Search, Info } from "lucide-react"

export default function TitleCheckPage() {
  const [title, setTitle] = useState("")
  const [results, setResults] = useState<SimilarityResult[]>([])
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (title.length >= 5) {
        setIsChecking(true)
        const simResults = await checkTitleSimilarity(title)
        setResults(simResults)
        setIsChecking(false)
      } else {
        setResults([])
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [title])

  const getSeverity = (score: number) => {
    if (score >= 0.7) return "bg-red-100 text-red-700 border-red-200"
    if (score >= 0.4) return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-blue-100 text-blue-700 border-blue-200"
  }

  const getBadge = (score: number) => {
    if (score >= 0.7) return "Critical Duplicate"
    if (score >= 0.4) return "Significant Similarity"
    return "Minor Similarity"
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-outfit mb-2">
          Smart Title Verification
        </h1>
        <p className="text-muted-foreground">
          Propose your capstone title below. Our system will automatically check 
          against institutional archives to ensure originality.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <label className="block text-sm font-medium mb-2">
            Proposed Research Title
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pl-12 rounded-lg border focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Enter your full research title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            {isChecking && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3" /> Minimum 5 characters to start verification.
          </p>
        </div>

        {title.length >= 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Verification Results
                <span className="text-sm font-normal text-muted-foreground">
                  ({results.length} matches found)
                </span>
              </h2>
              {results.length === 0 && !isChecking && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Highly Original
                </div>
              )}
            </div>

            {results.length > 0 ? (
              <div className="grid gap-3">
                {results.map((res) => (
                  <div 
                    key={res.id} 
                    className={`p-4 rounded-lg border flex items-center justify-between transition-all hover:shadow-md ${getSeverity(res.similarity)}`}
                  >
                    <div>
                      <h4 className="font-bold text-sm leading-tight mb-1">{res.title}</h4>
                      <div className="flex items-center gap-2 text-xs opacity-80">
                        <span>Year: {res.year}</span>
                        <span>•</span>
                        <span>Match: {(res.similarity * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-white/50 border border-current whitespace-nowrap ml-4">
                      {getBadge(res.similarity)}
                    </span>
                  </div>
                ))}
              </div>
            ) : !isChecking ? (
              <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/30">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">No duplication detected</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Your title appears to be unique in our current database. You can proceed to submit your proposal.
                </p>
              </div>
            ) : null}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button 
            size="lg" 
            disabled={title.length < 10 || (results.length > 0 && results[0].similarity >= 0.7)}
            className="w-full md:w-auto"
          >
            Submit Proposal
          </Button>
        </div>

        {results.length > 0 && results[0].similarity >= 0.7 && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-bold">Submission Blocked</p>
              <p className="text-xs opacity-90">
                A highly similar title has been detected in the archive. 
                Please revise your title or consult your adviser for an override.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
