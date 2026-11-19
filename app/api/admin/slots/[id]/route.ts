import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Требуется вход' }, { status: 401 })
  }

  const { id } = await context.params
  const { error } = await supabase.rpc('delete_pitfly_slot', { p_slot_id: id })
  if (error) {
    if (error.message.includes('not_trainer')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }
    if (error.message.includes('slot_not_found')) {
      return NextResponse.json({ error: 'Слот не найден' }, { status: 404 })
    }
    if (error.message.includes('slot_has_bookings')) {
      return NextResponse.json(
        { error: 'Слот с историей записей нельзя удалить. Его можно закрыть.' },
        { status: 409 },
      )
    }
    console.error('Failed to delete slot:', error)
    return NextResponse.json({ error: 'Не удалось удалить слот' }, { status: 409 })
  }

  return NextResponse.json({ ok: true })
}
