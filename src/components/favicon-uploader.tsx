"use client"

import * as React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Cloud, Download, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { FaviconPreview } from "./favicon-preview"
import { GeneratedFavicon, generateFavicons, downloadAllFavicons } from "@/lib/favicon"

export function FaviconUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([])
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.type.includes("image/png")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PNG image.",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
      })
      return
    }

    setIsUploading(true)
    try {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      const generatedFavicons = await generateFavicons(url)
      setFavicons(generatedFavicons)
      toast({
        title: "Success",
        description: "Favicons generated successfully!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the image. Please try again.",
      })
      setImageUrl(undefined)
      setFavicons([])
    } finally {
      setIsUploading(false)
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
    },
    maxFiles: 1,
    multiple: false,
  })

  const handleDownload = useCallback(() => {
    if (favicons.length === 0) return
    downloadAllFavicons(favicons)
    toast({
      title: "Download started",
      description: "Your favicons are being downloaded.",
    })
  }, [favicons, toast])

  return (
    <div className="space-y-8">
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-lg border border-dashed p-8 transition-colors hover:bg-muted/50",
          isDragActive && "bg-muted/50",
          "cursor-pointer"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center justify-center rounded-full bg-muted p-4">
            <Cloud className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              Drag & drop your PNG image here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              PNG up to 5MB
            </p>
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {imageUrl && <FaviconPreview imageUrl={imageUrl} />}

      {favicons.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download All Favicons
          </Button>
        </div>
      )}
    </div>
  )
} 