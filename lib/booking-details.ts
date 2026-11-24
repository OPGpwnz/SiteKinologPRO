export const bookingDetailFields = [
  { name: 'dog_name', label: 'Кличка собаки', maxLength: 80 },
  { name: 'dog_breed', label: 'Порода', maxLength: 100 },
  { name: 'dog_age', label: 'Возраст собаки', maxLength: 40, placeholder: 'Например, 2 года или 8 месяцев' },
  { name: 'owner_name', label: 'Имя хозяина', maxLength: 100 },
  { name: 'contact_phone', label: 'Контактный телефон', maxLength: 32, type: 'tel', placeholder: '+7 900 000-00-00' },
  { name: 'city', label: 'Город', maxLength: 100, placeholder: 'Например, Пермь' },
] as const

export type BookingDetails = Record<(typeof bookingDetailFields)[number]['name'], string>

export const emptyBookingDetails: BookingDetails = {
  dog_name: '', dog_breed: '', dog_age: '', owner_name: '', contact_phone: '', city: '',
}

export function validateBookingDetails(input: unknown, { requireCity = true } = {}): { details: BookingDetails } | { error: string } {
  const payload = input && typeof input === 'object' ? input as Record<string, unknown> : {}
  const details = { ...emptyBookingDetails }

  for (const field of bookingDetailFields) {
    const value = payload[field.name]
    if (field.name === 'city' && !requireCity && (value == null || (typeof value === 'string' && !value.trim()))) continue
    if (typeof value !== 'string' || !value.trim() || value.trim().length > field.maxLength) {
      return { error: `Заполните поле «${field.label}» (до ${field.maxLength} символов).` }
    }
    details[field.name] = value.trim()
  }

  const digitCount = details.contact_phone.replace(/\D/g, '').length
  if (!/^\+?[0-9 ().-]+$/.test(details.contact_phone) || digitCount < 7 || digitCount > 15) {
    return { error: 'Укажите корректный контактный телефон.' }
  }

  return { details }
}
