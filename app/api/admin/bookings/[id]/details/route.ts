import { NextResponse } from 'next/server'
import { validateBookingDetails } from '@/lib/booking-details'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Требуется вход' }, { status: 401 })

  const { id } = await context.params
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 })
  }

  const payload = await request.json().catch(() => null)
  const validation = validateBookingDetails(payload, { requireCity: false })
  if ('error' in validation) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { city, ...contact } = validation.details
  const { data, error } = await supabase.rpc('update_pitfly_booking_details', {
    p_booking_id: id,
    p_details: Object.hasOwn(payload, 'city') ? { ...contact, city } : contact,
  }).single()

  if (error?.message === 'not_trainer') return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  if (error?.message === 'booking_not_found') return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 })
  if (error) return NextResponse.json({ error: 'Не удалось сохранить данные записи' }, { status: 409 })

  return NextResponse.json({ details: data })
}
