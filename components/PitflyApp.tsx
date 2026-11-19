'use client'

import { useCallback, useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'

type Service = {
  id: number
  code: string
  title: string
  price: number
  duration_min: number
  category: string
  requires_pair: boolean
  is_subscription: boolean
}

type Slot = {
  id: string
  starts_at: string
  ends_at: string
  capacity: number
  is_open: boolean
  booked_count?: number
  available_places?: number
  has_open_pair?: boolean
  date_has_active_bookings?: boolean
}

type Subscription = {
  id: string
  client_id: string
  total_lessons: number
  used_lessons: number
  expires_at: string
  status: 'active' | 'expired' | 'used_up'
  profiles?: { email: string | null; phone: string | null } | null
}

type Booking = {
  id: string
  slot_id: string
  client_id: string
  service_code: string
  pair_group_id: string | null
  subscription_id?: string | null
  status: 'active' | 'cancelled' | 'completed' | 'no_show'
  payment_status: 'unpaid' | 'paid'
  created_at: string
  slots?: Slot | null
  profiles?: { email: string | null; phone: string | null } | null
  services?: Service | null
}

type Profile = {
  id: string
  email: string
  phone: string | null
  role: 'client' | 'trainer'
}

const FALLBACK_SERVICES: Service[] = [
  { id: 1, code: 'trial', title: 'Первая тренировка', price: 1000, duration_min: 60, category: 'training', requires_pair: false, is_subscription: false },
  { id: 2, code: 'single_60', title: 'Разовая с тренером, 60 мин', price: 1800, duration_min: 60, category: 'training', requires_pair: false, is_subscription: false },
  { id: 3, code: 'single_40', title: 'Щенки / мелкие породы, 40 мин', price: 1800, duration_min: 40, category: 'training', requires_pair: false, is_subscription: false },
  { id: 4, code: 'subscription', title: 'Абонемент на 5 занятий', price: 7500, duration_min: 60, category: 'subscription', requires_pair: false, is_subscription: true },
  { id: 5, code: 'pair', title: 'Парная тренировка', price: 1000, duration_min: 60, category: 'training', requires_pair: true, is_subscription: false },
  { id: 6, code: 'rent_equipment', title: 'Аренда со снарядами, 60 мин', price: 800, duration_min: 60, category: 'rent', requires_pair: false, is_subscription: false },
  { id: 7, code: 'rent_plain', title: 'Аренда без снарядов, 60 мин', price: 500, duration_min: 60, category: 'rent', requires_pair: false, is_subscription: false },
  { id: 8, code: 'rent_day_plain', title: 'Полный день без снарядов', price: 5000, duration_min: 720, category: 'rent', requires_pair: false, is_subscription: false },
  { id: 9, code: 'rent_day_equipment', title: 'Полный день со снарядами', price: 8000, duration_min: 720, category: 'rent', requires_pair: false, is_subscription: false },
  { id: 10, code: 'treadmill_30', title: 'Беговая дорожка, 30 мин', price: 500, duration_min: 30, category: 'treadmill', requires_pair: false, is_subscription: false },
  { id: 11, code: 'treadmill_60', title: 'Беговая дорожка, 60 мин', price: 1000, duration_min: 60, category: 'treadmill', requires_pair: false, is_subscription: false },
]

const BULK_WEEKDAYS = [
  { value: 1, label: 'Пн' },
  { value: 2, label: 'Вт' },
  { value: 3, label: 'Ср' },
  { value: 4, label: 'Чт' },
  { value: 5, label: 'Пт' },
  { value: 6, label: 'Сб' },
  { value: 0, label: 'Вс' },
]
const BULK_HOURS = Array.from({ length: 15 }, (_, index) => index + 8)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
const formatRubles = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
const formatDateInput = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const getDateKey = (value: string) => {
  const date = new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const formatDateTab = (dateKey: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${dateKey}T12:00:00`))

export function PitflyApp() {
  const supabase = createSupabaseBrowserClient()
  const DEV_TRAINER = {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'momentfd@gmail.com',
    phone: '+7 (999) 000-00-00',
    role: 'trainer' as const,
  }
  const [isDevMode, setIsDevMode] = useState(false)
  const [tab, setTab] = useState<'home' | 'book' | 'cabinet' | 'admin'>('home')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'magic-link' | 'password'>('magic-link')
  const [authMessage, setAuthMessage] = useState('')
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES)
  const [unavailableServiceCodes, setUnavailableServiceCodes] = useState<string[]>([])
  const [catalogWarning, setCatalogWarning] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedBookingDate, setSelectedBookingDate] = useState('all')
  const [useSubscription, setUseSubscription] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [bulkWeekdays, setBulkWeekdays] = useState<number[]>([2])
  const [bulkStartDate, setBulkStartDate] = useState('')
  const [bulkEndDate, setBulkEndDate] = useState('')
  const [bulkHours, setBulkHours] = useState<number[]>([10, 11, 15, 18])
  const [bulkCapacity, setBulkCapacity] = useState(1)
  const [serviceFilter, setServiceFilter] = useState('all')

  const loadCommonData = useCallback(async () => {
    if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
      setServices(FALLBACK_SERVICES)
      setUnavailableServiceCodes([])
      setCatalogWarning('')
      return
    }

    const [servicesResult, slotsResult] = await Promise.all([
      supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true }),
      supabase.rpc('get_available_pitfly_slots_v3', {
        p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      }),
    ])

    if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
      setServices(FALLBACK_SERVICES)
      setUnavailableServiceCodes([])
      setCatalogWarning('')
      return
    }

    const warnings: string[] = []
    if (servicesResult.error || !servicesResult.data?.length) {
      setServices(FALLBACK_SERVICES)
      setUnavailableServiceCodes(FALLBACK_SERVICES.map(service => service.code))
      warnings.push(
        servicesResult.error
          ? 'Не удалось загрузить каталог из Supabase. Показан встроенный прайс; для онлайн-записи услуги должны быть добавлены в services.'
          : 'Каталог Supabase пуст. Показан встроенный прайс; для онлайн-записи услуги должны быть добавлены в services.',
      )
    } else {
      const databaseServices = servicesResult.data as Service[]
      const existingCodes = new Set(databaseServices.map(service => service.code))
      const missingServices = FALLBACK_SERVICES.filter(service => !existingCodes.has(service.code))
      setServices([...databaseServices, ...missingServices])
      setUnavailableServiceCodes(missingServices.map(service => service.code))
      if (missingServices.length) {
        warnings.push(
          `Встроенный прайс дополнен услугами, отсутствующими в Supabase: ${missingServices.map(service => service.code).join(', ')}. Для онлайн-записи добавьте их в services.`,
        )
      }
    }

    if (!slotsResult.error) {
      const databaseSlots = (slotsResult.data || []) as Slot[]
      setSlots(prev => {
        const devSlots = sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email
          ? prev.filter(slot => slot.id.startsWith('dev-slot-'))
          : []
        return [...devSlots, ...databaseSlots]
      })
    } else {
      const { data: availableSlots, error: availableSlotsError } = await supabase.rpc('get_available_pitfly_slots_v2')

      if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
        setServices(FALLBACK_SERVICES)
        setUnavailableServiceCodes([])
        setCatalogWarning('')
        return
      }

      if (!availableSlotsError) {
        setSlots((availableSlots || []) as Slot[])
        warnings.push('Для бронирования полного дня примените SQL-миграцию с учетом занятости всех слотов.')
      } else {
        const { data: legacySlots, error: legacyError } = await supabase.rpc('get_available_pitfly_slots')
        if (!legacyError) {
          setSlots((legacySlots || []) as Slot[])
          warnings.push('Расписание загружено без признака открытой пары. Примените актуальную SQL-миграцию для точного фильтра парных слотов и бронирования полного дня.')
        } else {
          setSlots([])
          warnings.push('Не удалось проверить доступность слотов. Примените актуальную SQL-миграцию и обновите страницу.')
        }
      }
    }
    setCatalogWarning(warnings.join(' '))
  }, [supabase])

  const loadClientData = useCallback(async (userId: string) => {
    const [subscriptionsResult, bookingsResult] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('*')
        .eq('client_id', userId)
        .order('expires_at', { ascending: false }),
      supabase
        .from('bookings')
        .select('*, slots(*), services(*)')
        .eq('client_id', userId)
        .order('created_at', { ascending: false }),
    ])

    if (subscriptionsResult.error || bookingsResult.error) {
      setMessage('Не удалось загрузить данные кабинета. Проверьте RLS-политики Supabase.')
      return
    }
    setSubscriptions(subscriptionsResult.data as Subscription[])
    setBookings(bookingsResult.data as unknown as Booking[])
  }, [supabase])

  const loadAdminData = useCallback(async () => {
    const [bookingsResult, subscriptionsResult] = await Promise.all([
      supabase
        .from('bookings')
        .select('*, slots(*), services(*), profiles(email, phone)')
        .order('created_at', { ascending: false }),
      supabase
        .from('subscriptions')
        .select('*, profiles(email, phone)')
        .order('expires_at', { ascending: false }),
    ])

    if (bookingsResult.error || subscriptionsResult.error) {
      setMessage('Не удалось загрузить данные админки. Проверьте роль тренера и RLS-политики Supabase.')
      return
    }
    setAllBookings(bookingsResult.data as unknown as Booking[])
    setAllSubscriptions(subscriptionsResult.data as Subscription[])
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
      setIsDevMode(true)
      setProfile(DEV_TRAINER)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setProfile(null)
      setBookings([])
      setSubscriptions([])
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      setProfile(data as Profile)
      await loadClientData(user.id)
    }
  }, [supabase, loadClientData])

  function seedDevData() {
    const now = new Date()
    const createDevSlot = (id: string, daysAhead: number, hour: number, capacity: number): Slot => {
      const starts = new Date(now)
      starts.setDate(starts.getDate() + daysAhead)
      starts.setHours(hour, 0, 0, 0)
      return {
        id,
        starts_at: starts.toISOString(),
        ends_at: new Date(starts.getTime() + 60 * 60000).toISOString(),
        capacity,
        is_open: true,
        booked_count: 0,
        available_places: capacity,
        has_open_pair: false,
      }
    }
    const mockSlot = createDevSlot('dev-slot-pair-1', 1, 10, 2)
    mockSlot.booked_count = 1
    mockSlot.available_places = 1
    mockSlot.has_open_pair = true
    const devSlots = [
      mockSlot,
      createDevSlot('dev-slot-training-1', 1, 14, 1),
      createDevSlot('dev-slot-training-2', 2, 10, 1),
      createDevSlot('dev-slot-training-3', 2, 15, 1),
      createDevSlot('dev-slot-pair-2', 3, 11, 2),
    ]
    const mockSubscription: Subscription = {
      id: 'dev-subscription-1',
      client_id: DEV_TRAINER.id,
      total_lessons: 5,
      used_lessons: 1,
      expires_at: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      profiles: { email: DEV_TRAINER.email, phone: DEV_TRAINER.phone },
    }
    const mockService: Service = {
      id: 999,
      code: 'pair',
      title: 'Парная тренировка',
      price: 1000,
      duration_min: 60,
      category: 'training',
      requires_pair: true,
      is_subscription: false,
    }
    const mockBooking: Booking = {
      id: 'dev-booking-1',
      slot_id: mockSlot.id,
      client_id: DEV_TRAINER.id,
      service_code: mockService.code,
      pair_group_id: 'dev-pair-1',
      status: 'active',
      payment_status: 'unpaid',
      created_at: now.toISOString(),
      slots: mockSlot,
      profiles: { email: DEV_TRAINER.email, phone: DEV_TRAINER.phone },
      services: mockService,
    }

    setSubscriptions([mockSubscription])
    setBookings([mockBooking])
    setAllSubscriptions([mockSubscription])
    setAllBookings([mockBooking])
    setServices(FALLBACK_SERVICES)
    setUnavailableServiceCodes([])
    setCatalogWarning('')
    setSlots(devSlots)
  }

  function enterDevMode() {
    sessionStorage.setItem('pitfly_dev_session', DEV_TRAINER.email)
    setIsDevMode(true)
    setProfile(DEV_TRAINER)
    seedDevData()
    setAuthMessage('')
    setMessage('Dev Mode: тестовый тренер активирован.')
  }

  useEffect(() => {
    const devSession = sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email
    if (devSession) {
      setIsDevMode(true)
      setProfile(DEV_TRAINER)
      seedDevData()
    } else {
      void loadCommonData()
      void refreshProfile()
    }

    const { data } = supabase.auth.onAuthStateChange(() => {
      if (sessionStorage.getItem('pitfly_dev_session') !== DEV_TRAINER.email) {
        void refreshProfile()
      }
    })
    return () => data.subscription.unsubscribe()
  }, [loadCommonData, refreshProfile, supabase])

  useEffect(() => {
    if (isDevMode) return
    if (profile?.role === 'trainer' && tab === 'admin') {
      void loadAdminData()
    }
  }, [isDevMode, profile, tab, loadAdminData])

  useEffect(() => {
    if (services.length && !services.some(service => service.code === selectedService)) {
      setSelectedService(services[0].code)
    }
  }, [services, selectedService])

  const selectedServiceDetails = services.find(service => service.code === selectedService) || null
  useEffect(() => {
    if (selectedServiceDetails?.is_subscription && useSubscription) {
      setUseSubscription(false)
    }
  }, [selectedServiceDetails, useSubscription])
  const isFullDayService = selectedServiceDetails?.duration_min === 720
  const futureSlots = slots.filter(slot => new Date(slot.starts_at).getTime() > Date.now())
  const fullDaySlotsByDate = new Map<string, Slot[]>()
  if (isFullDayService) {
    futureSlots.forEach(slot => {
      const dateKey = getDateKey(slot.starts_at)
      const dateSlots = fullDaySlotsByDate.get(dateKey) || []
      dateSlots.push(slot)
      fullDaySlotsByDate.set(dateKey, dateSlots)
    })
  }
  const fullDayBookableSlots = isFullDayService
    ? [...fullDaySlotsByDate.values()].flatMap(dateSlots => {
        const openSlots = dateSlots
          .filter(slot => slot.is_open)
          .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
        const hasUnknownBookingCounts = dateSlots.some(slot => slot.booked_count === undefined)
        const hasBookings = dateSlots.some(slot =>
          slot.booked_count !== 0 || slot.date_has_active_bookings === true,
        )
        if (!openSlots.length || hasUnknownBookingCounts || hasBookings) return []
        return [openSlots[0]]
      })
    : []
  const bookableSlots = selectedServiceDetails && !selectedServiceDetails.is_subscription
    ? isFullDayService
      ? fullDayBookableSlots
      : futureSlots.filter(slot => {
          const bookedCount = slot.booked_count
            ?? (slot.available_places === undefined ? 0 : slot.capacity - slot.available_places)
          const freePlaces = slot.capacity - bookedCount
          const capacityMatches = selectedServiceDetails.requires_pair
            ? slot.capacity >= 2 && (freePlaces >= 2 || slot.has_open_pair === true)
            : bookedCount < slot.capacity
          return slot.is_open && capacityMatches
        })
    : []
  const availableBookingDates = [...new Set(bookableSlots.map(slot => getDateKey(slot.starts_at)))].sort()
  const visibleBookingSlots = selectedBookingDate === 'all'
    ? bookableSlots
    : bookableSlots.filter(slot => getDateKey(slot.starts_at) === selectedBookingDate)

  useEffect(() => {
    if (selectedSlot && !bookableSlots.some(slot => slot.id === selectedSlot)) {
      setSelectedSlot('')
    }
  }, [selectedSlot, bookableSlots])

  useEffect(() => {
    if (selectedBookingDate !== 'all' && !availableBookingDates.includes(selectedBookingDate)) {
      setSelectedBookingDate('all')
    }
  }, [selectedBookingDate, availableBookingDates])

  async function sendOtp() {
    setLoading(true)
    setAuthMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    setAuthMessage(error ? error.message : 'Ссылка для входа отправлена на email.')
  }

  async function signInWithPassword() {
    setLoading(true)
    setAuthMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    setAuthMessage(error ? error.message : 'Вход выполнен.')
  }

  async function signOut() {
    if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
      sessionStorage.removeItem('pitfly_dev_session')
      setIsDevMode(false)
      setProfile(null)
      setBookings([])
      setSubscriptions([])
      setAllBookings([])
      setAllSubscriptions([])
      setMessage('Dev Mode отключен.')
      return
    }
    await supabase.auth.signOut()
    setProfile(null)
  }

  async function createBooking() {
    if (!profile) {
      setMessage('Для записи войдите по email.')
      setTab('cabinet')
      return
    }
    if (!selectedSlot || !selectedService) {
      setMessage('Выберите слот и услугу.')
      return
    }
    if (selectedServiceDetails?.is_subscription) {
      setMessage('Покупка абонемента через онлайн-запись пока не подключена. Свяжитесь с тренером.')
      return
    }
    if (!isDevMode && unavailableServiceCodes.includes(selectedService)) {
      setMessage(`Услуга ${selectedService} отсутствует в таблице services. Добавьте её в Supabase перед записью.`)
      return
    }

    setLoading(true)
    if (isDevMode) {
      const service = selectedServiceDetails
      const slot = bookableSlots.find(item => item.id === selectedSlot)
      if (!service || !slot) {
        setLoading(false)
        setMessage('Выберите услугу и подходящий свободный слот.')
        return
      }
      const activeBookingCount = allBookings.filter(
        booking => booking.slot_id === slot.id && booking.status === 'active',
      ).length
      if (activeBookingCount >= slot.capacity) {
        setSlots(prev => prev.filter(item => item.id !== slot.id))
        setLoading(false)
        setMessage('В этом слоте больше нет свободных мест. Выберите другое время.')
        return
      }

      const activeSubscription = useSubscription
        ? subscriptions.find(item =>
            item.status === 'active'
            && new Date(item.expires_at) > new Date()
            && item.used_lessons < item.total_lessons,
          )
        : undefined
      if (useSubscription && (!activeSubscription || service.is_subscription)) {
        setLoading(false)
        setMessage(service.is_subscription
          ? 'Абонемент нельзя оплатить списанием с другого абонемента.'
          : 'Нет активного абонемента с доступными занятиями.')
        return
      }

      const pairBooking = service.requires_pair
        ? allBookings.find(booking =>
            booking.slot_id === slot.id && booking.status === 'active' && booking.pair_group_id,
          )
        : undefined
      const devBooking: Booking = {
        id: `dev-booking-${Date.now()}`,
        slot_id: slot.id,
        client_id: DEV_TRAINER.id,
        service_code: service.code,
        pair_group_id: service.requires_pair
          ? pairBooking?.pair_group_id || crypto.randomUUID()
          : null,
        subscription_id: activeSubscription?.id || null,
        status: 'active',
        payment_status: useSubscription || service.is_subscription ? 'paid' : 'unpaid',
        created_at: new Date().toISOString(),
        slots: slot,
        profiles: { email: DEV_TRAINER.email, phone: DEV_TRAINER.phone },
        services: service,
      }
      setBookings(prev => [devBooking, ...prev])
      setAllBookings(prev => [devBooking, ...prev])
      if (activeSubscription) {
        const updatedSubscription = {
          ...activeSubscription,
          used_lessons: activeSubscription.used_lessons + 1,
          status: activeSubscription.used_lessons + 1 >= activeSubscription.total_lessons
            ? 'used_up' as const
            : activeSubscription.status,
        }
        setSubscriptions(prev => prev.map(item =>
          item.id === updatedSubscription.id ? updatedSubscription : item))
        setAllSubscriptions(prev => prev.map(item =>
          item.id === updatedSubscription.id ? updatedSubscription : item))
      }
      setSlots(prev => prev.map(item => item.id === slot.id
        ? {
            ...item,
            booked_count: (item.booked_count ?? activeBookingCount) + 1,
            available_places: Math.max((item.available_places ?? item.capacity) - 1, 0),
            has_open_pair: service.requires_pair || item.has_open_pair,
          }
        : item))
      setLoading(false)
      setMessage(`Dev Mode: запись создана. Стоимость: ${useSubscription ? 'списано 1 занятие' : `${service.price} ₽`}.`)
      return
    }

    setMessage('')
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotId: selectedSlot,
        serviceCode: selectedService,
        useSubscription: useSubscription && !selectedServiceDetails?.is_subscription,
      }),
    })
    const payload = await response.json()
    setLoading(false)

    if (!response.ok) {
      setMessage(payload.error || 'Не удалось создать запись.')
      return
    }

    setMessage(`Запись создана. Стоимость: ${useSubscription ? 'списано 1 занятие' : `${selectedServiceDetails?.price || 0} ₽`}.`)
    await loadCommonData()
    await loadClientData(profile.id)
  }

  async function cancelBooking(id: string) {
    setLoading(true)
    if (isDevMode) {
      const booking = bookings.find(item => item.id === id)
      if (booking?.slots) {
        const hours = (new Date(booking.slots.starts_at).getTime() - Date.now()) / 3600000
        if (hours <= 5) {
          setLoading(false)
          setMessage('Свяжитесь с тренером')
          return
        }
      }
      setBookings(prev => prev.map(item => item.id === id ? { ...item, status: 'cancelled' } : item))
      setAllBookings(prev => prev.map(item => item.id === id ? { ...item, status: 'cancelled' } : item))
      if (booking?.slots) {
        const remainingPair = booking.pair_group_id
          ? allBookings.some(item =>
              item.id !== id
              && item.slot_id === booking.slot_id
              && item.status === 'active'
              && item.pair_group_id === booking.pair_group_id,
            )
          : false
        setSlots(prev => prev.map(slot => slot.id === booking.slot_id
          ? {
              ...slot,
              booked_count: Math.max((slot.booked_count ?? 1) - 1, 0),
              available_places: Math.min(
                (slot.available_places ?? slot.capacity) + 1,
                slot.capacity,
              ),
              has_open_pair: booking.pair_group_id ? remainingPair : slot.has_open_pair,
            }
          : slot))
      }
      if (booking?.subscription_id) {
        const subscription = subscriptions.find(item => item.id === booking.subscription_id)
        if (subscription) {
          const restored = {
            ...subscription,
            used_lessons: Math.max(subscription.used_lessons - 1, 0),
            status: 'active' as const,
          }
          setSubscriptions(prev => prev.map(item => item.id === restored.id ? restored : item))
          setAllSubscriptions(prev => prev.map(item => item.id === restored.id ? restored : item))
        }
      }
      setLoading(false)
      setMessage('Dev Mode: запись отменена.')
      return
    }
    const response = await fetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' })
    const payload = await response.json()
    setLoading(false)
    setMessage(payload.error || 'Запись отменена.')
    if (response.ok && profile) {
      await loadCommonData()
      await loadClientData(profile.id)
    }
  }

  async function createSlot() {
    setLoading(true)
    const selectedSlotDate = document.querySelector<HTMLInputElement>('#single-slot-date')?.value
    const duration = Number(document.querySelector<HTMLInputElement>('#single-slot-duration')?.value || 60)
    const capacity = Number(document.querySelector<HTMLInputElement>('#single-slot-capacity')?.value || 1)
    if (!selectedSlotDate) {
      setLoading(false)
      setMessage('Укажите дату и время.')
      return
    }
    const starts = new Date(selectedSlotDate)
    if (!Number.isFinite(starts.getTime())) {
      setLoading(false)
      setMessage('Некорректная дата и время.')
      return
    }
    if (starts <= new Date() || !Number.isInteger(duration) || duration < 1
      || !Number.isInteger(capacity) || capacity < 1 || capacity > 2) {
      setLoading(false)
      setMessage('Укажите будущее время, положительную длительность и 1 или 2 места.')
      return
    }
    const ends = new Date(starts.getTime() + duration * 60000)
    if (isDevMode) {
      const slot: Slot = {
        id: `dev-slot-${Date.now()}`,
        starts_at: starts.toISOString(),
        ends_at: ends.toISOString(),
        capacity,
        is_open: true,
        booked_count: 0,
        available_places: capacity,
      }
      setSlots(prev => [slot, ...prev])
      setLoading(false)
      setMessage('Dev Mode: слот создан.')
      return
    }

    const response = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startsAt: starts.toISOString(),
        endsAt: ends.toISOString(),
        capacity,
      }),
    })
    const payload = await response.json()
    setLoading(false)
    setMessage(payload.error || 'Слот создан.')
    if (response.ok) await loadCommonData()
  }

  async function createBulkSlots() {
    setLoading(true)
    const cursor = new Date(`${bulkStartDate}T00:00:00`)
    const last = new Date(`${bulkEndDate}T23:59:59`)
    if (!bulkStartDate || !bulkEndDate || !Number.isFinite(cursor.getTime())
      || !Number.isFinite(last.getTime()) || cursor > last
      || !bulkWeekdays.length
      || bulkWeekdays.some(day => !Number.isInteger(day) || day < 0 || day > 6)
      || !bulkHours.length
      || bulkHours.some(hour => !Number.isInteger(hour) || hour < 8 || hour > 22)
      || !Number.isInteger(bulkCapacity) || bulkCapacity < 1 || bulkCapacity > 2) {
      setLoading(false)
      setMessage('Выберите период, хотя бы один день и час, а также тип слота.')
      return
    }
    if (isDevMode) {
      const generated: Slot[] = []
      for (let date = new Date(cursor); date <= last; date.setDate(date.getDate() + 1)) {
        if (!bulkWeekdays.includes(date.getDay())) continue
        for (const hour of bulkHours) {
          const starts = new Date(date)
          starts.setHours(hour, 0, 0, 0)
          if (starts <= new Date()) continue
          generated.push({
            id: `dev-slot-${starts.getTime()}`,
            starts_at: starts.toISOString(),
            ends_at: new Date(starts.getTime() + 60 * 60000).toISOString(),
            capacity: bulkCapacity,
            is_open: true,
            booked_count: 0,
            available_places: bulkCapacity,
          })
        }
      }
      if (!generated.length) {
        setLoading(false)
        setMessage('В выбранном периоде не осталось будущих слотов.')
        return
      }
      setSlots(prev => [...generated, ...prev])
      setLoading(false)
      setMessage(`Dev Mode: создано слотов: ${generated.length}.`)
      return
    }
    const response = await fetch('/api/admin/slots/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: bulkStartDate,
        endDate: bulkEndDate,
        weekdays: bulkWeekdays,
        hours: bulkHours,
        capacity: bulkCapacity,
      }),
    })
    const payload = await response.json()
    setLoading(false)
    setMessage(payload.error || `Создано слотов: ${payload.slots?.length || 0}.`)
    if (response.ok) await loadCommonData()
  }

  function applyBulkPeriod(days: 7 | 14 | 30) {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(end.getDate() + days - 1)
    setBulkStartDate(formatDateInput(start))
    setBulkEndDate(formatDateInput(end))
  }

  async function closeSlot(id: string) {
    if (isDevMode) {
      setSlots(prev => prev.filter(slot => slot.id !== id))
      setMessage('Dev Mode: слот закрыт.')
      return
    }
    const response = await fetch(`/api/admin/slots/${id}/close`, { method: 'PATCH' })
    const payload = await response.json()
    setMessage(payload.error || 'Слот закрыт.')
    if (response.ok) {
      await loadCommonData()
      await loadAdminData()
    }
  }

  async function markPaid(id: string) {
    if (isDevMode) {
      setAllBookings(prev => prev.map(booking =>
        booking.id === id ? { ...booking, payment_status: 'paid' } : booking))
      setMessage('Dev Mode: оплата отмечена.')
      return
    }
    const response = await fetch(`/api/admin/bookings/${id}/paid`, { method: 'PATCH' })
    const payload = await response.json()
    setMessage(payload.error || 'Оплата отмечена.')
    if (response.ok) await loadAdminData()
  }

  async function extendSubscription(id: string) {
    if (isDevMode) {
      setAllSubscriptions(prev => prev.map(subscription =>
        subscription.id === id
          ? {
              ...subscription,
              expires_at: new Date(
                Math.max(new Date(subscription.expires_at).getTime(), Date.now()) + 45 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              status: 'active',
            }
          : subscription))
      setSubscriptions(prev => prev.map(subscription =>
        subscription.id === id
          ? {
              ...subscription,
              expires_at: new Date(
                Math.max(new Date(subscription.expires_at).getTime(), Date.now()) + 45 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              status: 'active',
            }
          : subscription))
      setMessage('Dev Mode: абонемент продлён на 45 дней.')
      return
    }
    const response = await fetch(`/api/admin/subscriptions/${id}/extend`, { method: 'PATCH' })
    const payload = await response.json()
    setMessage(payload.error || 'Абонемент продлён на 45 дней.')
    if (response.ok) await loadAdminData()
  }

  const activeSubscriptions = subscriptions.filter(
    item => item.status === 'active'
      && new Date(item.expires_at) > new Date()
      && item.used_lessons < item.total_lessons,
  )
  const activeAdminSubscriptions = allSubscriptions.filter(
    item => item.status === 'active' && new Date(item.expires_at) > new Date(),
  )
  const paidBookingRevenue = allBookings.reduce((total, booking) => {
    if (booking.payment_status !== 'paid') return total
    const servicePrice = booking.services?.price
      ?? services.find(service => service.code === booking.service_code)?.price
      ?? 0
    return total + servicePrice
  }, 0)
  const totalRevenue = paidBookingRevenue + allSubscriptions.length * 7500
  const activeClientIds = new Set([
    ...allBookings.map(booking => booking.client_id),
    ...activeAdminSubscriptions.map(subscription => subscription.client_id),
  ])
  const completedLessons = allBookings.filter(booking => booking.status === 'completed').length
  const plannedLessons = allBookings.filter(booking => booking.status === 'active').length
  const remainingSubscriptionLessons = activeAdminSubscriptions.reduce(
    (total, subscription) => total + Math.max(subscription.total_lessons - subscription.used_lessons, 0),
    0,
  )

  return (
    <div className="pitfly-page">
      <header className="pitfly-header">
        <div className="pitfly-brand">
          <img src="/images/logo-chrome.png" alt="PITFLY" />
          <strong>PITFLY</strong>
        </div>
        <nav className="desktop-nav" aria-label="Основная навигация">
          <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>Главная</button>
          <button className={tab === 'book' ? 'active' : ''} onClick={() => setTab('book')}>Запись</button>
          <button className={tab === 'cabinet' ? 'active' : ''} onClick={() => setTab('cabinet')}>Кабинет</button>
          {profile?.role === 'trainer' && (
            <button className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}>Админ</button>
          )}
        </nav>
        <div className="header-account">
          {profile ? (
            <button className="button secondary small" onClick={signOut}>Выйти</button>
          ) : (
            <button className="button secondary small" onClick={() => setTab('cabinet')}>Войти</button>
          )}
        </div>
      </header>

      <main>
        {message && <div className="notice">{message}</div>}
        {catalogWarning && <div className="notice notice-card">{catalogWarning}</div>}

        <div className="page-container">
        {tab === 'home' && (
          <section className="home-screen">
            <div className="hero">
              <div className="hero-art" />
              <div className="scan-corner" />
              <div className="ruler" />
              <div className="hero-body">
                <div className="eyebrow"><i /> PITFLY / PERFORMANCE</div>
                <h1>Физическая<br />подготовка собак</h1>
                <p>Индивидуальные занятия под силу, выносливость и координацию конкретной собаки.</p>
                <button className="hero-cta" onClick={() => setTab('book')}>Записаться на занятие <span>→</span></button>
              </div>
              <div className="hero-figure">PITFLY / 01</div>
            </div>

            <div className="catalog">
              <div className="catalog-head">
                <div>
                  <div className="eyebrow"><i /> Услуги и направления</div>
                  <h2>Прайс PITFLY</h2>
                </div>
                <div className="filters" aria-label="Фильтр услуг">
                  {[
                    ['all', 'Все'],
                    ['training', 'Тренировки'],
                    ['subscription', 'Абонементы'],
                    ['rent', 'Аренда'],
                    ['treadmill', 'Дорожка'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      className={serviceFilter === value ? 'selected' : ''}
                      onClick={() => setServiceFilter(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="price-grid">
                {services
                  .filter(service => serviceFilter === 'all'
                    || (serviceFilter === 'subscription' && service.is_subscription)
                    || service.category === serviceFilter)
                  .map((service, index) => (
                    <article className="service-card" key={service.code}>
                      <div className="card-meta">
                        <span className="num">PF-{String(index + 1).padStart(2, '0')}</span>
                        <span className="time">{service.duration_min} MIN</span>
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.category === 'rent'
                        ? 'Аренда площадки и оборудования.'
                        : service.category === 'treadmill'
                          ? 'Контролируемая работа на беговой дорожке.'
                          : 'Индивидуальная физическая подготовка.'}</p>
                      <div className="card-foot">
                        <strong>{service.price} ₽</strong>
                        <button
                          className="choose"
                          onClick={() => {
                            setSelectedService(service.code)
                            setTab('book')
                          }}
                        >
                          Выбрать <span>→</span>
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            </div>

            <div className="individual-card">
              <div>
                <div className="eyebrow"><i /> Индивидуальный подход</div>
                <h2>Программа под конкретную собаку</h2>
              </div>
              <p>Возраст, порода, физическое состояние и цель определяют формат занятий.</p>
            </div>
          </section>
        )}

        {tab === 'book' && (
          <section className="app-section booking-page">
            <div className="section-heading">
              <div className="eyebrow"><i /> Онлайн-запись</div>
              <h1>Выберите слот</h1>
            </div>
            {!profile && (
              <div className="notice notice-card">
                Для записи сначала войдите по email в личном кабинете.
              </div>
            )}
            <div className="booking-form">
              <label>
                Услуга
                <select value={selectedService} onChange={event => setSelectedService(event.target.value)}>
                  {services.map(service => (
                    <option key={service.code} value={service.code}>
                      {service.title} — {service.price} ₽{unavailableServiceCodes.includes(service.code) ? ' (нужно добавить в Supabase)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <div className="booking-date-tabs" role="tablist" aria-label="Доступные даты">
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedBookingDate === 'all'}
                  className={selectedBookingDate === 'all' ? 'selected' : ''}
                  onClick={() => setSelectedBookingDate('all')}
                >
                  Все даты
                </button>
                {availableBookingDates.map(dateKey => (
                  <button
                    type="button"
                    role="tab"
                    key={dateKey}
                    aria-selected={selectedBookingDate === dateKey}
                    className={selectedBookingDate === dateKey ? 'selected' : ''}
                    onClick={() => {
                      setSelectedBookingDate(dateKey)
                      setSelectedSlot('')
                    }}
                  >
                    {formatDateTab(dateKey)}
                  </button>
                ))}
              </div>
              <div className="slot-heading">
                <span>Доступное время</span>
                <span>{visibleBookingSlots.length} {isFullDayService ? 'дней' : 'слотов'}</span>
              </div>
              <div className="slot-grid">
                {visibleBookingSlots.length ? visibleBookingSlots.map(slot => (
                  <button
                    type="button"
                    key={slot.id}
                    className={`slot-card ${isFullDayService ? 'full-day-slot' : ''} ${selectedSlot === slot.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    <span className="slot-date">
                      {new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: '2-digit', month: 'short' }).format(new Date(slot.starts_at))}
                    </span>
                    {isFullDayService ? (
                      <>
                        <strong>Весь день (08:00 – 22:00)</strong>
                        <small>• Свободно</small>
                      </>
                    ) : (
                      <>
                        <strong>{new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(slot.starts_at))}</strong>
                        <small>
                          {slot.available_places === undefined
                            ? `Вместимость: ${slot.capacity}`
                            : `${slot.available_places} ${slot.available_places === 1 ? 'место свободно' : 'места свободно'}`}
                        </small>
                      </>
                    )}
                  </button>
                )) : (
                  <div className="notice notice-card slot-empty-state">
                    Нет слотов для выбранной услуги. Смените услугу или проверьте расписание.
                  </div>
                )}
              </div>
              {selectedServiceDetails && (
                <div className="booking-price">
                  <span>{selectedServiceDetails.title}</span>
                  <strong>
                    {useSubscription && !selectedServiceDetails.is_subscription
                      ? '1 занятие по абонементу'
                      : `${selectedServiceDetails.price} ₽`}
                  </strong>
                </div>
              )}
              {selectedServiceDetails?.is_subscription && (
                <div className="notice notice-card">
                  Покупка абонемента через онлайн-запись пока не подключена. Свяжитесь с тренером.
                </div>
              )}
              {activeSubscriptions.length > 0 && (
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={useSubscription && !selectedServiceDetails?.is_subscription}
                    disabled={selectedServiceDetails?.is_subscription}
                    onChange={event => setUseSubscription(event.target.checked)}
                  />
                  Списать занятие с абонемента
                </label>
              )}
              <button
                className="button"
                disabled={loading || !selectedSlot || !selectedServiceDetails || selectedServiceDetails.is_subscription}
                onClick={createBooking}
              >
                {loading ? 'Запись...' : 'Подтвердить запись'}
              </button>
            </div>
          </section>
        )}

        {tab === 'cabinet' && (
          <section className="app-section cabinet-page">
            <h1>Личный кабинет</h1>
            {!profile ? (
              <div className="card">
                <form onSubmit={event => {
                  event.preventDefault()
                  if (authMode === 'password') {
                    void signInWithPassword()
                  } else {
                    void sendOtp()
                  }
                }}>
                  <label>
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                  {authMode === 'password' && (
                    <label>
                      Пароль
                      <input
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                      />
                    </label>
                  )}
                  <button className="button" type="submit" disabled={loading}>
                    {loading
                      ? (authMode === 'password' ? 'Вход...' : 'Отправка...')
                      : (authMode === 'password' ? 'Войти' : 'Получить Magic Link')}
                  </button>
                  <button
                    className="button secondary auth-mode-toggle"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setAuthMode(authMode === 'magic-link' ? 'password' : 'magic-link')
                      setAuthMessage('')
                    }}
                  >
                    {authMode === 'magic-link' ? 'Войти по паролю' : 'Войти по Magic Link'}
                  </button>
                  {authMessage && <p className="muted">{authMessage}</p>}
                </form>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    type="button"
                    className="button dev-trainer-button"
                    disabled={loading}
                    onClick={enterDevMode}
                  >
                    Тестовый вход тренером (Dev Mode)
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="cabinet-grid">
                  <div className="card">
                    <h2>{profile.email}</h2>
                    <p className="muted">{profile.role === 'trainer' ? 'Тренер' : 'Клиент'}</p>
                  </div>
                  {activeSubscriptions.map(subscription => (
                    <div className="card" key={subscription.id}>
                      <h2>Абонемент</h2>
                      <p>
                        Осталось: {subscription.total_lessons - subscription.used_lessons} из {subscription.total_lessons}
                      </p>
                      <p className="muted">До {formatDate(subscription.expires_at)}</p>
                    </div>
                  ))}
                  {bookings.map(booking => (
                    <div className="card booking-row" key={booking.id}>
                      <div>
                        <h3>{booking.services?.title || booking.service_code}</h3>
                        <p>{booking.slots ? formatDate(booking.slots.starts_at) : 'Время не указано'}</p>
                        <p className="muted">
                          {booking.status === 'active' ? 'Активна' : booking.status}
                          {' · '}
                          {booking.payment_status === 'paid' ? 'Оплачено' : 'Не оплачено'}
                        </p>
                      </div>
                      {booking.status === 'active' && (
                        <button className="button red small" disabled={loading} onClick={() => cancelBooking(booking.id)}>
                          Отменить
                        </button>
                      )}
                    </div>
                  ))}
                  {!bookings.length && (
                    <div className="card muted">Записей пока нет.</div>
                  )}
                  {!activeSubscriptions.length && (
                    <div className="card muted">Активного абонемента нет.</div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {tab === 'admin' && (
          <section className="admin-panel">
            {profile?.role !== 'trainer' ? (
              <div className="card notice-card">Раздел доступен только профилям тренера.</div>
            ) : (
              <>
                <h1>Админ PITFLY</h1>
                <div className="admin-dashboard" aria-label="Статистика тренера">
                  <article className="admin-stat-card">
                    <span className="admin-stat-label">Общий заработок</span>
                    <strong>{formatRubles(totalRevenue)}</strong>
                    <small>{allBookings.filter(booking => booking.payment_status === 'paid').length} оплат · {allSubscriptions.length} абонементов</small>
                  </article>
                  <article className="admin-stat-card">
                    <span className="admin-stat-label">Активные клиенты</span>
                    <strong>{activeClientIds.size}</strong>
                    <small>С записями или действующим абонементом</small>
                  </article>
                  <article className="admin-stat-card">
                    <span className="admin-stat-label">Активные абонементы</span>
                    <strong>{activeAdminSubscriptions.length}</strong>
                    <small>Осталось занятий: {remainingSubscriptionLessons}</small>
                  </article>
                  <article className="admin-stat-card">
                    <span className="admin-stat-label">Проведено / запланировано</span>
                    <strong>{completedLessons} / {plannedLessons}</strong>
                    <small>Завершённые / активные записи</small>
                  </article>
                </div>
                <div className="admin-forms-grid">
                  <div className="card">
                    <h2>Создать одиночный слот</h2>
                    <label>
                      Дата и время
                      <input id="single-slot-date" type="datetime-local" />
                    </label>
                    <input id="single-slot-hour" type="hidden" value="10" />
                    <label>
                      Длительность, мин
                      <input id="single-slot-duration" type="number" defaultValue={60} min={1} />
                    </label>
                    <label>
                      Мест
                      <input id="single-slot-capacity" type="number" defaultValue={1} min={1} max={2} />
                    </label>
                    <button className="button" disabled={loading} onClick={createSlot}>Создать слот</button>
                  </div>
                  <div className="card bulk-generator">
                    <h2>Конструктор расписания</h2>
                  <div className="bulk-control">
                    <span className="bulk-label">Период</span>
                    <div className="bulk-tile-row bulk-periods">
                      <button type="button" className="bulk-tile" onClick={() => applyBulkPeriod(7)}>На 7 дней</button>
                      <button type="button" className="bulk-tile" onClick={() => applyBulkPeriod(14)}>На 14 дней</button>
                      <button type="button" className="bulk-tile" onClick={() => applyBulkPeriod(30)}>На 30 дней</button>
                    </div>
                    <div className="bulk-date-range">
                      <label>С
                        <input type="date" value={bulkStartDate} onChange={event => setBulkStartDate(event.target.value)} />
                      </label>
                      <label>По
                        <input type="date" value={bulkEndDate} onChange={event => setBulkEndDate(event.target.value)} />
                      </label>
                    </div>
                  </div>
                  <div className="bulk-control">
                    <span className="bulk-label">Дни недели</span>
                    <div className="bulk-tile-row bulk-weekdays">
                      {BULK_WEEKDAYS.map(day => (
                        <button
                          type="button"
                          key={day.value}
                          aria-pressed={bulkWeekdays.includes(day.value)}
                          className={`bulk-tile ${bulkWeekdays.includes(day.value) ? 'selected' : ''}`}
                          onClick={() => setBulkWeekdays(current => current.includes(day.value)
                            ? current.filter(value => value !== day.value)
                            : [...current, day.value])}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bulk-control">
                    <span className="bulk-label">Рабочие часы</span>
                    <div className="bulk-tile-row bulk-hours">
                      {BULK_HOURS.map(hour => (
                        <button
                          type="button"
                          key={hour}
                          aria-pressed={bulkHours.includes(hour)}
                          className={`bulk-tile ${bulkHours.includes(hour) ? 'selected' : ''}`}
                          onClick={() => setBulkHours(current => current.includes(hour)
                            ? current.filter(value => value !== hour)
                            : [...current, hour].sort((a, b) => a - b))}
                        >
                          {String(hour).padStart(2, '0')}:00
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bulk-control">
                    <span className="bulk-label">Тип слота</span>
                    <div className="bulk-tile-row bulk-slot-types">
                      <button
                        type="button"
                        aria-pressed={bulkCapacity === 1}
                        className={`bulk-tile ${bulkCapacity === 1 ? 'selected' : ''}`}
                        onClick={() => setBulkCapacity(1)}
                      >
                        Обычный · 1 место
                      </button>
                      <button
                        type="button"
                        aria-pressed={bulkCapacity === 2}
                        className={`bulk-tile ${bulkCapacity === 2 ? 'selected' : ''}`}
                        onClick={() => setBulkCapacity(2)}
                      >
                        Парный · 2 места
                      </button>
                    </div>
                  </div>
                    <button className="button bulk-submit" disabled={loading} onClick={createBulkSlots}>
                      {loading ? 'Генерирую...' : 'Сгенерировать расписание'}
                    </button>
                  </div>
                </div>
                <section className="admin-table-section">
                  <h2>Активные записи</h2>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Клиент</th><th>Услуга</th><th>Дата и время</th><th>Оплата</th><th>Действие</th></tr>
                      </thead>
                      <tbody>
                        {allBookings.filter(booking => booking.status === 'active').length ? (
                          allBookings.filter(booking => booking.status === 'active').map(booking => (
                            <tr key={booking.id}>
                              <td>{booking.profiles?.email || booking.profiles?.phone || booking.client_id}</td>
                              <td>{booking.services?.title || booking.service_code}</td>
                              <td>{booking.slots ? formatDate(booking.slots.starts_at) : 'Время не указано'}</td>
                              <td className={booking.payment_status === 'paid' ? 'status-paid' : 'muted'}>
                                {booking.payment_status === 'paid' ? 'Оплачено' : 'Не оплачено'}
                              </td>
                              <td>
                                {booking.payment_status !== 'paid' && (
                                  <button className="button small" disabled={loading} onClick={() => markPaid(booking.id)}>
                                    Отметить оплату
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td className="muted" colSpan={5}>Активных записей пока нет.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="admin-table-section">
                  <h2>Абонементы</h2>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Клиент</th><th>Занятия</th><th>Срок действия</th><th>Статус</th><th>Действие</th></tr>
                      </thead>
                      <tbody>
                        {allSubscriptions.length ? (
                          allSubscriptions.map(subscription => (
                            <tr key={subscription.id}>
                              <td>{subscription.profiles?.email || subscription.profiles?.phone || subscription.client_id}</td>
                              <td>{subscription.used_lessons} / {subscription.total_lessons} · осталось {Math.max(subscription.total_lessons - subscription.used_lessons, 0)}</td>
                              <td>{formatDate(subscription.expires_at)}</td>
                              <td>{subscription.status === 'active' && new Date(subscription.expires_at) > new Date()
                                ? 'Действует'
                                : subscription.status === 'active' ? 'Истёк' : subscription.status}</td>
                              <td>
                                <button className="button secondary small" disabled={loading} onClick={() => extendSubscription(subscription.id)}>
                                  Продлить на 45 дней
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td className="muted" colSpan={5}>Абонементов пока нет.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="admin-table-section">
                  <h2>Открытые слоты</h2>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Дата и время</th><th>Места</th><th>Действие</th></tr>
                      </thead>
                      <tbody>
                        {slots.length ? (
                          slots.map(slot => (
                            <tr key={slot.id}>
                              <td>{formatDate(slot.starts_at)}</td>
                              <td>{slot.available_places ?? slot.capacity} / {slot.capacity}</td>
                              <td>
                                <button className="button red small" disabled={loading} onClick={() => closeSlot(slot.id)}>
                                  Закрыть
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td className="muted" colSpan={3}>Открытых слотов нет.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </section>
        )}
        </div>
      </main>

      <nav className="tab-bar">
        <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>Главная</button>
        <button className={tab === 'book' ? 'active' : ''} onClick={() => setTab('book')}>Запись</button>
        <button className={tab === 'cabinet' ? 'active' : ''} onClick={() => setTab('cabinet')}>Кабинет</button>
        {profile?.role === 'trainer' && (
          <button className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}>Админ</button>
        )}
      </nav>
    </div>
  )
}
