import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client (for API routes and Server Components)
let supabaseServerInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseServer() {
  if (supabaseServerInstance) {
    return supabaseServerInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL is not defined.")
    throw new Error("Supabase URL is not defined.")
  }

  if (serviceRoleKey) {
    supabaseServerInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    })
    console.log("Supabase server client initialized with SERVICE_ROLE_KEY.")
  } else if (anonKey) {
    supabaseServerInstance = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
      },
    })
    console.warn(
      "Warning: SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY for server client. This is not recommended for sensitive operations.",
    )
  } else {
    console.error("Error: Neither SUPABASE_SERVICE_ROLE_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY is defined.")
    throw new Error("Supabase API keys are not defined for server client.")
  }

  return supabaseServerInstance
}

// Client-side Supabase client (for browser-side code)
let supabaseBrowserInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowser() {
  if (supabaseBrowserInstance) {
    return supabaseBrowserInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined for browser client.")
    throw new Error("Supabase URL or Anon Key is not defined for browser client.")
  }

  supabaseBrowserInstance = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: true,
    },
  })
  console.log("Supabase browser client initialized with ANON_KEY.")

  return supabaseBrowserInstance
}
