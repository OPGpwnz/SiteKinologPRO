import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { validateBookingDetails } from '@/lib/booking-details'
import { arrangedWithTrainer } from '@/lib/booking-services'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Некорректные данные записи' }, { status: 400 })
  }
  const slotId = typeof body.slotId === 'string' ? body.slotId : ''
  const serviceCode = typeof body.serviceCode === 'string' ? body.serviceCode : ''
  const useSubscription = body.useSubscription === true
  if (arrangedWithTrainer({ code: serviceCode })) {
    return NextResponse.json({ error: 'Эта услуга оформляется лично с тренером.' }, { status: 409 })
  }

  if (!slotId || !serviceCode) {
    return NextResponse.json({ error: 'Не выбраны слот или услуга' }, { status: 400 })
  }

  const validation = validateBookingDetails(body.details)
  if ('error' in validation) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('create_pitfly_booking_with_details', {
    p_slot_id: slotId,
    p_service_code: serviceCode,
    p_use_subscription: useSubscription,
    p_details: validation.details,
  })

  if (error) {
    const messages: Record<string, string> = {
      contact_trainer: 'Эта услуга оформляется лично с тренером.',
      slot_unavailable: 'Слот недоступен',
      service_not_found: 'Услуга не найдена',
      slot_full: 'Свободных мест нет',
      slot_capacity_mismatch: 'Выбранный слот не подходит для этой услуги',
      slot_duration_mismatch: 'Длительность слота меньше длительности услуги',
      subscription_unavailable: 'Активный абонемент не найден',
      subscription_not_applicable: 'Абонемент нельзя оплатить другим абонементом',
      not_authenticated: 'Требуется вход',
    }
    return NextResponse.json(
      { error: messages[error.message] || 'Не удалось создать запись' },
      { status: 409 },
    )
  }

  return NextResponse.json({ booking: data })
}
