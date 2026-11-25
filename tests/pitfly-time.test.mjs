import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addCalendarDays,
  formatBusinessDateTime,
  generateBulkScheduleSlots,
  getDateKeyInBusinessTimeZone,
  localDateTimeToIso,
  validateBulkScheduleInput,
  weekdayForDateKey,
} from '../lib/pitfly-time.ts'
import {
  getAuthErrorMessage,
  validateAuthCredentials,
} from '../lib/auth-validation.ts'

test('Perm wall-clock inputs round-trip without a UTC display shift', () => {
  const startsAt = localDateTimeToIso('2026-01-15T09:00')
  const endsAt = localDateTimeToIso('2026-01-15T15:00')

  assert.equal(startsAt, '2026-01-15T04:00:00.000Z')
  assert.equal(endsAt, '2026-01-15T10:00:00.000Z')
  assert.equal(formatBusinessDateTime(startsAt, { hour: '2-digit', minute: '2-digit' }), '09:00')
  assert.equal(formatBusinessDateTime(endsAt, { hour: '2-digit', minute: '2-digit' }), '15:00')
})

test('business date keys, weekdays, and inclusive date arithmetic are timezone-stable', () => {
  assert.equal(getDateKeyInBusinessTimeZone('2026-01-15T19:30:00.000Z'), '2026-01-16')
  assert.equal(weekdayForDateKey('2026-01-03'), 6)
  assert.equal(weekdayForDateKey('2026-01-04'), 0)
  assert.equal(addCalendarDays('2026-01-31', 1), '2026-02-01')
  assert.equal(addCalendarDays('2026-03-01', -1), '2026-02-28')
})

test('bulk schedule selects the requested weekdays and includes both date boundaries', () => {
  const input = {
    startDate: '2026-01-03',
    endDate: '2026-01-04',
    weekdays: [6, 0],
    hours: [15, 9],
    capacity: 2,
  }
  const slots = generateBulkScheduleSlots(input, new Date('2026-01-01T00:00:00.000Z'))

  assert.deepEqual(slots.map(slot => slot.starts_at), [
    '2026-01-03T04:00:00.000Z',
    '2026-01-03T10:00:00.000Z',
    '2026-01-04T04:00:00.000Z',
    '2026-01-04T10:00:00.000Z',
  ])
  assert.ok(slots.every(slot => slot.capacity === 2 && slot.is_open))
  assert.ok(slots.every(slot =>
    new Date(slot.ends_at).getTime() - new Date(slot.starts_at).getTime() === 3600000,
  ))
})

test('bulk schedule handles a one-day range and omits slots that have already started', () => {
  const slots = generateBulkScheduleSlots({
    startDate: '2026-01-03',
    endDate: '2026-01-03',
    weekdays: [6],
    hours: [9, 15],
    capacity: 1,
  }, new Date('2026-01-03T07:00:00.000Z'))

  assert.deepEqual(slots.map(slot => slot.starts_at), ['2026-01-03T10:00:00.000Z'])
})

test('bulk schedule validation rejects reversed dates, invalid weekdays, and invalid hours', () => {
  const valid = {
    startDate: '2026-01-03',
    endDate: '2026-01-04',
    weekdays: [6],
    hours: [9],
    capacity: 1,
  }

  assert.match(validateBulkScheduleInput({ ...valid, startDate: '2026-01-05' }), /диапазон дат/)
  assert.match(validateBulkScheduleInput({ ...valid, weekdays: [7] }), /день недели/)
  assert.match(validateBulkScheduleInput({ ...valid, hours: [23] }), /рабочие часы/)
  assert.equal(validateBulkScheduleInput({ ...valid, startDate: '2026-02-30' }), 'Укажите корректные даты начала и окончания.')
  assert.equal(validateBulkScheduleInput({
    ...valid,
    startDate: '2026-01-01',
    endDate: '2027-01-02',
  }), null)
  assert.match(validateBulkScheduleInput({
    ...valid,
    startDate: '2026-01-01',
    endDate: '2027-01-03',
  }), /366 дней/)
})

test('auth form validation and common Supabase errors are translated to Russian', () => {
  assert.equal(validateAuthCredentials('', 'password', 'login'), 'Введите email.')
  assert.equal(validateAuthCredentials('not-an-email', 'password', 'login'), 'Введите корректный email.')
  assert.match(validateAuthCredentials('new@example.com', '12345', 'signup'), /минимум 6/)
  assert.equal(validateAuthCredentials('new@example.com', '123456', 'signup'), null)
  assert.equal(getAuthErrorMessage('invalid_credentials', 'Invalid login credentials', 'login'), 'Неверная почта или пароль.')
  assert.equal(getAuthErrorMessage('user_already_exists', 'User already registered', 'signup'), 'Аккаунт с таким email уже зарегистрирован.')
  assert.match(getAuthErrorMessage('weak_password', 'Password is too weak', 'signup'), /не менее 6/)
})
