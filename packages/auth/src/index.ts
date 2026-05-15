import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_NEXT_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_NEXT_SUPABASE_ANON_KEY

export const createClient = () => createClientComponentClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey
})

export const createServerClient = () => {
  return createServerComponentClient({ 
    cookies,
    supabaseUrl,
    supabaseKey: supabaseAnonKey
  })
}

export type { Session, User } from "@supabase/supabase-js"
