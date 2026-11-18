import { NextResponse } from 'next/server'
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
  const weekdays = Array.isArray(body.weekdays) ? [...new Set(body.weekdays.map(Number))] : []
  const hours = Array.isArray(body.hours) ? [...new Set(body.hours.map(Number))] : []
  const capacity = Number(body.capacity)
  const firstDay = new Date(`${startDate}T00:00:00`)
  const lastDay = new Date(`${endDate}T23:59:59`)

  if (!Number.isFinite(firstDay.getTime()) || !Number.isFinite(lastDay.getTime())
    || firstDay > lastDay || lastDay.getTime() - firstDay.getTime() > 366 * 24 * 60 * 60 * 1000
    || !weekdays.length || weekdays.some(day => !Number.isInteger(day) || day < 0 || day > 6)
    || !hours.length || hours.some(hour => !Number.isInteger(hour) || hour < 8 || hour > 22)
    || !Number.isInteger(capacity) || capacity < 1 || capacity > 2) {
    return NextResponse.json({ error: 'Некорректные параметры сетки' }, { status: 400 })
  }

  const slots: {
    trainer_id: string
    starts_at: string
    ends_at: string
    capacity: number
    is_open: boolean
  }[] = []
  const cursor = firstDay

  for (let date = cursor; date <= lastDay; date.setDate(date.getDate() + 1)) {
    if (!weekdays.includes(date.getDay())) continue

    for (const hour of hours) {
      const starts = new Date(date)
      starts.setHours(hour, 0, 0, 0)
      if (starts <= new Date()) continue
      const ends = new Date(starts.getTime() + 60 * 60000)
      slots.push({
        trainer_id: user.id,
        starts_at: starts.toISOString(),
        ends_at: ends.toISOString(),
        capacity,
        is_open: true,
      })
    }
  }

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
