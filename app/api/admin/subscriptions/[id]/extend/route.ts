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
  const { data, error } = await supabase.rpc('extend_pitfly_subscription', {
    p_subscription_id: id,
  })

  if (error) {
    if (error.message.includes('not_trainer')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }
    if (error.message.includes('subscription_not_found')) {
      return NextResponse.json({ error: 'Абонемент не найден' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Не удалось продлить абонемент' }, { status: 409 })
  }
  return NextResponse.json({ subscription: data })
}
