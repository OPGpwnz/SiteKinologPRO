import { useEffect, useState } from 'react'
import { bookingDetailFields, emptyBookingDetails, validateBookingDetails, type BookingDetails } from '@/lib/booking-details'
import { compareBookingStart, formatBusinessDateTime } from '@/lib/pitfly-time'
import { BookingDetailsFields } from './BookingDetailsFields'
import { TrainerAgenda } from './TrainerAgenda'
import type { Booking } from './PitflyApp'

const statuses = { active: 'Действует', cancelled: 'Отменена', completed: 'Завершена', no_show: 'Клиент не пришёл' }
const groups = { active: 'Действующие', cancelled: 'Отменённые', history: 'Архив' } as const
type Group = keyof typeof groups

export function BookingDirectory({ bookings, onSaveDetails, onMarkPaid, onCancel, busy, ready }: {
  bookings: Booking[]
  onSaveDetails?: (id: string, details: BookingDetails) => Promise<string | undefined>
  onMarkPaid?: (id: string) => Promise<void>
  onCancel?: (id: string) => Promise<void>
  busy: boolean
  ready?: boolean
}) {
  const [group, setGroup] = useState<Group>('active')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyBookingDetails)
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(interval)
  }, [])

  const grouped = { active: [] as Booking[], cancelled: [] as Booking[], history: [] as Booking[] }
  for (const booking of bookings) {
    const ended = booking.slots && Date.parse(booking.slots.ends_at) <= now
    if (booking.status === 'cancelled') grouped.cancelled.push(booking)
    else if (booking.status === 'active' && !ended) grouped.active.push(booking)
    else grouped.history.push(booking)
  }

  const query = search.trim().toLocaleLowerCase('ru')
  const phoneQuery = /^[+\d(). -]+$/.test(query) ? query.replace(/\D/g, '') : ''
  const visible = grouped[group].filter(booking => {
    if (!onSaveDetails || !query) return true
    const details = booking.booking_details
    const phone = details?.contact_phone || booking.profiles?.phone
    return (phoneQuery && phone?.replace(/\D/g, '').includes(phoneQuery)) || [details?.dog_name, details?.dog_breed, details?.owner_name, details?.contact_phone,
      booking.profiles?.email, booking.profiles?.phone, booking.services?.title]
      .some(value => value?.toLocaleLowerCase('ru').includes(query))
  }).sort(compareBookingStart)

  async function saveDetails(id: string) {
    if (!onSaveDetails || saving) return
    const result = validateBookingDetails(draft)
    if ('error' in result) {
      setSaveError(result.error)
      return
    }

    setSaving(true)
    setSaveError('')
    const error = await onSaveDetails(id, result.details)
    setSaving(false)
    if (error) setSaveError(error)
    else setEditingId(null)
  }

  return (
    <section className="booking-directory" aria-labelledby="booking-directory-title">
      {onSaveDetails && <TrainerAgenda bookings={grouped.active} now={now} ready={ready} />}
      <div className="booking-directory-header">
        <h2 id="booking-directory-title">{onSaveDetails ? 'Записи клиентов' : 'Мои записи'}</h2>
        {onSaveDetails && (
          <label className="booking-search">
            Поиск по записям
            <input type="search" placeholder="Кличка, имя, телефон" value={search} onChange={event => setSearch(event.target.value)} />
          </label>
        )}
      </div>
      <div className="booking-directory-filters filters" role="group" aria-label="Статус записей">
        {(Object.keys(groups) as Group[]).map(key => (
          <button key={key} type="button" className={group === key ? 'selected' : ''} aria-pressed={group === key}
            disabled={saving} onClick={() => { setGroup(key); setEditingId(null) }}>
            {groups[key]} <span>{grouped[key].length}</span>
          </button>
        ))}
      </div>
      <div className="booking-directory-list" aria-busy={ready === false}>
        {ready === false && <p className="card muted">Загружаем записи…</p>}
        {ready !== false && !visible.length && <p className="card muted">{query ? 'По этому запросу записей нет.' : 'В этом разделе пока нет записей.'}</p>}
        {visible.map(booking => {
          const details = booking.booking_details
          const phone = details?.contact_phone || booking.profiles?.phone
          return (
            <article className="card directory-booking" key={booking.id}>
              <div className="directory-booking-header">
                <div>
                  {booking.slots ? (
                    <time dateTime={booking.slots.starts_at}>{formatBusinessDateTime(booking.slots.starts_at)}</time>
                  ) : <span className="muted">Время не указано</span>}
                  <h3>{booking.services?.title || 'Тренировка'}</h3>
                </div>
                <div className="booking-badges">
                  <span className="booking-badge" data-status={group === 'history' ? undefined : booking.status}>
                    {group === 'history' && booking.status === 'active' ? 'Дата прошла' : statuses[booking.status]}
                  </span>
                  <span className="booking-badge" data-status={booking.payment_status}>{booking.payment_status === 'paid' ? 'Оплачено' : 'Не оплачено'}</span>
                </div>
              </div>
              {details ? (
                <dl className="directory-details">
                  {bookingDetailFields.map(({ name, label }) => (
                    <div key={name}>
                      <dt>{label}</dt>
                      <dd>{name === 'contact_phone' ? <a href={`tel:${details[name].replace(/[^+\d]/g, '')}`}>{details[name]}</a> : details[name]}</dd>
                    </div>
                  ))}
                </dl>
              ) : onSaveDetails && (
                <p className="muted">{[booking.profiles?.email, phone].filter(Boolean).join(' · ') || 'Контактные данные ещё не добавлены'}</p>
              )}
              {editingId === booking.id ? (
                <form className="directory-edit" onSubmit={event => { event.preventDefault(); void saveDetails(booking.id) }}>
                  <BookingDetailsFields value={draft} onChange={setDraft} />
                  {saveError && <p className="field-error" role="alert">{saveError}</p>}
                  <div className="slot-actions">
                    <button className="button small" disabled={saving}>{saving ? 'Сохраняем…' : 'Сохранить'}</button>
                    <button type="button" className="button secondary small" disabled={saving} onClick={() => setEditingId(null)}>Закрыть</button>
                  </div>
                </form>
              ) : (
                <div className="slot-actions">
                  {onSaveDetails && (
                    <button className="button secondary small" disabled={saving} onClick={() => {
                      setDraft(details ? { ...details } : { ...emptyBookingDetails, contact_phone: phone || '' })
                      setSaveError('')
                      setEditingId(booking.id)
                    }}>{details ? 'Редактировать данные' : 'Добавить данные'}</button>
                  )}
                  {onMarkPaid && booking.status === 'active' && booking.payment_status === 'unpaid' && (
                    <button className="button small" disabled={busy || saving} onClick={() => void onMarkPaid(booking.id)}>Отметить оплату</button>
                  )}
                  {onCancel && booking.status === 'active' && (
                    <button className="button red small" disabled={busy || saving} onClick={() => void onCancel(booking.id)}>Отменить запись</button>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
