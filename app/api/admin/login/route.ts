import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    const validUsername = process.env.ADMIN_USERNAME || 'admin'
    const validPassword = process.env.ADMIN_PASSWORD || 'tmm2025'
    
    if (username === validUsername && password === validPassword) {
      // Create a simple token using crypto (built-in Node.js)
      const tokenData = JSON.stringify({
        admin: true,
        username,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      })
      
      const token = Buffer.from(tokenData).toString('base64')
      
      return NextResponse.json({ token })
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}