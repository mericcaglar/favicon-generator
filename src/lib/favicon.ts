import JSZip from "jszip"
import { saveAs } from "file-saver"

export const FAVICON_SIZES = [16, 32, 48, 64, 128, 256] as const
export const ICO_SIZES = [16, 32, 48] as const

export type FaviconSize = typeof FAVICON_SIZES[number]

export interface GeneratedFavicon {
  size: FaviconSize
  dataUrl: string
  blob?: Blob
}

function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then(res => res.blob())
}

async function createIcoBlob(images: GeneratedFavicon[]): Promise<Blob> {
  // ICO header: 6 bytes
  const headerSize = 6
  // Directory entry: 16 bytes per image
  const directorySize = 16 * images.length
  
  let offset = headerSize + directorySize
  const directory: ArrayBuffer[] = []
  const imageData: ArrayBuffer[] = []

  // Create ICO header
  const header = new ArrayBuffer(headerSize)
  const headerView = new DataView(header)
  headerView.setInt16(0, 0, true) // Reserved. Must be 0
  headerView.setInt16(2, 1, true) // Image type: 1 = ICO
  headerView.setInt16(4, images.length, true) // Number of images

  for (const image of images) {
    const blob = await dataUrlToBlob(image.dataUrl)
    const buffer = await blob.arrayBuffer()
    const size = buffer.byteLength

    // Create directory entry
    const entry = new ArrayBuffer(16)
    const view = new DataView(entry)
    const width = image.size === 256 ? 0 : image.size // 0 means 256 in ICO format
    const height = width
    view.setInt8(0, width) // Width
    view.setInt8(1, height) // Height
    view.setInt8(2, 0) // Color palette
    view.setInt8(3, 0) // Reserved
    view.setInt16(4, 1, true) // Color planes
    view.setInt16(6, 32, true) // Bits per pixel
    view.setInt32(8, size, true) // Image size in bytes
    view.setInt32(12, offset, true) // Offset to image data

    directory.push(entry)
    imageData.push(buffer)
    offset += size
  }

  // Combine all buffers
  const finalBuffer = new Uint8Array(offset)
  let pos = 0

  finalBuffer.set(new Uint8Array(header), pos)
  pos += header.byteLength

  for (const entry of directory) {
    finalBuffer.set(new Uint8Array(entry), pos)
    pos += entry.byteLength
  }

  for (const data of imageData) {
    finalBuffer.set(new Uint8Array(data), pos)
    pos += data.byteLength
  }

  return new Blob([finalBuffer], { type: "image/x-icon" })
}

export async function generateFavicons(imageUrl: string): Promise<GeneratedFavicon[]> {
  const favicons: GeneratedFavicon[] = []

  for (const size of FAVICON_SIZES) {
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
        favicons.push({
          size,
          dataUrl: canvas.toDataURL("image/png"),
        })
        resolve(null)
      }
    })
  }

  // Convert data URLs to blobs
  for (const favicon of favicons) {
    favicon.blob = await dataUrlToBlob(favicon.dataUrl)
  }

  return favicons.sort((a, b) => a.size - b.size)
}

export function downloadFavicon(dataUrl: string, size: number) {
  const link = document.createElement("a")
  link.download = `favicon-${size}x${size}.png`
  link.href = dataUrl
  link.click()
}

export async function downloadAllFavicons(favicons: GeneratedFavicon[]) {
  const zip = new JSZip()
  const pngFolder = zip.folder("png")!
  
  // Add PNG files
  for (const favicon of favicons) {
    if (favicon.blob) {
      pngFolder.file(`favicon-${favicon.size}x${favicon.size}.png`, favicon.blob)
    }
  }

  // Create and add ICO file
  const icoFavicons = favicons.filter(f => ICO_SIZES.includes(f.size as typeof ICO_SIZES[number]))
  const icoBlob = await createIcoBlob(icoFavicons)
  zip.file("favicon.ico", icoBlob)

  // Generate and download zip
  const zipBlob = await zip.generateAsync({ type: "blob" })
  saveAs(zipBlob, "favicons.zip")
} 