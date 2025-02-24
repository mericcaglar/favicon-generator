"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ICO_SIZES } from "@/lib/favicon"

interface FaviconPreviewProps {
  imageUrl?: string
}

const PREVIEW_SIZES = [16, 32, 48, 64] as const

type PreviewUrls = Partial<Record<number | 'ico', string>>

export function FaviconPreview({ imageUrl }: FaviconPreviewProps) {
  const [previewUrls, setPreviewUrls] = useState<PreviewUrls>({})

  useEffect(() => {
    if (!imageUrl) {
      setPreviewUrls({})
      return
    }

    const generatePreviews = async () => {
      const urls: PreviewUrls = {}
      
      // Generate PNG previews
      for (const size of PREVIEW_SIZES) {
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        
        const ctx = canvas.getContext("2d")
        if (!ctx) continue

        const img = new Image()
        img.src = imageUrl
        
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0, size, size)
            urls[size] = canvas.toDataURL("image/png")
            resolve(null)
          }
        })
      }

    
      const icoCanvas = document.createElement("canvas")
      icoCanvas.width = 32
      icoCanvas.height = 32
      const icoCtx = icoCanvas.getContext("2d")
      if (icoCtx) {
        const img = new Image()
        img.src = imageUrl
        await new Promise((resolve) => {
          img.onload = () => {
            icoCtx.drawImage(img, 0, 0, 32, 32)
            urls['ico'] = icoCanvas.toDataURL("image/png")
            resolve(null)
          }
        })
      }

      setPreviewUrls(urls)
    }

    generatePreviews()
  }, [imageUrl])

  if (!imageUrl) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {PREVIEW_SIZES.map((size) => (
          <Card key={size} className="p-4 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-lg">
              {previewUrls[size] && (
                <img
                  src={previewUrls[size]}
                  alt={`${size}x${size} preview`}
                  width={size}
                  height={size}
                  className="pixelated"
                  style={{
                    imageRendering: "pixelated",
                    width: size,
                    height: size,
                  }}
                />
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {size}x{size} PNG
            </span>
          </Card>
        ))}
      </div>

     
      <Card className="p-4 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-lg">
          {previewUrls['ico'] && (
            <img
              src={previewUrls['ico']}
              alt="ICO preview"
              width={32}
              height={32}
              className="pixelated"
              style={{
                imageRendering: "pixelated",
                width: 32,
                height: 32,
              }}
            />
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          favicon.ico ({ICO_SIZES.join(', ')}px)
        </span>
      </Card>
    </div>
  )
} 