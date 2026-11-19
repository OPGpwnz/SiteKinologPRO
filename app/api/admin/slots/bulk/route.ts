import { NextResponse } from 'next/server'
import { generateBulkScheduleSlots, validateBulkScheduleInput } from '@/lib/pitfly-time'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Требуется вход' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'trainer') {
    return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
  }

  const payload = await request.json()
  const body = payload && typeof payload === 'object' && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : {}
  const startDate = typeof body.startDate === 'string' ? body.startDate : ''
  const endDate = typeof body.endDate === 'string' ? body.endDate : ''
  const weekdays = Array.isArray(body.weekdays)
    ? [...new Set(body.weekdays.filter((day): day is number => typeof day === 'number'))]
    : []
  const hours = Array.isArray(body.hours)
    ? [...new Set(body.hours.filter((hour): hour is number => typeof hour === 'number'))]
    : []
  const capacity = Number(body.capacity)
  const schedule = { startDate, endDate, weekdays, hours, capacity }
  const validationError = validateBulkScheduleInput(schedule)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const slots = generateBulkScheduleSlots(schedule).map(slot => ({
    trainer_id: user.id,
    ...slot,
  }))

  if (!slots.length) {
    return NextResponse.json({ error: 'Для заданной сетки слотов нет' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('slots')
    .insert(slots)
    .select()

  if (error) return NextResponse.json({ error: 'Не удалось создать сетку слотов' }, { status: 409 })
  return NextResponse.json({ slots: data })
}
