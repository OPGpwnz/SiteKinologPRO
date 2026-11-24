'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { emptyBookingDetails, validateBookingDetails, type BookingDetails } from '@/lib/booking-details'
import { getAuthErrorMessage, validateAuthCredentials } from '@/lib/auth-validation'
import {
  addCalendarDays,
  BUSINESS_TIME_ZONE,
  formatBusinessDateTime,
  formatBusinessDateTab,
  generateBulkScheduleSlots,
  getDateKeyInBusinessTimeZone,
  localDateTimeToIso,
  todayDateKey,
  validateBulkScheduleInput,
} from '@/lib/pitfly-time'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { BookingDetailsFields } from './BookingDetailsFields'
import { BookingDirectory } from './BookingDirectory'
import { TrainingLanding, TrainingLocation } from './TrainingLanding'

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

export type Booking = {
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
  booking_details?: (Omit<BookingDetails, 'city'> & { city?: string | null }) | null
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

const formatDate = (value: string) => formatBusinessDateTime(value)
const formatRubles = (value: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
const getDateKey = (value: string) => {
  const dateKey = getDateKeyInBusinessTimeZone(value)
  if (!dateKey) throw new RangeError(`Invalid slot timestamp: ${value}`)
  return dateKey
}
const formatDateTab = formatBusinessDateTab

export function PitflyApp() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const DEV_TRAINER = {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'momentfd@gmail.com',
    phone: '+7 (999) 000-00-00',
    role: 'trainer' as const,
  }
  const [isDevMode, setIsDevMode] = useState(false)
  const [tab, setTab] = useState<'home' | 'book' | 'cabinet' | 'admin'>('home')
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authMessage, setAuthMessage] = useState('')
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES)
  const [unavailableServiceCodes, setUnavailableServiceCodes] = useState<string[]>([])
  const [catalogWarning, setCatalogWarning] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [adminBookingsReady, setAdminBookingsReady] = useState(false)
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedBookingDate, setSelectedBookingDate] = useState('all')
  const [useSubscription, setUseSubscription] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(emptyBookingDetails)
  const [bookingError, setBookingError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [bulkWeekdays, setBulkWeekdays] = useState<number[]>([2])
  const [bulkStartDate, setBulkStartDate] = useState('')
  const [bulkEndDate, setBulkEndDate] = useState('')
  const [bulkHours, setBulkHours] = useState<number[]>([10, 11, 15, 18])
  const [bulkCapacity, setBulkCapacity] = useState(1)
  const [serviceFilter, setServiceFilter] = useState('all')
  const profileRefreshId = useRef(0)
  const authGeneration = useRef(0)

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
        p_timezone: BUSINESS_TIME_ZONE,
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
    const generation = authGeneration.current
    const [subscriptionsResult, bookingsResult] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('*')
        .eq('client_id', userId)
        .order('expires_at', { ascending: false }),
      supabase
        .from('bookings')
        .select('*, slots(*), services(*), booking_details(*)')
        .eq('client_id', userId)
        .order('created_at', { ascending: false }),
    ])

    if (generation !== authGeneration.current) return
    if (subscriptionsResult.error || bookingsResult.error) {
      setMessage('Не удалось загрузить данные кабинета. Попробуйте обновить страницу.')
      return
    }
    setSubscriptions(subscriptionsResult.data as Subscription[])
    setBookings(bookingsResult.data as unknown as Booking[])
  }, [supabase])

  const loadAdminData = useCallback(async () => {
    const generation = authGeneration.current
    const [bookingsResult, subscriptionsResult] = await Promise.all([
      supabase
        .from('bookings')
        .select('*, slots(*), services(*), profiles(email, phone), booking_details(*)')
        .order('created_at', { ascending: false }),
      supabase
        .from('subscriptions')
        .select('*, profiles(email, phone)')
        .order('expires_at', { ascending: false }),
    ])

    if (generation !== authGeneration.current) return
    setAdminBookingsReady(true)
    if (bookingsResult.error || subscriptionsResult.error) {
      setMessage('Не удалось загрузить данные админки. Проверьте роль тренера и RLS-политики Supabase.')
    }
    if (!bookingsResult.error) setAllBookings(bookingsResult.data as unknown as Booking[])
    if (!subscriptionsResult.error) setAllSubscriptions(subscriptionsResult.data as Subscription[])
  }, [supabase])

  const clearAuthState = useCallback(() => {
    profileRefreshId.current += 1
    authGeneration.current += 1
    setAuthUser(null)
    setProfile(null)
    setIsAdmin(false)
    setBookings([])
    setSubscriptions([])
    setAllBookings([])
    setAdminBookingsReady(false)
    setAllSubscriptions([])
    setBookingDetails(emptyBookingDetails)
    setBookingError('')
  }, [])

  const refreshProfile = useCallback(async (expectedUserId?: string): Promise<string | null> => {
    const requestId = ++profileRefreshId.current
    if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
      setIsDevMode(true)
      setProfile(DEV_TRAINER)
      setIsAdmin(true)
      return null
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (requestId !== profileRefreshId.current) return null
    if (sessionError) {
      console.error('Failed to read Supabase session from browser storage:', sessionError)
      clearAuthState()
      const errorMessage = `Не удалось восстановить сессию: ${sessionError.message}`
      setAuthMessage(errorMessage)
      return errorMessage
    }

    if (!session) {
      clearAuthState()
      return null
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (requestId !== profileRefreshId.current) return null
    if (userError) {
      console.error('Failed to restore Supabase user session:', userError)
      clearAuthState()
      const errorMessage = `Не удалось восстановить сессию: ${userError.message}`
      setAuthMessage(errorMessage)
      return errorMessage
    }

    if (!user) {
      clearAuthState()
      return null
    }

    if (expectedUserId && user.id !== expectedUserId) {
      console.error('Supabase user changed while refreshing the profile:', {
        expectedUserId,
        actualUserId: user.id,
      })
    }

    setAuthUser(user)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, phone, role')
      .eq('id', user.id)
      .maybeSingle()

    if (requestId !== profileRefreshId.current) return null
    if (error || !data) {
      const profileError = error ?? new Error('Профиль пользователя не найден в public.profiles.')
      console.error(`Failed to load profile for Supabase user ${user.id}:`, profileError)
      setProfile(null)
      setIsAdmin(false)
      const errorMessage = `Не удалось загрузить профиль: ${profileError.message}`
      setAuthMessage(errorMessage)
      return errorMessage
    }

    const nextProfile = data as Profile
    setProfile(nextProfile)
    setIsAdmin(nextProfile.role === 'trainer')
    await loadClientData(user.id)
    return null
  }, [supabase, loadClientData, clearAuthState])

  const restoreSession = useCallback(async () => {
    await refreshProfile()
  }, [refreshProfile])

  function seedDevData() {
    const now = new Date()
    const baseDate = todayDateKey(now)
    if (!baseDate) throw new RangeError('Unable to determine the current PITFLY date.')
    const createDevSlot = (id: string, daysAhead: number, hour: number, capacity: number): Slot => {
      const dateKey = addCalendarDays(baseDate, daysAhead)
      const startsAt = localDateTimeToIso(`${dateKey}T${String(hour).padStart(2, '0')}:00`)
      if (!startsAt) throw new RangeError(`Invalid development slot time: ${dateKey} ${hour}:00`)
      const starts = new Date(startsAt)
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
    setIsAdmin(true)
    seedDevData()
    setAuthMessage('')
    setMessage('Dev Mode: тестовый тренер активирован.')
  }

  useEffect(() => {
    let isMounted = true
    if (new URLSearchParams(window.location.search).get('authError') === 'callback') {
      setAuthMessage('Не удалось подтвердить email. Откройте ссылку из письма или войдите снова.')
    }

    const devSession = sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email
    if (devSession) {
      setIsDevMode(true)
      setProfile(DEV_TRAINER)
      setIsAdmin(true)
      seedDevData()
    } else {
      void loadCommonData()
      void restoreSession()
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) return

      if (event === 'INITIAL_SESSION') {
        setAuthUser(session?.user ?? null)
        return
      }

      if (event === 'SIGNED_OUT' || !session) {
        clearAuthState()
        return
      }

      setAuthUser(session.user)
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        window.setTimeout(() => {
          if (isMounted) void refreshProfile(session.user.id)
        }, 0)
      }
    })
    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [loadCommonData, restoreSession, refreshProfile, clearAuthState, supabase])

  useEffect(() => {
    if (isDevMode) return
    if (isAdmin && (tab === 'admin' || tab === 'cabinet')) {
      void loadAdminData()
    }
  }, [isDevMode, isAdmin, tab, loadAdminData])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [tab])

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

  async function submitAuthForm() {
    const validationError = validateAuthCredentials(email, password, authMode)
    if (validationError) {
      setAuthMessage(validationError)
      return
    }

    setLoading(true)
    setAuthMessage('')
    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) {
          console.error('Supabase password sign-in failed:', error)
          setAuthMessage(getAuthErrorMessage(error.code, error.message, authMode))
          return
        }
        if (!data.user) {
          console.error('Supabase password sign-in returned no user.')
          setAuthMessage('Не удалось войти. Повторите попытку.')
          return
        }

        setAuthUser(data.user)
        const profileError = await refreshProfile(data.user.id)
        router.refresh()
        setAuthMessage(profileError ?? 'Вход выполнен.')
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        console.error('Supabase sign-up failed:', error)
        setAuthMessage(getAuthErrorMessage(error.code, error.message, authMode))
        return
      }
      if (!data.user) {
        console.error('Supabase sign-up returned no user.')
        setAuthMessage('Не удалось создать аккаунт. Попробуйте ещё раз.')
        router.refresh()
        return
      }
      if (!data.session) {
        setAuthMessage('Регистрация выполнена. Подтвердите email по ссылке из письма, затем войдите.')
        router.refresh()
        return
      }

      setAuthUser(data.user)
      const profileError = await refreshProfile(data.user.id)
      router.refresh()
      setAuthMessage(profileError ?? 'Регистрация выполнена. Вы вошли.')
    } catch (error) {
      console.error('Unexpected Supabase authentication failure:', error)
      setAuthMessage('Не удалось связаться с сервисом авторизации. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
      sessionStorage.removeItem('pitfly_dev_session')
      setIsDevMode(false)
      clearAuthState()
      setMessage('Dev Mode отключен.')
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Failed to sign out from Supabase:', error)
      setMessage(`Не удалось выйти: ${error.message}`)
      return
    }
    clearAuthState()
    router.refresh()
  }

  async function createBooking() {
    if (loading) return
    setBookingError('')
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
      setBookingError('Эта услуга сейчас недоступна для онлайн-записи.')
      return
    }

    const validation = validateBookingDetails(bookingDetails)
    if ('error' in validation) {
      setBookingError(validation.error)
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
        booking_details: validation.details,
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
      setSelectedSlot('')
      setBookingDetails(emptyBookingDetails)
      setTab('cabinet')
      return
    }

    setMessage('')
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot,
          serviceCode: selectedService,
          useSubscription: useSubscription && !selectedServiceDetails?.is_subscription,
          details: validation.details,
        }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setBookingError(payload?.error || 'Не удалось создать запись.')
        return
      }
    } catch {
      setBookingError('Не удалось связаться с сервером. Проверьте кабинет перед повторной записью.')
      return
    } finally {
      setLoading(false)
    }

    setMessage(`Запись создана. Стоимость: ${useSubscription ? 'списано 1 занятие' : `${selectedServiceDetails?.price || 0} ₽`}.`)
    setSelectedSlot('')
    setBookingDetails(emptyBookingDetails)
    setTab('cabinet')
    await loadCommonData()
    await loadClientData(profile.id)
  }

  async function cancelBooking(id: string) {
    if (loading) return
    setLoading(true)
    if (isDevMode) {
      const booking = (isAdmin ? allBookings : bookings).find(item => item.id === id)
      if (!isAdmin && booking?.slots) {
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
    try {
      const response = await fetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setMessage(payload?.error || 'Не удалось отменить запись.')
        return
      }
      setMessage('Запись отменена.')
      await loadCommonData()
      if (profile) await loadClientData(profile.id)
      if (isAdmin) await loadAdminData()
    } catch {
      setMessage('Не удалось связаться с сервером. Проверьте статус записи в кабинете.')
    } finally {
      setLoading(false)
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
    const startsAt = localDateTimeToIso(selectedSlotDate)
    if (!startsAt) {
      setLoading(false)
      setMessage('Некорректная дата и время.')
      return
    }
    const starts = new Date(startsAt)
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
    const schedule = {
      startDate: bulkStartDate,
      endDate: bulkEndDate,
      weekdays: bulkWeekdays,
      hours: bulkHours,
      capacity: bulkCapacity,
    }
    const validationError = validateBulkScheduleInput(schedule)
    if (validationError) {
      setLoading(false)
      setMessage(validationError)
      return
    }
    if (isDevMode) {
      const generated: Slot[] = generateBulkScheduleSlots(schedule).map(slot => ({
        ...slot,
        id: `dev-slot-${slot.starts_at}`,
        booked_count: 0,
        available_places: slot.capacity,
      }))
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
    const start = todayDateKey()
    if (!start) {
      setMessage('Не удалось определить дату для расписания.')
      return
    }
    setBulkStartDate(start)
    setBulkEndDate(addCalendarDays(start, days - 1))
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

  async function deleteSlot(id: string) {
    if (!window.confirm('Удалить слот? Слоты, у которых есть записи, удалить нельзя.')) return
    if (isDevMode) {
      setSlots(prev => prev.filter(slot => slot.id !== id))
      setMessage('Dev Mode: слот удалён.')
      return
    }

    const response = await fetch(`/api/admin/slots/${id}`, { method: 'DELETE' })
    const payload = await response.json()
    setMessage(payload.error || 'Слот удалён.')
    if (response.ok) {
      await loadCommonData()
      await loadAdminData()
    }
  }

  async function markPaid(id: string) {
    if (loading) return
    if (isDevMode) {
      setAllBookings(prev => prev.map(booking =>
        booking.id === id ? { ...booking, payment_status: 'paid' } : booking))
      setMessage('Dev Mode: оплата отмечена.')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings/${id}/paid`, { method: 'PATCH' })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setMessage(payload?.error || 'Не удалось отметить оплату.')
        return
      }
      setMessage('Оплата отмечена.')
      await loadAdminData()
    } catch {
      setMessage('Не удалось связаться с сервером. Проверьте статус оплаты в кабинете.')
    } finally {
      setLoading(false)
    }
  }

  async function saveBookingDetails(id: string, details: BookingDetails) {
    const generation = authGeneration.current
    if (!isDevMode) {
      try {
        const response = await fetch(`/api/admin/bookings/${id}/details`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details),
        })
        const payload = await response.json()
        if (!response.ok) return payload.error || 'Не удалось сохранить данные записи.'
        details = payload.details
      } catch {
        return 'Не удалось связаться с сервером. Попробуйте ещё раз.'
      }
    }
    if (generation !== authGeneration.current) return
    const updateDetails = (booking: Booking) => booking.id === id ? { ...booking, booking_details: details } : booking
    setAllBookings(items => items.map(updateDetails))
    setBookings(items => items.map(updateDetails))
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
        <button className="pitfly-brand" type="button" aria-label="PITFLY, главная" onClick={() => setTab('home')}>
          <img src="/images/logo-chrome.png" alt="" />
          <strong>PITFLY</strong>
        </button>
        <nav className="desktop-nav" aria-label="Основная навигация">
          <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>Главная</button>
          <button className={tab === 'book' ? 'active' : ''} onClick={() => setTab('book')}>Запись</button>
          <button className={tab === 'cabinet' ? 'active' : ''} onClick={() => setTab('cabinet')}>Кабинет</button>
          {isAdmin && (
            <button className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}>Управление</button>
          )}
        </nav>
        <div className="header-account">
          {authUser || isDevMode ? (
            <button className="button secondary small" onClick={signOut}>Выйти</button>
          ) : (
            <button className="button secondary small" onClick={() => setTab('cabinet')}>Войти</button>
          )}
        </div>
      </header>

      <main>
        {message && <div className="notice" role="status">{message}</div>}
        {catalogWarning && tab === 'admin' && isAdmin && <div className="notice notice-card">{catalogWarning}</div>}

        <div className={`page-container${tab === 'home' ? ' landing-container' : ''}`}>
        {tab === 'home' && (
          <section className="home-screen">
            <TrainingLanding onBook={() => setTab('book')} />

            <section className="catalog" id="services" data-reveal aria-labelledby="catalog-title">
              <div className="catalog-head">
                <h2 id="catalog-title">Услуги и цены</h2>
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
                      aria-pressed={serviceFilter === value}
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
                  .map(service => (
                    <article className="service-card" key={service.code}>
                      <div className="card-meta">
                        <span className="time">{service.duration_min === 720 ? 'Весь день' : service.is_subscription ? '5 занятий' : `${service.duration_min} мин`}</span>
                      </div>
                      <h3>{service.title}</h3>
                      <p>{service.category === 'rent'
                        ? 'Аренда площадки и оборудования.'
                        : service.category === 'treadmill'
                          ? 'Контролируемая работа на беговой дорожке.'
                          : 'Индивидуальная физическая подготовка.'}</p>
                      <div className="card-foot">
                        <strong>{formatRubles(service.price)}</strong>
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
            </section>

            <TrainingLocation />
          </section>
        )}

        {tab === 'book' && (
          <section className="app-section booking-page">
            <div className="section-heading">
              <div className="eyebrow"><i /> Онлайн-запись</div>
              <h1>Запись на тренировку</h1>
            </div>
            {!profile && (
              <div className="notice notice-card">
                <button className="button secondary small" type="button" onClick={() => setTab('cabinet')}>Войти в кабинет</button>
                <span> Войдите, чтобы подтвердить запись.</span>
              </div>
            )}
            <form className="booking-form" onSubmit={event => { event.preventDefault(); void createBooking() }}>
              <label>
                Услуга
                <select value={selectedService} onChange={event => setSelectedService(event.target.value)}>
                  {services.map(service => (
                    <option key={service.code} value={service.code}>
                      {service.title} — {service.price} ₽{unavailableServiceCodes.includes(service.code) ? ' (запись недоступна)' : ''}
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
                      {formatBusinessDateTime(slot.starts_at, { weekday: 'short', day: '2-digit', month: 'short' })}
                    </span>
                    {isFullDayService ? (
                      <>
                        <strong>Весь день (08:00 – 22:00)</strong>
                        <small>• Свободно</small>
                      </>
                    ) : (
                      <>
                        <strong>{formatBusinessDateTime(slot.starts_at, { hour: '2-digit', minute: '2-digit' })}</strong>
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
              {selectedServiceDetails && !selectedServiceDetails.is_subscription && (
                <BookingDetailsFields value={bookingDetails} onChange={setBookingDetails} />
              )}
              {bookingError && <p className="field-error" role="alert">{bookingError}</p>}
              <button
                className="button"
                disabled={loading || !selectedSlot || !selectedServiceDetails || selectedServiceDetails.is_subscription}
              >
                {loading ? 'Запись...' : 'Подтвердить запись'}
              </button>
            </form>
          </section>
        )}

        {tab === 'cabinet' && (
          <section className="app-section cabinet-page">
            <h1>{isAdmin ? 'Кабинет тренера' : 'Личный кабинет'}</h1>
            {!profile ? (
              <div className="card">
                <form onSubmit={event => {
                  event.preventDefault()
                  void submitAuthForm()
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
                  <label>
                    Пароль
                    <input
                      type="password"
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                      autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                      minLength={authMode === 'signup' ? 6 : undefined}
                      required
                    />
                  </label>
                  <div className="auth-mode-tabs" role="tablist" aria-label="Способ авторизации">
                    <button
                      className={`button secondary ${authMode === 'login' ? 'selected' : ''}`}
                      type="button"
                      role="tab"
                      aria-selected={authMode === 'login'}
                      disabled={loading}
                      onClick={() => { setAuthMode('login'); setAuthMessage('') }}
                    >
                      Вход
                    </button>
                    <button
                      className={`button secondary ${authMode === 'signup' ? 'selected' : ''}`}
                      type="button"
                      role="tab"
                      aria-selected={authMode === 'signup'}
                      disabled={loading}
                      onClick={() => { setAuthMode('signup'); setAuthMessage('') }}
                    >
                      Регистрация
                    </button>
                  </div>
                  <button className="button" type="submit" disabled={loading}>
                    {loading
                      ? (authMode === 'login' ? 'Вход...' : 'Регистрация...')
                      : (authMode === 'login' ? 'Войти' : 'Создать аккаунт')}
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
                <div className="cabinet-account">
                  <p>{profile.email}</p>
                  {isAdmin && <button className="button secondary small" onClick={() => setTab('admin')}>Управление расписанием</button>}
                </div>
                {!isAdmin && activeSubscriptions.length > 0 && (
                  <div className="cabinet-grid">
                    {activeSubscriptions.map(subscription => (
                      <div className="card" key={subscription.id}>
                        <h2>Абонемент</h2>
                        <p>Осталось занятий: {subscription.total_lessons - subscription.used_lessons} из {subscription.total_lessons}</p>
                        <p className="muted">До {formatDate(subscription.expires_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
                <BookingDirectory
                  key={profile.id}
                  bookings={isAdmin ? allBookings : bookings}
                  ready={!isAdmin || isDevMode || adminBookingsReady}
                  busy={loading}
                  onSaveDetails={isAdmin ? saveBookingDetails : undefined}
                  onMarkPaid={isAdmin ? markPaid : undefined}
                  onCancel={cancelBooking}
                />
              </>
            )}
          </section>
        )}

        {tab === 'admin' && (
          <section className="admin-panel">
            {!isAdmin ? (
              <div className="card notice-card">Раздел доступен только профилям тренера.</div>
            ) : (
              <>
                <h1>Управление PITFLY</h1>
                <button className="button secondary small" onClick={() => setTab('cabinet')}>К записям клиентов</button>
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
                                <div className="slot-actions">
                                  <button className="button red small" disabled={loading} onClick={() => closeSlot(slot.id)}>
                                    Закрыть
                                  </button>
                                  <button className="button secondary small" disabled={loading} onClick={() => deleteSlot(slot.id)}>
                                    Удалить
                                  </button>
                                </div>
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
        {isAdmin && (
          <button className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}>Управление</button>
        )}
      </nav>
    </div>
  )
}
