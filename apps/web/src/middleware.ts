import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_NEXT_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_NEXT_SUPABASE_ANON_KEY

  const supabase = createMiddlewareClient({ 
    req, 
    res,
    supabaseUrl,
    supabaseKey: supabaseAnonKey
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl.clone()

  // Protect internal routes
  const protectedRoutes = ["/student", "/faculty", "/admin"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  )

  if (isProtectedRoute && !session) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // RBAC checks
  if (session) {
    const role = session.user.user_metadata.role

    if (url.pathname.startsWith("/admin") && role !== "ADMIN") {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }

    if (url.pathname.startsWith("/faculty") && role !== "FACULTY") {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }

    if (url.pathname.startsWith("/student") && role !== "STUDENT") {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: ["/student/:path*", "/faculty/:path*", "/admin/:path*", "/login"],
}
