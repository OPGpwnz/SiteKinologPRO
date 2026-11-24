import test from 'node:test'
import assert from 'node:assert/strict'
import { validateBookingDetails } from '../lib/booking-details.ts'

const details = {
  dog_name: 'Боня', dog_breed: 'Метис', dog_age: '8 месяцев',
  owner_name: 'Ольга', contact_phone: '+7 (900) 000-00-00',
}

test('booking details retain the age of a puppy and trim user input', () => {
  assert.deepEqual(validateBookingDetails({ ...details, owner_name: '  Ольга  ' }), { details })
})

test('all five booking details are required', () => {
  for (const field of Object.keys(details)) {
    assert.ok(validateBookingDetails({ ...details, [field]: '   ' }).error, field)
  }
})

test('booking details reject invalid contact numbers and oversized or non-text fields', () => {
  for (const phone of ['1234', 'позвонить позже', '1234567890123456', '9000000000 ext 101']) {
    assert.ok(validateBookingDetails({ ...details, contact_phone: phone }).error, phone)
  }
  assert.ok(validateBookingDetails({ ...details, dog_age: 8 }).error)
  assert.ok(validateBookingDetails({ ...details, dog_name: 'а'.repeat(81) }).error)
})
