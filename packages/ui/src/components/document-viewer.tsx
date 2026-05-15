"use client"

import * as React from "react"
import { cn } from "../lib/utils"

interface DocumentViewerProps {
  htmlContent: string
  className?: string
}

export function DocumentViewer({ htmlContent, className }: DocumentViewerProps) {
  return (
    <div 
      className={cn(
        "prose prose-sm max-w-none bg-white p-8 md:p-16 shadow-inner rounded-lg border min-h-[800px] overflow-auto",
        "font-serif leading-relaxed text-gray-900",
        className
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
