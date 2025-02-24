import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaviconUploader } from "@/components/favicon-uploader"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Favicon Generator</h1>
          <p className="text-muted-foreground">
            Create beautiful favicons for your website in seconds
          </p>
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Upload a PNG image to generate favicons in multiple sizes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FaviconUploader />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
