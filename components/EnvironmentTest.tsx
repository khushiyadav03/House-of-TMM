"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function EnvironmentTest() {
  const [envInfo, setEnvInfo] = useState<any>({})
  const [bucketTest, setBucketTest] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testEnvironment = async () => {
      const info = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing",
        nodeEnv: process.env.NODE_ENV,
      }

      setEnvInfo(info)

      // Test Supabase connection and buckets
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          for (const bucket of buckets) {
            try {
              const { data, error } = await supabase.storage.from(bucket).list('', { limit: 1 })
              bucketResults[bucket] = {
                exists: !error,
                error: error?.message || null,
                data: data ? "Accessible" : "No access"
              }
            } catch (err) {
              bucketResults[bucket] = {
                exists: false,
                error: err instanceof Error ? err.message : "Unknown error",
                data: "Error"
              }
            }
          }

          setBucketTest(bucketResults)
        } catch (error) {
          setBucketTest({ error: error instanceof Error ? error.message : "Unknown error" })
        }
      }

      setLoading(false)
    }

    testEnvironment()
  }, [])

  if (loading) {
    return <div className="p-4">Loading environment test...</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Environment Variables Test</h2>
      
      <div className="space-y-2">
        <h3 className="font-medium">Environment Variables:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(envInfo, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Bucket Access Test:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(bucketTest, null, 2)}
        </pre>
      </div>

      {bucketTest.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {bucketTest.error}
        </div>
      )}
    </div>
  )
} 