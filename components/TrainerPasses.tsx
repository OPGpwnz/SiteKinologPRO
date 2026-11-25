import { useState } from 'react'
import { BUSINESS_TIME_LABEL, compareBookingStart, formatBusinessDateTime } from '@/lib/pitfly-time'
import type { Booking, Subscription } from './PitflyApp'

export type PassClient = { id: string; email: string | null; phone: string | null }

type Props = {
  clients: PassClient[]
  bookings: Booking[]
  passes: Subscription[]
  onBalance: (client: string, pass: Subscription | undefined, remaining: number) => Promise<void>
  onLesson: (lesson: Booking, passId: string | null) => Promise<void>
}

export function TrainerPasses({ clients, bookings, passes, onBalance, onLesson }: Props) {
  const [clientId, setClientId] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const names = new Map(clients.map(client => [client.id, client.email || client.phone || client.id]))
  for (const pass of passes) {
    if (!names.has(pass.client_id)) names.set(pass.client_id, pass.profiles?.email || pass.profiles?.phone || pass.client_id)
  }
  for (const b of bookings) {
    const contact = b.profiles?.email || b.profiles?.phone || names.get(b.client_id) || b.client_id
    if (b.booking_details?.owner_name) names.set(b.client_id, [b.booking_details.owner_name, b.profiles?.email || b.booking_details.contact_phone].filter(Boolean).join(' · '))
    else if (!names.has(b.client_id)) names.set(b.client_id, contact)
  }
  const owned = passes.filter(p => p.client_id === clientId)
  const current = owned.filter(p => p.status === 'active' && Date.parse(p.expires_at) > Date.now() && p.used_lessons < p.total_lessons)
    .sort((a, b) => Date.parse(a.expires_at) - Date.parse(b.expires_at))[0]
  const lessons = bookings.filter(b => b.client_id === clientId).sort((a, b) => compareBookingStart(b, a))

  async function save(action: () => Promise<void>) {
    if (busy) return
    setBusy(true)
    setMessage('')
    try { await action(); setMessage('Изменения сохранены.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Не удалось сохранить изменения.') }
    finally { setBusy(false) }
  }

  function balanceForm(pass?: Subscription) {
    const total = pass?.total_lessons ?? 5
    const remaining = total - (pass?.used_lessons ?? 0)
    return <form key={`${clientId}-${pass?.id ?? 'new'}-${remaining}`} className="pass-balance"
      onSubmit={event => {
        event.preventDefault()
        const value = Number(new FormData(event.currentTarget).get('remaining'))
        void save(() => onBalance(clientId, pass, value))
      }}>
      <label>{pass ? 'Остаток' : 'Начальный остаток'} из {total}
        <input name="remaining" type="number" min={pass ? 0 : 1} max={total} step="1" defaultValue={remaining} required disabled={busy} />
      </label>
      <button className="button secondary small" disabled={busy}>{pass ? 'Сохранить остаток' : 'Оформить на 5 занятий'}</button>
    </form>
  }

  return <details className="card trainer-passes">
    <summary>Абонементы и история занятий</summary>
    <label>Клиент
      <select value={clientId} disabled={busy} onChange={e => { setClientId(e.target.value); setMessage('') }}>
        <option value="">Выберите клиента</option>
        {[...names].sort((a,b) => a[1].localeCompare(b[1], 'ru')).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
    </label>
    {clientId && <>
      {owned.map(pass => <div key={pass.id} className="pass-entry">
        <strong>Абонемент до {formatBusinessDateTime(pass.expires_at, { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
        <span>Осталось {pass.total_lessons - pass.used_lessons} из {pass.total_lessons}</span>
        {Date.parse(pass.expires_at) > Date.now() && balanceForm(pass)}
      </div>)}
      {!current && <div className="pass-entry"><strong>Новый абонемент · 45 дней</strong>{balanceForm()}</div>}
      <h3>Занятия клиента</h3>
      <small>{BUSINESS_TIME_LABEL}</small>
      {!lessons.length && <p>Записей пока нет.</p>}
      <ul className="pass-history">{lessons.map(b => <li key={b.id}>
        <div>
          <strong>{b.slots ? formatBusinessDateTime(b.slots.starts_at) : 'Дата не указана'}</strong>
          <span>{b.services?.title || 'Тренировка'} · {b.subscription_id ? 'По абонементу' : 'Разовое занятие'}</span>
          <small>{b.status === 'cancelled' ? 'Отменено' : b.status === 'no_show' ? 'Неявка' : b.status === 'completed' ? 'Проведено' : b.slots && Date.parse(b.slots.ends_at) <= Date.now() ? 'Дата прошла' : 'Запланировано'}</small>
        </div>
        {(b.status === 'active' || b.status === 'completed') && (b.subscription_id || current) &&
          <button className="button secondary small" type="button" disabled={busy}
            onClick={() => void save(() => onLesson(b, b.subscription_id ? null : current!.id))}>
            {b.subscription_id ? 'Вернуть в разовые' : 'Учесть по абонементу'}
          </button>}
      </li>)}</ul>
    </>}
    <p role="status">{message}</p>
  </details>
}
