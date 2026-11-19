import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const callbackError = requestUrl.searchParams.get('error_description')
    ?? requestUrl.searchParams.get('error')

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Failed to exchange Supabase auth callback code for a session:', error)
      const redirectUrl = new URL('/', requestUrl.origin)
      redirectUrl.searchParams.set('authError', 'callback')
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    console.error(
      'Supabase auth callback received without a code:',
      callbackError ?? 'no error details provided',
    )
    const redirectUrl = new URL('/', requestUrl.origin)
    redirectUrl.searchParams.set('authError', 'callback')
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
