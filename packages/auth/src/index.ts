import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const createClient = () => createClientComponentClient()

export const createServerClient = () => {
  return createServerComponentClient({ cookies })
}

export type { Session, User } from "@supabase/supabase-js"
