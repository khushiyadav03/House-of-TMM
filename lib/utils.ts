import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function safeJson(response: Response) {
  const clonedResponse = response.clone() // Clone the response to prevent "body stream already read"
  try {
    return await clonedResponse.json()
  } catch (error) {
    const text = await response.text() // Use the original response to get text
    console.error("Failed to parse JSON response:", error)
    console.error("Raw response text:", text)
    throw new Error(`Failed to parse JSON response: ${text.substring(0, 50)}... is not valid JSON`)
  }
}
