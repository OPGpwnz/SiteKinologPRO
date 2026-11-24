import { bookingDetailFields, type BookingDetails } from '@/lib/booking-details'

export function BookingDetailsFields({ value, onChange, requireCity = true }: {
  value: BookingDetails
  onChange: (value: BookingDetails) => void
  requireCity?: boolean
}) {
  return (
    <fieldset className="booking-details-fields">
      <legend>Собака и хозяин</legend>
      <div className="booking-details-grid">
        {bookingDetailFields.map(field => (
          <label key={field.name}>
            {field.label}
            <input
              name={field.name}
              type={'type' in field ? field.type : 'text'}
              placeholder={'placeholder' in field ? field.placeholder : undefined}
              autoComplete={field.name === 'city' ? 'address-level2' : field.name === 'contact_phone' ? 'tel' : field.name === 'owner_name' ? 'name' : undefined}
              maxLength={field.maxLength}
              value={value[field.name]}
              onChange={event => onChange({ ...value, [field.name]: event.target.value })}
              required={field.name !== 'city' || requireCity}
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
