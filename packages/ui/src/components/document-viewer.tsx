"use client"

import * as React from "react"
import { cn } from "../lib/utils"

interface DocumentViewerProps {
  htmlContent: string
  className?: string
  onParagraphClick?: (id: string, text: string) => void
  isAnnotationMode?: boolean
}

export function DocumentViewer({ htmlContent, className, onParagraphClick, isAnnotationMode }: DocumentViewerProps) {
  // We'll use a ref to handle clicks on the content
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isAnnotationMode || !contentRef.current) return

    const paragraphs = contentRef.current.querySelectorAll("p, h1, h2, h3, h4")
    paragraphs.forEach((p, index) => {
      p.setAttribute("data-paragraph-id", `p-${index}`)
      p.classList.add("cursor-pointer", "hover:bg-primary/5", "transition-colors", "relative", "group")
      
      const clickHandler = () => {
        onParagraphClick?.(`p-${index}`, p.textContent || "")
      }
      
      p.addEventListener("click", clickHandler)
      return () => p.removeEventListener("click", clickHandler)
    })
  }, [htmlContent, isAnnotationMode, onParagraphClick])

  return (
    <div 
      ref={contentRef}
      className={cn(
        "prose prose-sm max-w-none bg-white p-8 md:p-16 shadow-inner rounded-lg border min-h-[800px] overflow-auto",
        "font-serif leading-relaxed text-gray-900",
        isAnnotationMode && "annotation-mode",
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
