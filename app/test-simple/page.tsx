"use client"

import YouTubeEmbed from "../../components/YouTubeEmbed"

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Simple YouTube Test</h1>
        
        {/* Test with known working video */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 1: Known Working Video (Rick Roll)</h2>
          <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
            <YouTubeEmbed
              videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              title="Rick Astley - Never Gonna Give You Up"
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>

        {/* Test with the problematic video */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 2: Database Video (JmZ_ikSHFtY)</h2>
          <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
            <YouTubeEmbed
              videoUrl="https://www.youtube.com/watch?v=JmZ_ikSHFtY"
              title="Database Video Test"
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>

        {/* Test with direct embed URL */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 3: Direct Embed URL</h2>
          <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/JmZ_ikSHFtY"
              title="Direct Embed Test"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t pt-8">
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