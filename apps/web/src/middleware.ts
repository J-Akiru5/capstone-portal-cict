import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars")
    return NextResponse.next({ request: req })
  }

  let supabaseResponse = NextResponse.next({ request: req })

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request: req })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl.clone()

  // Redirect logged-in users away from auth pages
  const authPages = ["/login", "/register"]
  const isAuthPage = authPages.includes(url.pathname)

  if (session && isAuthPage) {
    const role = session.user.user_metadata.role
    if (role === "ADMIN") url.pathname = "/admin/dashboard"
    else if (role === "FACULTY") url.pathname = "/faculty/dashboard"
    else url.pathname = "/student/dashboard"
    return NextResponse.redirect(url)
  }

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

  return supabaseResponse
}

export const config = {
  matcher: ["/student/:path*", "/faculty/:path*", "/admin/:path*", "/login", "/register"],
}
