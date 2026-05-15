"use client"

import { useState } from "react"
import { DocumentViewer } from "@capstone/ui/components/document-viewer"
import { Button } from "@capstone/ui/components/button"
import { Card, CardContent } from "@capstone/ui/components/card"
import { MessageSquare, X, Send, Trash2, User } from "lucide-react"
import { saveAnnotation, deleteAnnotation } from "./actions"
import { toast } from "sonner"

interface Annotation {
  id: string
  paragraphId: string
  content: string
  createdAt: Date
  author: { firstName: string, lastName: string }
}

export function AnnotationClient({ 
  htmlContent, 
  versionId, 
  initialAnnotations 
}: { 
  htmlContent: string, 
  versionId: string, 
  initialAnnotations: Annotation[] 
}) {
  const [annotations, setAnnotations] = useState(initialAnnotations)
  const [selectedParagraph, setSelectedParagraph] = useState<{ id: string, text: string } | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleParagraphClick = (id: string, text: string) => {
    setSelectedParagraph({ id, text })
  }

  const handleSave = async () => {
    if (!comment.trim() || !selectedParagraph) return
    
    setIsSubmitting(true)
    try {
      const newAnnotation = await saveAnnotation({
        versionId,
        paragraphId: selectedParagraph.id,
        content: comment,
        selectedText: selectedParagraph.text
      })
      // In a real app, the server action returns the full object with author
      // For now we'll just refresh or update local state
      toast.success("Comment added")
      setComment("")
      setSelectedParagraph(null)
      window.location.reload() // Simplest way to get fresh data with author
    } catch (error) {
      toast.error("Failed to save comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnotation(id, versionId)
      setAnnotations(annotations.filter(a => a.id !== id))
      toast.success("Comment removed")
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen pb-20">
      {/* Document Panel */}
      <div className="flex-1 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg">
          <DocumentViewer 
            htmlContent={htmlContent} 
            isAnnotationMode 
            onParagraphClick={handleParagraphClick}
          />
        </div>
      </div>

      {/* Side Panel */}
      <div className="lg:w-80 space-y-6">
        {/* Active Selection */}
        {selectedParagraph ? (
          <Card className="border-primary ring-2 ring-primary/20 animate-in slide-in-from-right-4">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> New Annotation
                </h4>
                <button onClick={() => setSelectedParagraph(null)}>
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground italic line-clamp-3 bg-muted p-2 rounded">
                "{selectedParagraph.text}"
              </p>
              <textarea
                autoFocus
                className="w-full h-24 text-sm p-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                placeholder="Write your feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button 
                className="w-full gap-2" 
                size="sm" 
                onClick={handleSave}
                disabled={isSubmitting || !comment.trim()}
              >
                <Send className="w-4 h-4" /> 
                {isSubmitting ? "Saving..." : "Post Comment"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="p-6 text-center border-2 border-dashed rounded-xl bg-muted/30">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Click any paragraph in the document to add feedback.
            </p>
          </div>
        )}

        {/* List of Annotations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 px-2">
            Comments ({annotations.length})
          </h3>
          {annotations.map((a) => (
            <div key={a.id} className="group relative bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[10px] font-bold">
                  {a.author.firstName} {a.author.lastName}
                </span>
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{a.content}</p>
              
              <button 
                onClick={() => handleDelete(a.id)}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
