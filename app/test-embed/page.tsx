"use client"

import YouTubeEmbed from "../../components/YouTubeEmbed"

export default function TestEmbedPage() {
  const testVideos = [
    {
      title: "Test Video 1 - Direct Embed",
      url: "https://www.youtube.com/embed/JmZ_ikSHFtY"
    },
    {
      title: "Test Video 2 - Watch URL",
      url: "https://www.youtube.com/watch?v=JmZ_ikSHFtY"
    },
    {
      title: "Test Video 3 - Short URL",
      url: "https://youtu.be/CW7aDbaAxUM"
    },
    {
      title: "Test Video 4 - Rick Roll (Known Working)",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ]

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">YouTube Embed Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testVideos.map((video, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-600 break-all">{video.url}</p>
              <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
                <YouTubeEmbed
                  videoUrl={video.url}
                  title={video.title}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Direct iframe test */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Direct iframe Test</h2>
          <div className="relative w-full max-w-2xl h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/JmZ_ikSHFtY"
              title="Direct iframe test"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t pt-8 mt-12">
          <div className="flex gap-4">
            <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Homepage
            </a>
            <a href="/debug-video" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Debug Video Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}