"use client"

import * as React from "react"
import { Upload, X, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "./button"
import { cn } from "../lib/utils"

interface FileUploadProps {
  onUpload: (file: File) => void
  accept?: string
  maxSize?: number // in bytes
}

export function FileUpload({ onUpload, accept = ".pdf,.docx", maxSize = 52428800 }: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const validateFile = (file: File) => {
    if (file.size > maxSize) {
      alert("File is too large. Max size is 50MB.")
      return false
    }
    return true
  }

  const removeFile = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer text-center",
            dragActive 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg">Click or drag manuscript here</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Accepts PDF and DOCX (Max 50MB)
          </p>
        </div>
      ) : (
        <div className="border rounded-xl p-4 bg-muted/30 flex items-center gap-4 animate-in zoom-in-95 duration-200">
          <div className="bg-primary/20 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={() => onUpload(file)}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Start Upload
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
