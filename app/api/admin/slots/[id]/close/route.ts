import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  const { id } = await context.params
  const { error } = await supabase
    .from('slots')
    .update({ is_open: false })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Не удалось закрыть слот' }, { status: 409 })
  return NextResponse.json({ ok: true })
}
