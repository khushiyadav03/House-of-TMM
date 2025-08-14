"use client"

import { useAuth } from './AuthProvider'
import { Button } from './ui/button'

export default function AuthDebug() {
  const { user, session } = useAuth()

  const testAPI = async () => {
    try {
      const response = await fetch('/api/magazines/purchases', {
        credentials: 'include'
      })
      console.log('API Response Status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('API Response Data:', data)
        alert('API call successful! Check console for details.')
      } else {
        const error = await response.text()
        console.log('API Error:', error)
        alert(`API call failed: ${response.status} - ${error}`)
      }
    } catch (error) {
      console.error('API Error:', error)
      alert(`API call error: ${error}`)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="text-sm space-y-1">
        <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
        <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
        <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
      </div>
      <Button onClick={testAPI} size="sm" className="mt-2">
        Test API
      </Button>
    </div>
  )
}