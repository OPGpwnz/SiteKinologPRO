import { bookingDetailFields, type BookingDetails } from '@/lib/booking-details'

export function BookingDetailsFields({ value, onChange }: {
  value: BookingDetails
  onChange: (value: BookingDetails) => void
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
              autoComplete={field.name === 'contact_phone' ? 'tel' : field.name === 'owner_name' ? 'name' : undefined}
              maxLength={field.maxLength}
              value={value[field.name]}
              onChange={event => onChange({ ...value, [field.name]: event.target.value })}
              required
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
