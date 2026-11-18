import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Требуется вход' }, { status: 401 })

  const { id } = await context.params
  const { data, error } = await supabase.rpc('mark_pitfly_paid', {
    p_booking_id: id,
  })

  if (error) {
    return NextResponse.json({ error: 'Не удалось отметить оплату' }, { status: 403 })
  }
  return NextResponse.json({ booking: data })
}
