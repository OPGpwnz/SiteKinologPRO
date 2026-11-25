export const BUSINESS_TIME_ZONE = 'Asia/Yekaterinburg'
export const BUSINESS_TIME_LABEL = 'Пермское время (UTC+5)'

export type BulkScheduleInput = {
  startDate: string
  endDate: string
  weekdays: number[]
  hours: number[]
  capacity: number
}

export type GeneratedSlot = {
  starts_at: string
  ends_at: string
  capacity: number
  is_open: true
}

type DateParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const formatters = new Map<string, Intl.DateTimeFormat>()

function getFormatter(timeZone: string) {
  let formatter = formatters.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
    formatters.set(timeZone, formatter)
  }
  return formatter
}

function getDateParts(value: Date, timeZone: string): DateParts {
  const parts = getFormatter(timeZone).formatToParts(value)
  const values = new Map(parts.map(part => [part.type, part.value]))
  return {
    year: Number(values.get('year')),
    month: Number(values.get('month')),
    day: Number(values.get('day')),
    hour: Number(values.get('hour')),
    minute: Number(values.get('minute')),
    second: Number(values.get('second')),
  }
}

function parseDateKey(dateKey: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < 100 || month < 1 || month > 12 || day < 1 || day > 31) return null

  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null
  }

  return { year, month, day }
}

const toDateKey = ({ year, month, day }: Pick<DateParts, 'year' | 'month' | 'day'>) =>
  `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

function getOffsetMilliseconds(timestamp: number, timeZone: string) {
  const wholeSecondTimestamp = Math.floor(timestamp / 1000) * 1000
  const parts = getDateParts(new Date(wholeSecondTimestamp), timeZone)
  const wallTimeAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )
  return wallTimeAsUtc - wholeSecondTimestamp
}

function dateTimeInTimeZone(
  dateKey: string,
  hour: number,
  minute: number,
  timeZone: string,
) {
  const date = parseDateKey(dateKey)
  if (!date
    || !Number.isInteger(hour) || hour < 0 || hour > 23
    || !Number.isInteger(minute) || minute < 0 || minute > 59) {
    return null
  }

  const wallTimeAsUtc = Date.UTC(date.year, date.month - 1, date.day, hour, minute)
  let timestamp = wallTimeAsUtc
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const adjusted = wallTimeAsUtc - getOffsetMilliseconds(timestamp, timeZone)
    if (adjusted === timestamp) break
    timestamp = adjusted
  }

  const result = new Date(timestamp)
  const resolved = getDateParts(result, timeZone)
  if (resolved.year !== date.year || resolved.month !== date.month || resolved.day !== date.day
    || resolved.hour !== hour || resolved.minute !== minute) {
    return null
  }
  return result
}

export function localDateTimeToIso(value: string) {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null

  const date = dateTimeInTimeZone(
    match[1],
    Number(match[2]),
    Number(match[3]),
    BUSINESS_TIME_ZONE,
  )
  return date?.toISOString() ?? null
}

export function getDateKeyInBusinessTimeZone(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value)
  if (!Number.isFinite(date.getTime())) return null
  return toDateKey(getDateParts(date, BUSINESS_TIME_ZONE))
}

export function todayDateKey(now = new Date()) {
  return getDateKeyInBusinessTimeZone(now)
}

export function addCalendarDays(dateKey: string, days: number) {
  const date = parseDateKey(dateKey)
  if (!date || !Number.isInteger(days)) {
    throw new RangeError('Invalid date key or day offset.')
  }

  const result = new Date(Date.UTC(date.year, date.month - 1, date.day + days))
  return toDateKey({
    year: result.getUTCFullYear(),
    month: result.getUTCMonth() + 1,
    day: result.getUTCDate(),
  })
}

export function weekdayForDateKey(dateKey: string) {
  const date = parseDateKey(dateKey)
  if (!date) return null
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay()
}

export function formatBusinessDateTime(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('ru-RU', {
    ...options,
    timeZone: BUSINESS_TIME_ZONE,
  }).format(date)
}

export function formatBusinessDateTab(dateKey: string) {
  const date = dateTimeInTimeZone(dateKey, 12, 0, BUSINESS_TIME_ZONE)
  if (!date) throw new RangeError(`Invalid business date: ${dateKey}`)
  return formatBusinessDateTime(date, { weekday: 'short', day: 'numeric', month: 'short' })
}

export function validateBulkScheduleInput(input: BulkScheduleInput) {
  const start = parseDateKey(input.startDate)
  const end = parseDateKey(input.endDate)
  if (!start || !end) return 'Укажите корректные даты начала и окончания.'

  const dayDifference = (
    Date.UTC(end.year, end.month - 1, end.day)
    - Date.UTC(start.year, start.month - 1, start.day)
  ) / 86400000
  if (dayDifference < 0 || dayDifference > 366) {
    return 'Проверьте диапазон дат: он не должен превышать 366 дней.'
  }

  if (!input.weekdays.length
    || input.weekdays.some(day => !Number.isInteger(day) || day < 0 || day > 6)) {
    return 'Выберите хотя бы один корректный день недели.'
  }

  if (!input.hours.length
    || input.hours.some(hour => !Number.isInteger(hour) || hour < 8 || hour > 22)) {
    return 'Выберите рабочие часы с 08:00 до 22:00.'
  }

  if (!Number.isInteger(input.capacity) || input.capacity < 1 || input.capacity > 2) {
    return 'Количество мест должно быть 1 или 2.'
  }

  return null
}

export function generateBulkScheduleSlots(input: BulkScheduleInput, now = new Date()): GeneratedSlot[] {
  const validationError = validateBulkScheduleInput(input)
  if (validationError) throw new RangeError(validationError)

  const slots: GeneratedSlot[] = []
  const weekdays = new Set(input.weekdays)
  const hours = [...new Set(input.hours)].sort((left, right) => left - right)
  let dateKey = input.startDate

  while (true) {
    const weekday = weekdayForDateKey(dateKey)
    if (weekday !== null && weekdays.has(weekday)) {
      for (const hour of hours) {
        const starts = dateTimeInTimeZone(dateKey, hour, 0, BUSINESS_TIME_ZONE)
        if (!starts) throw new RangeError(`Invalid local schedule time: ${dateKey} ${hour}:00`)
        if (starts <= now) continue

        slots.push({
          starts_at: starts.toISOString(),
          ends_at: new Date(starts.getTime() + 60 * 60000).toISOString(),
          capacity: input.capacity,
          is_open: true,
        })
      }
    }

    if (dateKey === input.endDate) break
    dateKey = addCalendarDays(dateKey, 1)
  }

  return slots
}

type ScheduledBooking = {
  id: string
  slot_id: string
  pair_group_id: string | null
  status: string
  slots?: { starts_at: string; ends_at: string } | null
}

export function compareBookingStart(left: ScheduledBooking, right: ScheduledBooking) {
  const leftTime = Date.parse(left.slots?.starts_at ?? '')
  const rightTime = Date.parse(right.slots?.starts_at ?? '')
  if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
    return Number(Number.isNaN(leftTime)) - Number(Number.isNaN(rightTime))
  }
  return leftTime - rightTime
}

export function getTrainerAgenda<T extends ScheduledBooking>(bookings: T[], now: Date) {
  const today = todayDateKey(now)
  if (!today) return []

  const days = [today, addCalendarDays(today, 1)].map(date => ({
    date,
    sessions: new Map<string, { id: string; startsAt: string; bookings: T[] }>(),
  }))

  for (const booking of [...bookings].sort(compareBookingStart)) {
    if (booking.status !== 'active' || !booking.slots || !(Date.parse(booking.slots.ends_at) > now.getTime())) continue
    const date = getDateKeyInBusinessTimeZone(booking.slots.starts_at)
    const day = days.find(item => item.date === date)
    if (!day) continue

    const id = booking.pair_group_id ? `${booking.slot_id}:${booking.pair_group_id}` : booking.id
    const session = day.sessions.get(id)
    if (session) session.bookings.push(booking)
    else day.sessions.set(id, { id, startsAt: booking.slots.starts_at, bookings: [booking] })
  }

  return days.map(({ date, sessions }) => ({ date, sessions: [...sessions.values()] }))
}
