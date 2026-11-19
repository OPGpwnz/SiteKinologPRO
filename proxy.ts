import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are required to refresh auth sessions.')
  }

  let response = NextResponse.next({ request })
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) {
    console.error('Failed to read Supabase auth session in proxy:', sessionError)
  } else if (session) {
    const { error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Failed to refresh Supabase auth session in proxy:', userError)
    }
  }

  return response
}

export const config = {
  matcher: ['/', '/api/:path*', '/auth/callback'],
}
