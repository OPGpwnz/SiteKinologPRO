import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

async function requireTrainer(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'trainer' ? user : null
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const trainer = await requireTrainer(supabase)
  if (!trainer) return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })

  const body = await request.json()
  const startsAt = typeof body.startsAt === 'string' ? body.startsAt : ''
  const endsAt = typeof body.endsAt === 'string' ? body.endsAt : ''
  const capacity = Number(body.capacity)
  const starts = new Date(startsAt)
  const ends = new Date(endsAt)

  if (!Number.isFinite(starts.getTime()) || starts <= new Date()
    || !Number.isFinite(ends.getTime()) || ends <= starts
    || !Number.isInteger(capacity) || capacity < 1 || capacity > 2) {
    return NextResponse.json({ error: 'Некорректные параметры слота' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('slots')
    .insert({
      trainer_id: trainer.id,
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      capacity,
      is_open: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Не удалось создать слот' }, { status: 409 })
  return NextResponse.json({ slot: data })
}
