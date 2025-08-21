import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Generate a simple admin token that expires in 24 hours
    const tokenData = {
      admin: true,
      expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
      issued: Date.now()
    }
    
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64')
    
    return NextResponse.json({ 
      token,
      message: "Admin token generated successfully. Store this securely in localStorage as 'adminToken'."
    })
  } catch (error) {
    console.error("Token generation error:", error)
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
  }
}
