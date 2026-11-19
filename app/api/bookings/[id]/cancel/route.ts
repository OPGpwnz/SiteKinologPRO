import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 })
  }

  const { id } = await context.params
  const { data, error } = await supabase.rpc('cancel_pitfly_booking', {
    p_booking_id: id,
  })

  if (error) {
    if (error.message.includes('five_hour_rule')) {
      return NextResponse.json(
        { error: 'Свяжитесь с тренером' },
        { status: 403 },
      )
    }
    if (error.message.includes('booking_not_active')) {
      return NextResponse.json({ error: 'Отменить можно только активную запись' }, { status: 409 })
    }
    if (error.message.includes('booking_not_found')) {
      return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Не удалось отменить запись' }, { status: 409 })
  }

  return NextResponse.json({ booking: data })
}
