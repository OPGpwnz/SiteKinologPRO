import assert from 'node:assert/strict'
import test from 'node:test'
import { compareBookingStart, getTrainerAgenda } from '../lib/pitfly-time.ts'

function booking(id, starts_at, ends_at, overrides = {}) {
  return { id, slot_id: id, pair_group_id: null, status: 'active', slots: { starts_at, ends_at }, ...overrides }
}

test('booking lists sort earliest first and keep undated rows after dated rows', () => {
  const early = booking('early', '2026-11-25T08:00:00Z', '2026-11-25T09:00:00Z', { status: 'cancelled' })
  const late = booking('late', '2026-11-26T08:00:00Z', '2026-11-26T09:00:00Z', { status: 'completed' })
  assert.deepEqual([{ id: 'unknown', slots: null }, late, early].sort(compareBookingStart).map(item => item.id), ['early', 'late', 'unknown'])
})

test('trainer agenda uses Moscow dates and counts a paired session once', () => {
  const now = new Date('2026-11-24T21:05:00Z')
  const pair = { slot_id: 'shared', pair_group_id: 'pair' }
  const bookings = [
    booking('tomorrow', '2026-11-25T21:00:00Z', '2026-11-25T22:00:00Z'),
    booking('pair-a', '2026-11-25T08:00:00Z', '2026-11-25T09:00:00Z', pair),
    booking('ended', '2026-11-24T21:00:00Z', '2026-11-24T21:04:00Z'),
    booking('cancelled', '2026-11-25T09:00:00Z', '2026-11-25T10:00:00Z', { status: 'cancelled' }),
    booking('pair-b', '2026-11-25T08:00:00Z', '2026-11-25T09:00:00Z', pair),
    booking('first', '2026-11-25T07:00:00Z', '2026-11-25T08:00:00Z'),
    booking('outside-period', '2026-11-26T21:00:00Z', '2026-11-26T22:00:00Z'),
  ]

  const days = getTrainerAgenda(bookings, now)
  assert.deepEqual(days.map(day => day.date), ['2026-11-25', '2026-11-26'])
  assert.deepEqual(days.map(day => day.sessions.map(session => session.bookings.map(item => item.id))), [
    [['first'], ['pair-a', 'pair-b']],
    [['tomorrow']],
  ])
})
