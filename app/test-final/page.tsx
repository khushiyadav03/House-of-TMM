"use client"

import { useState, useEffect } from "react"
import YouTubeEmbed from "../../components/YouTubeEmbed"

export default function FinalTestPage() {
    const [testResults, setTestResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const testEndpoints = [
        { name: 'Digital Cover', url: '/api/cover-photos/by-category/digital-cover?limit=3' },
        { name: 'Editorial Shoot', url: '/api/cover-photos/by-category/editorial-shoot?limit=3' },
        { name: 'YouTube Videos', url: '/api/youtube-videos?limit=1' },
        { name: 'Pep Talks', url: '/api/pep-talk?limit=3' },
        { name: 'Articles', url: '/api/articles?limit=3' },
    ]

    useEffect(() => {
        runTests()
    }, [])

    const runTests = async () => {
        const results = []

        for (const endpoint of testEndpoints) {
            try {
                const response = await fetch(endpoint.url)
                const data = await response.json()

                results.push({
                    name: endpoint.name,
                    status: response.ok ? 'SUCCESS' : 'FAILED',
                    data: data,
                    count: Array.isArray(data) ? data.length : (data.articles?.length || 0)
                })
            } catch (error) {
                results.push({
                    name: endpoint.name,
                    status: 'ERROR',
                    error: error.message,
                    count: 0
                })
            }
        }

        setTestResults(results)
        setLoading(false)
    }

    const sampleVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Sample YouTube URL

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
                    <p className="mt-4 text-gray-600">Running final tests...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Final Deployment Test</h1>

                {/* API Test Results */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">API Test Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {testResults.map((result, index) => (
                            <div key={index} className={`p-4 rounded-lg border-2 ${result.status === 'SUCCESS' ? 'border-green-500 bg-green-50' :
                                result.status === 'FAILED' ? 'border-red-500 bg-red-50' :
                                    'border-yellow-500 bg-yellow-50'
                                }`}>
                                <h3 className="font-bold text-lg mb-2">{result.name}</h3>
                                <p className={`text-sm font-semibold ${result.status === 'SUCCESS' ? 'text-green-700' :
                                    result.status === 'FAILED' ? 'text-red-700' :
                                        'text-yellow-700'
                                    }`}>
                                    {result.status}
                                </p>
                                <p className="text-sm text-gray-600">Items: {result.count}</p>
                                {result.error && (
                                    <p className="text-xs text-red-600 mt-1">{result.error}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* YouTube Embed Test */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">YouTube Embed Component Test</h2>
                    <div className="max-w-2xl">
                        <div className="relative w-full h-0 pb-[56.25%]">
                            <YouTubeEmbed
                                videoUrl={sampleVideoUrl}
                                title="Sample YouTube Video"
                                className="absolute top-0 left-0 w-full h-full"
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Testing YouTube URL conversion: {sampleVideoUrl}
                        </p>
                    </div>
                </div>

                {/* Sample Data Display */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Sample Data</h2>
                    {testResults.map((result, index) => (
                        result.status === 'SUCCESS' && result.count > 0 && (
                            <div key={index} className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">{result.name}</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <pre className="text-xs text-gray-600 overflow-x-auto">
                                        {JSON.stringify(
                                            Array.isArray(result.data)
                                                ? result.data[0]
                                                : result.data.articles?.[0] || result.data,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Navigation Links */}
                <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Navigation</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700">
                            Homepage
                        </a>
                        <a href="/cover/digital-cover" className="bg-green-600 text-white px-4 py-2 rounded-lg text-center hover:bg-green-700">
                            Digital Cover
                        </a>
                        <a href="/cover/editorial-shoot" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-center hover:bg-purple-700">
                            Editorial Shoot
                        </a>
                        <a href="/magazine" className="bg-red-600 text-white px-4 py-2 rounded-lg text-center hover:bg-red-700">
                            Magazines
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}