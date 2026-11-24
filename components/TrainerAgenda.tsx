import { useState } from 'react'
import { formatBusinessDateTab, formatBusinessDateTime, getTrainerAgenda } from '@/lib/pitfly-time'
import type { Booking } from './PitflyApp'

const periods = [
  { id: 'today', label: 'Сегодня' },
  { id: 'tomorrow', label: 'Завтра' },
  { id: 'both', label: 'Два дня' },
] as const

export function TrainerAgenda({ bookings, now, ready }: { bookings: Booking[]; now: number; ready?: boolean }) {
  const [period, setPeriod] = useState<(typeof periods)[number]['id']>('both')
  const days = getTrainerAgenda(bookings, new Date(now)).map((day, index) => ({ ...day, ...periods[index] }))
  const visibleDays = days.filter(day => period === 'both' || day.id === period)
  const total = visibleDays.reduce((count, day) => count + day.sessions.length, 0)

  return (
    <section className="trainer-agenda" aria-labelledby="trainer-agenda-title" aria-busy={ready === false}>
      <div className="trainer-agenda-header">
        <div>
          <h2 id="trainer-agenda-title">Ближайшие занятия</h2>
          <p>Московское время</p>
        </div>
        <div className="filters trainer-agenda-filters" role="group" aria-label="Период расписания">
          {periods.map(({ id, label }) => (
            <button key={id} type="button" className={period === id ? 'selected' : ''}
              aria-pressed={period === id} onClick={() => setPeriod(id)}>{label}</button>
          ))}
        </div>
      </div>
      {ready === false ? <p className="muted">Загружаем расписание…</p> : (
        <>
          <p className="trainer-agenda-total" aria-live="polite">Всего занятий <strong>{total}</strong></p>
          <div className="trainer-agenda-days">
            {visibleDays.map(day => (
              <section className="trainer-agenda-day" key={day.date} aria-label={day.label}>
                <h3><span>{day.label} <time dateTime={day.date}>{formatBusinessDateTab(day.date)}</time></span><span>Занятий: {day.sessions.length}</span></h3>
                {day.sessions.length ? (
                  <ul className="trainer-agenda-sessions">
                    {day.sessions.map(session => (
                      <li key={session.id}>
                        <time dateTime={session.startsAt}>
                          {formatBusinessDateTime(session.startsAt, { hour: '2-digit', minute: '2-digit' })}
                        </time>
                        <div>
                          <strong>{session.bookings[0].services?.title || 'Тренировка'}</strong>
                          {session.bookings.map(booking => {
                            const details = booking.booking_details
                            const owner = details?.owner_name || booking.profiles?.email || booking.profiles?.phone
                            return <p key={booking.id}>{[details?.dog_name, owner].filter(Boolean).join(' · ') || 'Участник не указан'}</p>
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p className="trainer-agenda-empty">Предстоящих занятий нет.</p>}
              </section>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
