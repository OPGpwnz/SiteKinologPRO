module.exports = [
"[project]/components/PitflyApp.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PitflyApp",
    ()=>PitflyApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const FALLBACK_SERVICES = [
    {
        id: 1,
        code: 'trial',
        title: 'Первая тренировка',
        price: 1000,
        duration_min: 60,
        category: 'training',
        requires_pair: false,
        is_subscription: false
    },
    {
        id: 2,
        code: 'single_60',
        title: 'Разовая с тренером, 60 мин',
        price: 1800,
        duration_min: 60,
        category: 'training',
        requires_pair: false,
        is_subscription: false
    },
    {
        id: 3,
        code: 'single_40',
        title: 'Щенки / мелкие породы, 40 мин',
        price: 1800,
        duration_min: 40,
        category: 'training',
        requires_pair: false,
        is_subscription: false
    },
    {
        id: 4,
        code: 'subscription',
        title: 'Абонемент на 5 занятий',
        price: 7500,
        duration_min: 60,
        category: 'subscription',
        requires_pair: false,
        is_subscription: true
    },
    {
        id: 5,
        code: 'pair',
        title: 'Парная тренировка',
        price: 1000,
        duration_min: 60,
        category: 'training',
        requires_pair: true,
        is_subscription: false
    },
    {
        id: 6,
        code: 'rent_equipment',
        title: 'Аренда со снарядами, 60 мин',
        price: 800,
        duration_min: 60,
        category: 'rent',
        requires_pair: false,
        is_subscription: false
    },
    {
        id: 7,
        code: 'rent_plain',
        title: 'Аренда без снарядов, 60 мин',
        price: 500,
        duration_min: 60,
        category: 'rent',
        requires_pair: false,
        is_subscription: false
    },
    {
        id: 8,
        code: 'rent_day_plain',
        title: 'Полный день без снарядов',
        price: 5000,
        duration_min: 720,
        category: 'rent',
        requires_pair: false,
        is_subscription: false
    },
    {
        id: 9,
        code: 'rent_day_equipment',
        title: 'Полный день со снарядами',
        price: 8000,
        duration_min: 720,
        category: 'rent',
        requires_pair: false,
        is_subscription: false
    },
    {
        id: 10,
        code: 'treadmill_30',
        title: 'Беговая дорожка, 30 мин',
        price: 500,
        duration_min: 30,
        category: 'treadmill',
        requires_pair: false,
        is_subscription: false
    },
    {
        id: 11,
        code: 'treadmill_60',
        title: 'Беговая дорожка, 60 мин',
        price: 1000,
        duration_min: 60,
        category: 'treadmill',
        requires_pair: false,
        is_subscription: false
    }
];
const BULK_WEEKDAYS = [
    {
        value: 1,
        label: 'Пн'
    },
    {
        value: 2,
        label: 'Вт'
    },
    {
        value: 3,
        label: 'Ср'
    },
    {
        value: 4,
        label: 'Чт'
    },
    {
        value: 5,
        label: 'Пт'
    },
    {
        value: 6,
        label: 'Сб'
    },
    {
        value: 0,
        label: 'Вс'
    }
];
const BULK_HOURS = Array.from({
    length: 15
}, (_, index)=>index + 8);
const formatDate = (value)=>new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(value));
const formatRubles = (value)=>new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    }).format(value);
const formatDateInput = (date)=>`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const getDateKey = (value)=>{
    const date = new Date(value);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const formatDateTab = (dateKey)=>new Intl.DateTimeFormat('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    }).format(new Date(`${dateKey}T12:00:00`));
function PitflyApp() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSupabaseBrowserClient"])();
    const DEV_TRAINER = {
        id: '00000000-0000-4000-8000-000000000001',
        email: 'momentfd@gmail.com',
        phone: '+7 (999) 000-00-00',
        role: 'trainer'
    };
    const [isDevMode, setIsDevMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('home');
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [authMessage, setAuthMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [services, setServices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(FALLBACK_SERVICES);
    const [unavailableServiceCodes, setUnavailableServiceCodes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [catalogWarning, setCatalogWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [slots, setSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [subscriptions, setSubscriptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [bookings, setBookings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allBookings, setAllBookings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allSubscriptions, setAllSubscriptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedSlot, setSelectedSlot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedService, setSelectedService] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedBookingDate, setSelectedBookingDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [useSubscription, setUseSubscription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bulkWeekdays, setBulkWeekdays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        2
    ]);
    const [bulkStartDate, setBulkStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [bulkEndDate, setBulkEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [bulkHours, setBulkHours] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        10,
        11,
        15,
        18
    ]);
    const [bulkCapacity, setBulkCapacity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [serviceFilter, setServiceFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const loadCommonData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
            setServices(FALLBACK_SERVICES);
            setUnavailableServiceCodes([]);
            setCatalogWarning('');
            return;
        }
        const [servicesResult, slotsResult] = await Promise.all([
            supabase.from('services').select('*').order('id', {
                ascending: true
            }),
            supabase.rpc('get_available_pitfly_slots_v3', {
                p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
            })
        ]);
        if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
            setServices(FALLBACK_SERVICES);
            setUnavailableServiceCodes([]);
            setCatalogWarning('');
            return;
        }
        const warnings = [];
        if (servicesResult.error || !servicesResult.data?.length) {
            setServices(FALLBACK_SERVICES);
            setUnavailableServiceCodes(FALLBACK_SERVICES.map((service)=>service.code));
            warnings.push(servicesResult.error ? 'Не удалось загрузить каталог из Supabase. Показан встроенный прайс; для онлайн-записи услуги должны быть добавлены в services.' : 'Каталог Supabase пуст. Показан встроенный прайс; для онлайн-записи услуги должны быть добавлены в services.');
        } else {
            const databaseServices = servicesResult.data;
            const existingCodes = new Set(databaseServices.map((service)=>service.code));
            const missingServices = FALLBACK_SERVICES.filter((service)=>!existingCodes.has(service.code));
            setServices([
                ...databaseServices,
                ...missingServices
            ]);
            setUnavailableServiceCodes(missingServices.map((service)=>service.code));
            if (missingServices.length) {
                warnings.push(`Встроенный прайс дополнен услугами, отсутствующими в Supabase: ${missingServices.map((service)=>service.code).join(', ')}. Для онлайн-записи добавьте их в services.`);
            }
        }
        if (!slotsResult.error) {
            const databaseSlots = slotsResult.data || [];
            setSlots((prev)=>{
                const devSlots = sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email ? prev.filter((slot)=>slot.id.startsWith('dev-slot-')) : [];
                return [
                    ...devSlots,
                    ...databaseSlots
                ];
            });
        } else {
            const { data: availableSlots, error: availableSlotsError } = await supabase.rpc('get_available_pitfly_slots_v2');
            if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
                setServices(FALLBACK_SERVICES);
                setUnavailableServiceCodes([]);
                setCatalogWarning('');
                return;
            }
            if (!availableSlotsError) {
                setSlots(availableSlots || []);
                warnings.push('Для бронирования полного дня примените SQL-миграцию с учетом занятости всех слотов.');
            } else {
                const { data: legacySlots, error: legacyError } = await supabase.rpc('get_available_pitfly_slots');
                if (!legacyError) {
                    setSlots(legacySlots || []);
                    warnings.push('Расписание загружено без признака открытой пары. Примените актуальную SQL-миграцию для точного фильтра парных слотов и бронирования полного дня.');
                } else {
                    setSlots([]);
                    warnings.push('Не удалось проверить доступность слотов. Примените актуальную SQL-миграцию и обновите страницу.');
                }
            }
        }
        setCatalogWarning(warnings.join(' '));
    }, [
        supabase
    ]);
    const loadClientData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (userId)=>{
        const [subscriptionsResult, bookingsResult] = await Promise.all([
            supabase.from('subscriptions').select('*').eq('client_id', userId).order('expires_at', {
                ascending: false
            }),
            supabase.from('bookings').select('*, slots(*), services(*)').eq('client_id', userId).order('created_at', {
                ascending: false
            })
        ]);
        if (subscriptionsResult.error || bookingsResult.error) {
            setMessage('Не удалось загрузить данные кабинета. Проверьте RLS-политики Supabase.');
            return;
        }
        setSubscriptions(subscriptionsResult.data);
        setBookings(bookingsResult.data);
    }, [
        supabase
    ]);
    const loadAdminData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const [bookingsResult, subscriptionsResult] = await Promise.all([
            supabase.from('bookings').select('*, slots(*), services(*), profiles(email, phone)').order('created_at', {
                ascending: false
            }),
            supabase.from('subscriptions').select('*, profiles(email, phone)').order('expires_at', {
                ascending: false
            })
        ]);
        if (bookingsResult.error || subscriptionsResult.error) {
            setMessage('Не удалось загрузить данные админки. Проверьте роль тренера и RLS-политики Supabase.');
            return;
        }
        setAllBookings(bookingsResult.data);
        setAllSubscriptions(subscriptionsResult.data);
    }, [
        supabase
    ]);
    const refreshProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
            setIsDevMode(true);
            setProfile(DEV_TRAINER);
            return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setProfile(null);
            setBookings([]);
            setSubscriptions([]);
            return;
        }
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (!error && data) {
            setProfile(data);
            await loadClientData(user.id);
        }
    }, [
        supabase,
        loadClientData
    ]);
    function seedDevData() {
        const now = new Date();
        const createDevSlot = (id, daysAhead, hour, capacity)=>{
            const starts = new Date(now);
            starts.setDate(starts.getDate() + daysAhead);
            starts.setHours(hour, 0, 0, 0);
            return {
                id,
                starts_at: starts.toISOString(),
                ends_at: new Date(starts.getTime() + 60 * 60000).toISOString(),
                capacity,
                is_open: true,
                booked_count: 0,
                available_places: capacity,
                has_open_pair: false
            };
        };
        const mockSlot = createDevSlot('dev-slot-pair-1', 1, 10, 2);
        mockSlot.booked_count = 1;
        mockSlot.available_places = 1;
        mockSlot.has_open_pair = true;
        const devSlots = [
            mockSlot,
            createDevSlot('dev-slot-training-1', 1, 14, 1),
            createDevSlot('dev-slot-training-2', 2, 10, 1),
            createDevSlot('dev-slot-training-3', 2, 15, 1),
            createDevSlot('dev-slot-pair-2', 3, 11, 2)
        ];
        const mockSubscription = {
            id: 'dev-subscription-1',
            client_id: DEV_TRAINER.id,
            total_lessons: 5,
            used_lessons: 1,
            expires_at: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            profiles: {
                email: DEV_TRAINER.email,
                phone: DEV_TRAINER.phone
            }
        };
        const mockService = {
            id: 999,
            code: 'pair',
            title: 'Парная тренировка',
            price: 1000,
            duration_min: 60,
            category: 'training',
            requires_pair: true,
            is_subscription: false
        };
        const mockBooking = {
            id: 'dev-booking-1',
            slot_id: mockSlot.id,
            client_id: DEV_TRAINER.id,
            service_code: mockService.code,
            pair_group_id: 'dev-pair-1',
            status: 'active',
            payment_status: 'unpaid',
            created_at: now.toISOString(),
            slots: mockSlot,
            profiles: {
                email: DEV_TRAINER.email,
                phone: DEV_TRAINER.phone
            },
            services: mockService
        };
        setSubscriptions([
            mockSubscription
        ]);
        setBookings([
            mockBooking
        ]);
        setAllSubscriptions([
            mockSubscription
        ]);
        setAllBookings([
            mockBooking
        ]);
        setServices(FALLBACK_SERVICES);
        setUnavailableServiceCodes([]);
        setCatalogWarning('');
        setSlots(devSlots);
    }
    function enterDevMode() {
        sessionStorage.setItem('pitfly_dev_session', DEV_TRAINER.email);
        setIsDevMode(true);
        setProfile(DEV_TRAINER);
        seedDevData();
        setAuthMessage('');
        setMessage('Dev Mode: тестовый тренер активирован.');
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const devSession = sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email;
        if (devSession) {
            setIsDevMode(true);
            setProfile(DEV_TRAINER);
            seedDevData();
        } else {
            void loadCommonData();
            void refreshProfile();
        }
        const { data } = supabase.auth.onAuthStateChange(()=>{
            if (sessionStorage.getItem('pitfly_dev_session') !== DEV_TRAINER.email) {
                void refreshProfile();
            }
        });
        return ()=>data.subscription.unsubscribe();
    }, [
        loadCommonData,
        refreshProfile,
        supabase
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isDevMode) return;
        if (profile?.role === 'trainer' && tab === 'admin') {
            void loadAdminData();
        }
    }, [
        isDevMode,
        profile,
        tab,
        loadAdminData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (services.length && !services.some((service)=>service.code === selectedService)) {
            setSelectedService(services[0].code);
        }
    }, [
        services,
        selectedService
    ]);
    const selectedServiceDetails = services.find((service)=>service.code === selectedService) || null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedServiceDetails?.is_subscription && useSubscription) {
            setUseSubscription(false);
        }
    }, [
        selectedServiceDetails,
        useSubscription
    ]);
    const isFullDayService = selectedServiceDetails?.duration_min === 720;
    const futureSlots = slots.filter((slot)=>new Date(slot.starts_at).getTime() > Date.now());
    const fullDaySlotsByDate = new Map();
    if (isFullDayService) {
        futureSlots.forEach((slot)=>{
            const dateKey = getDateKey(slot.starts_at);
            const dateSlots = fullDaySlotsByDate.get(dateKey) || [];
            dateSlots.push(slot);
            fullDaySlotsByDate.set(dateKey, dateSlots);
        });
    }
    const fullDayBookableSlots = isFullDayService ? [
        ...fullDaySlotsByDate.values()
    ].flatMap((dateSlots)=>{
        const openSlots = dateSlots.filter((slot)=>slot.is_open).sort((a, b)=>new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
        const hasUnknownBookingCounts = dateSlots.some((slot)=>slot.booked_count === undefined);
        const hasBookings = dateSlots.some((slot)=>slot.booked_count !== 0 || slot.date_has_active_bookings === true);
        if (!openSlots.length || hasUnknownBookingCounts || hasBookings) return [];
        return [
            openSlots[0]
        ];
    }) : [];
    const bookableSlots = selectedServiceDetails && !selectedServiceDetails.is_subscription ? isFullDayService ? fullDayBookableSlots : futureSlots.filter((slot)=>{
        const bookedCount = slot.booked_count ?? (slot.available_places === undefined ? 0 : slot.capacity - slot.available_places);
        const freePlaces = slot.capacity - bookedCount;
        const capacityMatches = selectedServiceDetails.requires_pair ? slot.capacity >= 2 && (freePlaces >= 2 || slot.has_open_pair === true) : bookedCount < slot.capacity;
        return slot.is_open && capacityMatches;
    }) : [];
    const availableBookingDates = [
        ...new Set(bookableSlots.map((slot)=>getDateKey(slot.starts_at)))
    ].sort();
    const visibleBookingSlots = selectedBookingDate === 'all' ? bookableSlots : bookableSlots.filter((slot)=>getDateKey(slot.starts_at) === selectedBookingDate);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedSlot && !bookableSlots.some((slot)=>slot.id === selectedSlot)) {
            setSelectedSlot('');
        }
    }, [
        selectedSlot,
        bookableSlots
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedBookingDate !== 'all' && !availableBookingDates.includes(selectedBookingDate)) {
            setSelectedBookingDate('all');
        }
    }, [
        selectedBookingDate,
        availableBookingDates
    ]);
    async function sendOtp() {
        setLoading(true);
        setAuthMessage('');
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });
        setLoading(false);
        setAuthMessage(error ? error.message : 'Ссылка для входа отправлена на email.');
    }
    async function signOut() {
        if (sessionStorage.getItem('pitfly_dev_session') === DEV_TRAINER.email) {
            sessionStorage.removeItem('pitfly_dev_session');
            setIsDevMode(false);
            setProfile(null);
            setBookings([]);
            setSubscriptions([]);
            setAllBookings([]);
            setAllSubscriptions([]);
            setMessage('Dev Mode отключен.');
            return;
        }
        await supabase.auth.signOut();
        setProfile(null);
    }
    async function createBooking() {
        if (!profile) {
            setMessage('Для записи войдите по email.');
            setTab('cabinet');
            return;
        }
        if (!selectedSlot || !selectedService) {
            setMessage('Выберите слот и услугу.');
            return;
        }
        if (selectedServiceDetails?.is_subscription) {
            setMessage('Покупка абонемента через онлайн-запись пока не подключена. Свяжитесь с тренером.');
            return;
        }
        if (!isDevMode && unavailableServiceCodes.includes(selectedService)) {
            setMessage(`Услуга ${selectedService} отсутствует в таблице services. Добавьте её в Supabase перед записью.`);
            return;
        }
        setLoading(true);
        if (isDevMode) {
            const service = selectedServiceDetails;
            const slot = bookableSlots.find((item)=>item.id === selectedSlot);
            if (!service || !slot) {
                setLoading(false);
                setMessage('Выберите услугу и подходящий свободный слот.');
                return;
            }
            const activeBookingCount = allBookings.filter((booking)=>booking.slot_id === slot.id && booking.status === 'active').length;
            if (activeBookingCount >= slot.capacity) {
                setSlots((prev)=>prev.filter((item)=>item.id !== slot.id));
                setLoading(false);
                setMessage('В этом слоте больше нет свободных мест. Выберите другое время.');
                return;
            }
            const activeSubscription = useSubscription ? subscriptions.find((item)=>item.status === 'active' && new Date(item.expires_at) > new Date() && item.used_lessons < item.total_lessons) : undefined;
            if (useSubscription && (!activeSubscription || service.is_subscription)) {
                setLoading(false);
                setMessage(service.is_subscription ? 'Абонемент нельзя оплатить списанием с другого абонемента.' : 'Нет активного абонемента с доступными занятиями.');
                return;
            }
            const pairBooking = service.requires_pair ? allBookings.find((booking)=>booking.slot_id === slot.id && booking.status === 'active' && booking.pair_group_id) : undefined;
            const devBooking = {
                id: `dev-booking-${Date.now()}`,
                slot_id: slot.id,
                client_id: DEV_TRAINER.id,
                service_code: service.code,
                pair_group_id: service.requires_pair ? pairBooking?.pair_group_id || crypto.randomUUID() : null,
                subscription_id: activeSubscription?.id || null,
                status: 'active',
                payment_status: useSubscription || service.is_subscription ? 'paid' : 'unpaid',
                created_at: new Date().toISOString(),
                slots: slot,
                profiles: {
                    email: DEV_TRAINER.email,
                    phone: DEV_TRAINER.phone
                },
                services: service
            };
            setBookings((prev)=>[
                    devBooking,
                    ...prev
                ]);
            setAllBookings((prev)=>[
                    devBooking,
                    ...prev
                ]);
            if (activeSubscription) {
                const updatedSubscription = {
                    ...activeSubscription,
                    used_lessons: activeSubscription.used_lessons + 1,
                    status: activeSubscription.used_lessons + 1 >= activeSubscription.total_lessons ? 'used_up' : activeSubscription.status
                };
                setSubscriptions((prev)=>prev.map((item)=>item.id === updatedSubscription.id ? updatedSubscription : item));
                setAllSubscriptions((prev)=>prev.map((item)=>item.id === updatedSubscription.id ? updatedSubscription : item));
            }
            setSlots((prev)=>prev.map((item)=>item.id === slot.id ? {
                        ...item,
                        booked_count: (item.booked_count ?? activeBookingCount) + 1,
                        available_places: Math.max((item.available_places ?? item.capacity) - 1, 0),
                        has_open_pair: service.requires_pair || item.has_open_pair
                    } : item));
            setLoading(false);
            setMessage(`Dev Mode: запись создана. Стоимость: ${useSubscription ? 'списано 1 занятие' : `${service.price} ₽`}.`);
            return;
        }
        setMessage('');
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                slotId: selectedSlot,
                serviceCode: selectedService,
                useSubscription: useSubscription && !selectedServiceDetails?.is_subscription
            })
        });
        const payload = await response.json();
        setLoading(false);
        if (!response.ok) {
            setMessage(payload.error || 'Не удалось создать запись.');
            return;
        }
        setMessage(`Запись создана. Стоимость: ${useSubscription ? 'списано 1 занятие' : `${selectedServiceDetails?.price || 0} ₽`}.`);
        await loadCommonData();
        await loadClientData(profile.id);
    }
    async function cancelBooking(id) {
        setLoading(true);
        if (isDevMode) {
            const booking = bookings.find((item)=>item.id === id);
            if (booking?.slots) {
                const hours = (new Date(booking.slots.starts_at).getTime() - Date.now()) / 3600000;
                if (hours <= 5) {
                    setLoading(false);
                    setMessage('Свяжитесь с тренером');
                    return;
                }
            }
            setBookings((prev)=>prev.map((item)=>item.id === id ? {
                        ...item,
                        status: 'cancelled'
                    } : item));
            setAllBookings((prev)=>prev.map((item)=>item.id === id ? {
                        ...item,
                        status: 'cancelled'
                    } : item));
            if (booking?.slots) {
                const remainingPair = booking.pair_group_id ? allBookings.some((item)=>item.id !== id && item.slot_id === booking.slot_id && item.status === 'active' && item.pair_group_id === booking.pair_group_id) : false;
                setSlots((prev)=>prev.map((slot)=>slot.id === booking.slot_id ? {
                            ...slot,
                            booked_count: Math.max((slot.booked_count ?? 1) - 1, 0),
                            available_places: Math.min((slot.available_places ?? slot.capacity) + 1, slot.capacity),
                            has_open_pair: booking.pair_group_id ? remainingPair : slot.has_open_pair
                        } : slot));
            }
            if (booking?.subscription_id) {
                const subscription = subscriptions.find((item)=>item.id === booking.subscription_id);
                if (subscription) {
                    const restored = {
                        ...subscription,
                        used_lessons: Math.max(subscription.used_lessons - 1, 0),
                        status: 'active'
                    };
                    setSubscriptions((prev)=>prev.map((item)=>item.id === restored.id ? restored : item));
                    setAllSubscriptions((prev)=>prev.map((item)=>item.id === restored.id ? restored : item));
                }
            }
            setLoading(false);
            setMessage('Dev Mode: запись отменена.');
            return;
        }
        const response = await fetch(`/api/bookings/${id}/cancel`, {
            method: 'PATCH'
        });
        const payload = await response.json();
        setLoading(false);
        setMessage(payload.error || 'Запись отменена.');
        if (response.ok && profile) {
            await loadCommonData();
            await loadClientData(profile.id);
        }
    }
    async function createSlot() {
        setLoading(true);
        const selectedSlotDate = document.querySelector('#single-slot-date')?.value;
        const duration = Number(document.querySelector('#single-slot-duration')?.value || 60);
        const capacity = Number(document.querySelector('#single-slot-capacity')?.value || 1);
        if (!selectedSlotDate) {
            setLoading(false);
            setMessage('Укажите дату и время.');
            return;
        }
        const starts = new Date(selectedSlotDate);
        if (!Number.isFinite(starts.getTime())) {
            setLoading(false);
            setMessage('Некорректная дата и время.');
            return;
        }
        if (starts <= new Date() || !Number.isInteger(duration) || duration < 1 || !Number.isInteger(capacity) || capacity < 1 || capacity > 2) {
            setLoading(false);
            setMessage('Укажите будущее время, положительную длительность и 1 или 2 места.');
            return;
        }
        const ends = new Date(starts.getTime() + duration * 60000);
        if (isDevMode) {
            const slot = {
                id: `dev-slot-${Date.now()}`,
                starts_at: starts.toISOString(),
                ends_at: ends.toISOString(),
                capacity,
                is_open: true,
                booked_count: 0,
                available_places: capacity
            };
            setSlots((prev)=>[
                    slot,
                    ...prev
                ]);
            setLoading(false);
            setMessage('Dev Mode: слот создан.');
            return;
        }
        const response = await fetch('/api/admin/slots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startsAt: starts.toISOString(),
                endsAt: ends.toISOString(),
                capacity
            })
        });
        const payload = await response.json();
        setLoading(false);
        setMessage(payload.error || 'Слот создан.');
        if (response.ok) await loadCommonData();
    }
    async function createBulkSlots() {
        setLoading(true);
        const cursor = new Date(`${bulkStartDate}T00:00:00`);
        const last = new Date(`${bulkEndDate}T23:59:59`);
        if (!bulkStartDate || !bulkEndDate || !Number.isFinite(cursor.getTime()) || !Number.isFinite(last.getTime()) || cursor > last || !bulkWeekdays.length || bulkWeekdays.some((day)=>!Number.isInteger(day) || day < 0 || day > 6) || !bulkHours.length || bulkHours.some((hour)=>!Number.isInteger(hour) || hour < 8 || hour > 22) || !Number.isInteger(bulkCapacity) || bulkCapacity < 1 || bulkCapacity > 2) {
            setLoading(false);
            setMessage('Выберите период, хотя бы один день и час, а также тип слота.');
            return;
        }
        if (isDevMode) {
            const generated = [];
            for(let date = new Date(cursor); date <= last; date.setDate(date.getDate() + 1)){
                if (!bulkWeekdays.includes(date.getDay())) continue;
                for (const hour of bulkHours){
                    const starts = new Date(date);
                    starts.setHours(hour, 0, 0, 0);
                    if (starts <= new Date()) continue;
                    generated.push({
                        id: `dev-slot-${starts.getTime()}`,
                        starts_at: starts.toISOString(),
                        ends_at: new Date(starts.getTime() + 60 * 60000).toISOString(),
                        capacity: bulkCapacity,
                        is_open: true,
                        booked_count: 0,
                        available_places: bulkCapacity
                    });
                }
            }
            if (!generated.length) {
                setLoading(false);
                setMessage('В выбранном периоде не осталось будущих слотов.');
                return;
            }
            setSlots((prev)=>[
                    ...generated,
                    ...prev
                ]);
            setLoading(false);
            setMessage(`Dev Mode: создано слотов: ${generated.length}.`);
            return;
        }
        const response = await fetch('/api/admin/slots/bulk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                startDate: bulkStartDate,
                endDate: bulkEndDate,
                weekdays: bulkWeekdays,
                hours: bulkHours,
                capacity: bulkCapacity
            })
        });
        const payload = await response.json();
        setLoading(false);
        setMessage(payload.error || `Создано слотов: ${payload.slots?.length || 0}.`);
        if (response.ok) await loadCommonData();
    }
    function applyBulkPeriod(days) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + days - 1);
        setBulkStartDate(formatDateInput(start));
        setBulkEndDate(formatDateInput(end));
    }
    async function closeSlot(id) {
        if (isDevMode) {
            setSlots((prev)=>prev.filter((slot)=>slot.id !== id));
            setMessage('Dev Mode: слот закрыт.');
            return;
        }
        const response = await fetch(`/api/admin/slots/${id}/close`, {
            method: 'PATCH'
        });
        const payload = await response.json();
        setMessage(payload.error || 'Слот закрыт.');
        if (response.ok) {
            await loadCommonData();
            await loadAdminData();
        }
    }
    async function markPaid(id) {
        if (isDevMode) {
            setAllBookings((prev)=>prev.map((booking)=>booking.id === id ? {
                        ...booking,
                        payment_status: 'paid'
                    } : booking));
            setMessage('Dev Mode: оплата отмечена.');
            return;
        }
        const response = await fetch(`/api/admin/bookings/${id}/paid`, {
            method: 'PATCH'
        });
        const payload = await response.json();
        setMessage(payload.error || 'Оплата отмечена.');
        if (response.ok) await loadAdminData();
    }
    async function extendSubscription(id) {
        if (isDevMode) {
            setAllSubscriptions((prev)=>prev.map((subscription)=>subscription.id === id ? {
                        ...subscription,
                        expires_at: new Date(Math.max(new Date(subscription.expires_at).getTime(), Date.now()) + 45 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'active'
                    } : subscription));
            setSubscriptions((prev)=>prev.map((subscription)=>subscription.id === id ? {
                        ...subscription,
                        expires_at: new Date(Math.max(new Date(subscription.expires_at).getTime(), Date.now()) + 45 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'active'
                    } : subscription));
            setMessage('Dev Mode: абонемент продлён на 45 дней.');
            return;
        }
        const response = await fetch(`/api/admin/subscriptions/${id}/extend`, {
            method: 'PATCH'
        });
        const payload = await response.json();
        setMessage(payload.error || 'Абонемент продлён на 45 дней.');
        if (response.ok) await loadAdminData();
    }
    const activeSubscriptions = subscriptions.filter((item)=>item.status === 'active' && new Date(item.expires_at) > new Date() && item.used_lessons < item.total_lessons);
    const activeAdminSubscriptions = allSubscriptions.filter((item)=>item.status === 'active' && new Date(item.expires_at) > new Date());
    const paidBookingRevenue = allBookings.reduce((total, booking)=>{
        if (booking.payment_status !== 'paid') return total;
        const servicePrice = booking.services?.price ?? services.find((service)=>service.code === booking.service_code)?.price ?? 0;
        return total + servicePrice;
    }, 0);
    const totalRevenue = paidBookingRevenue + allSubscriptions.length * 7500;
    const activeClientIds = new Set([
        ...allBookings.map((booking)=>booking.client_id),
        ...activeAdminSubscriptions.map((subscription)=>subscription.client_id)
    ]);
    const completedLessons = allBookings.filter((booking)=>booking.status === 'completed').length;
    const plannedLessons = allBookings.filter((booking)=>booking.status === 'active').length;
    const remainingSubscriptionLessons = activeAdminSubscriptions.reduce((total, subscription)=>total + Math.max(subscription.total_lessons - subscription.used_lessons, 0), 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pitfly-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "pitfly-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pitfly-brand",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/logo-chrome.png",
                                alt: "PITFLY"
                            }, void 0, false, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 896,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "PITFLY"
                            }, void 0, false, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 897,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 895,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "desktop-nav",
                        "aria-label": "Основная навигация",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: tab === 'home' ? 'active' : '',
                                onClick: ()=>setTab('home'),
                                children: "Главная"
                            }, void 0, false, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 900,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: tab === 'book' ? 'active' : '',
                                onClick: ()=>setTab('book'),
                                children: "Запись"
                            }, void 0, false, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 901,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: tab === 'cabinet' ? 'active' : '',
                                onClick: ()=>setTab('cabinet'),
                                children: "Кабинет"
                            }, void 0, false, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 902,
                                columnNumber: 11
                            }, this),
                            profile?.role === 'trainer' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: tab === 'admin' ? 'active' : '',
                                onClick: ()=>setTab('admin'),
                                children: "Админ"
                            }, void 0, false, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 904,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 899,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "header-account",
                        children: profile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "button secondary small",
                            onClick: signOut,
                            children: "Выйти"
                        }, void 0, false, {
                            fileName: "[project]/components/PitflyApp.tsx",
                            lineNumber: 909,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "button secondary small",
                            onClick: ()=>setTab('cabinet'),
                            children: "Войти"
                        }, void 0, false, {
                            fileName: "[project]/components/PitflyApp.tsx",
                            lineNumber: 911,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 907,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PitflyApp.tsx",
                lineNumber: 894,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                children: [
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "notice",
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 917,
                        columnNumber: 21
                    }, this),
                    catalogWarning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "notice notice-card",
                        children: catalogWarning
                    }, void 0, false, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 918,
                        columnNumber: 28
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "page-container",
                        children: [
                            tab === 'home' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "home-screen",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hero",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hero-art"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 924,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "scan-corner"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 925,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ruler"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 926,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hero-body",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "eyebrow",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 928,
                                                                columnNumber: 42
                                                            }, this),
                                                            " PITFLY / PERFORMANCE"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 928,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        children: [
                                                            "Физическая",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 929,
                                                                columnNumber: 31
                                                            }, this),
                                                            "подготовка собак"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 929,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Индивидуальные занятия под силу, выносливость и координацию конкретной собаки."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 930,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "hero-cta",
                                                        onClick: ()=>setTab('book'),
                                                        children: [
                                                            "Записаться на занятие ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "→"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 931,
                                                                columnNumber: 99
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 931,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 927,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hero-figure",
                                                children: "PITFLY / 01"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 933,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 923,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "catalog",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "catalog-head",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "eyebrow",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 939,
                                                                        columnNumber: 44
                                                                    }, this),
                                                                    " Услуги и направления"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 939,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                children: "Прайс PITFLY"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 940,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 938,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "filters",
                                                        "aria-label": "Фильтр услуг",
                                                        children: [
                                                            [
                                                                'all',
                                                                'Все'
                                                            ],
                                                            [
                                                                'training',
                                                                'Тренировки'
                                                            ],
                                                            [
                                                                'subscription',
                                                                'Абонементы'
                                                            ],
                                                            [
                                                                'rent',
                                                                'Аренда'
                                                            ],
                                                            [
                                                                'treadmill',
                                                                'Дорожка'
                                                            ]
                                                        ].map(([value, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: serviceFilter === value ? 'selected' : '',
                                                                onClick: ()=>setServiceFilter(value),
                                                                children: label
                                                            }, value, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 950,
                                                                columnNumber: 21
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 942,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 937,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "price-grid",
                                                children: services.filter((service)=>serviceFilter === 'all' || serviceFilter === 'subscription' && service.is_subscription || service.category === serviceFilter).map((service, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                        className: "service-card",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "card-meta",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "num",
                                                                        children: [
                                                                            "PF-",
                                                                            String(index + 1).padStart(2, '0')
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 969,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "time",
                                                                        children: [
                                                                            service.duration_min,
                                                                            " MIN"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 970,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 968,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                children: service.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 972,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: service.category === 'rent' ? 'Аренда площадки и оборудования.' : service.category === 'treadmill' ? 'Контролируемая работа на беговой дорожке.' : 'Индивидуальная физическая подготовка.'
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 973,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "card-foot",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: [
                                                                            service.price,
                                                                            " ₽"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 979,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "choose",
                                                                        onClick: ()=>{
                                                                            setSelectedService(service.code);
                                                                            setTab('book');
                                                                        },
                                                                        children: [
                                                                            "Выбрать ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "→"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 987,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 980,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 978,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, service.code, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 967,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 961,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 936,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "individual-card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "eyebrow",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 997,
                                                                columnNumber: 42
                                                            }, this),
                                                            " Индивидуальный подход"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 997,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        children: "Программа под конкретную собаку"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 998,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 996,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: "Возраст, порода, физическое состояние и цель определяют формат занятий."
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1000,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 995,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 922,
                                columnNumber: 11
                            }, this),
                            tab === 'book' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "app-section booking-page",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "section-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "eyebrow",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {}, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1008,
                                                        columnNumber: 40
                                                    }, this),
                                                    " Онлайн-запись"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1008,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                children: "Выберите слот"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1009,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 1007,
                                        columnNumber: 13
                                    }, this),
                                    !profile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "notice notice-card",
                                        children: "Для записи сначала войдите по email в личном кабинете."
                                    }, void 0, false, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 1012,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "booking-form",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "Услуга",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: selectedService,
                                                        onChange: (event)=>setSelectedService(event.target.value),
                                                        children: services.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: service.code,
                                                                children: [
                                                                    service.title,
                                                                    " — ",
                                                                    service.price,
                                                                    " ₽",
                                                                    unavailableServiceCodes.includes(service.code) ? ' (нужно добавить в Supabase)' : ''
                                                                ]
                                                            }, service.code, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1021,
                                                                columnNumber: 21
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1019,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1017,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "booking-date-tabs",
                                                role: "tablist",
                                                "aria-label": "Доступные даты",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        role: "tab",
                                                        "aria-selected": selectedBookingDate === 'all',
                                                        className: selectedBookingDate === 'all' ? 'selected' : '',
                                                        onClick: ()=>setSelectedBookingDate('all'),
                                                        children: "Все даты"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1028,
                                                        columnNumber: 17
                                                    }, this),
                                                    availableBookingDates.map((dateKey)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            role: "tab",
                                                            "aria-selected": selectedBookingDate === dateKey,
                                                            className: selectedBookingDate === dateKey ? 'selected' : '',
                                                            onClick: ()=>{
                                                                setSelectedBookingDate(dateKey);
                                                                setSelectedSlot('');
                                                            },
                                                            children: formatDateTab(dateKey)
                                                        }, dateKey, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1038,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1027,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "slot-heading",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Доступное время"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1054,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            visibleBookingSlots.length,
                                                            " ",
                                                            isFullDayService ? 'дней' : 'слотов'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1055,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1053,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "slot-grid",
                                                children: visibleBookingSlots.length ? visibleBookingSlots.map((slot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: `slot-card ${isFullDayService ? 'full-day-slot' : ''} ${selectedSlot === slot.id ? 'selected' : ''}`,
                                                        onClick: ()=>setSelectedSlot(slot.id),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "slot-date",
                                                                children: new Intl.DateTimeFormat('ru-RU', {
                                                                    weekday: 'short',
                                                                    day: '2-digit',
                                                                    month: 'short'
                                                                }).format(new Date(slot.starts_at))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1065,
                                                                columnNumber: 21
                                                            }, this),
                                                            isFullDayService ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Весь день (08:00 – 22:00)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1070,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                        children: "• Свободно"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1071,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1069,
                                                                columnNumber: 23
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: new Intl.DateTimeFormat('ru-RU', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        }).format(new Date(slot.starts_at))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1075,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                                        children: slot.available_places === undefined ? `Вместимость: ${slot.capacity}` : `${slot.available_places} ${slot.available_places === 1 ? 'место свободно' : 'места свободно'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1076,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1074,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, slot.id, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1059,
                                                        columnNumber: 19
                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "notice notice-card slot-empty-state",
                                                    children: "Нет слотов для выбранной услуги. Смените услугу или проверьте расписание."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1085,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1057,
                                                columnNumber: 15
                                            }, this),
                                            selectedServiceDetails && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "booking-price",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: selectedServiceDetails.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1092,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: useSubscription && !selectedServiceDetails.is_subscription ? '1 занятие по абонементу' : `${selectedServiceDetails.price} ₽`
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1093,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1091,
                                                columnNumber: 17
                                            }, this),
                                            selectedServiceDetails?.is_subscription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "notice notice-card",
                                                children: "Покупка абонемента через онлайн-запись пока не подключена. Свяжитесь с тренером."
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1101,
                                                columnNumber: 17
                                            }, this),
                                            activeSubscriptions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "check-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: useSubscription && !selectedServiceDetails?.is_subscription,
                                                        disabled: selectedServiceDetails?.is_subscription,
                                                        onChange: (event)=>setUseSubscription(event.target.checked)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1107,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Списать занятие с абонемента"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1106,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "button",
                                                disabled: loading || !selectedSlot || !selectedServiceDetails || selectedServiceDetails.is_subscription,
                                                onClick: createBooking,
                                                children: loading ? 'Запись...' : 'Подтвердить запись'
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1116,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 1016,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 1006,
                                columnNumber: 11
                            }, this),
                            tab === 'cabinet' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "app-section cabinet-page",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: "Личный кабинет"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 1129,
                                        columnNumber: 13
                                    }, this),
                                    !profile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "Email",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        value: email,
                                                        onChange: (event)=>setEmail(event.target.value),
                                                        placeholder: "name@example.com"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1134,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "button",
                                                disabled: loading,
                                                onClick: sendOtp,
                                                children: "Получить Magic Link"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1141,
                                                columnNumber: 17
                                            }, this),
                                            authMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "muted",
                                                children: authMessage
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1144,
                                                columnNumber: 33
                                            }, this),
                                            ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "button dev-trainer-button",
                                                disabled: loading,
                                                onClick: enterDevMode,
                                                children: "Тестовый вход тренером (Dev Mode)"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PitflyApp.tsx",
                                                lineNumber: 1146,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 1131,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "cabinet-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            children: profile.email
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1160,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "muted",
                                                            children: profile.role === 'trainer' ? 'Тренер' : 'Клиент'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1161,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1159,
                                                    columnNumber: 19
                                                }, this),
                                                activeSubscriptions.map((subscription)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "card",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                children: "Абонемент"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1165,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    "Осталось: ",
                                                                    subscription.total_lessons - subscription.used_lessons,
                                                                    " из ",
                                                                    subscription.total_lessons
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1166,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "muted",
                                                                children: [
                                                                    "До ",
                                                                    formatDate(subscription.expires_at)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1169,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, subscription.id, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1164,
                                                        columnNumber: 21
                                                    }, this)),
                                                bookings.map((booking)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "card booking-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        children: booking.services?.title || booking.service_code
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1175,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: booking.slots ? formatDate(booking.slots.starts_at) : 'Время не указано'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1176,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "muted",
                                                                        children: [
                                                                            booking.status === 'active' ? 'Активна' : booking.status,
                                                                            ' · ',
                                                                            booking.payment_status === 'paid' ? 'Оплачено' : 'Не оплачено'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1177,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1174,
                                                                columnNumber: 23
                                                            }, this),
                                                            booking.status === 'active' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "button red small",
                                                                disabled: loading,
                                                                onClick: ()=>cancelBooking(booking.id),
                                                                children: "Отменить"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1184,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, booking.id, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1173,
                                                        columnNumber: 21
                                                    }, this)),
                                                !bookings.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "card muted",
                                                    children: "Записей пока нет."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1191,
                                                    columnNumber: 21
                                                }, this),
                                                !activeSubscriptions.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "card muted",
                                                    children: "Активного абонемента нет."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1194,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/PitflyApp.tsx",
                                            lineNumber: 1158,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/PitflyApp.tsx",
                                        lineNumber: 1157,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 1128,
                                columnNumber: 11
                            }, this),
                            tab === 'admin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "admin-panel",
                                children: profile?.role !== 'trainer' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card notice-card",
                                    children: "Раздел доступен только профилям тренера."
                                }, void 0, false, {
                                    fileName: "[project]/components/PitflyApp.tsx",
                                    lineNumber: 1205,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            children: "Админ PITFLY"
                                        }, void 0, false, {
                                            fileName: "[project]/components/PitflyApp.tsx",
                                            lineNumber: 1208,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "admin-dashboard",
                                            "aria-label": "Статистика тренера",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                    className: "admin-stat-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "admin-stat-label",
                                                            children: "Общий заработок"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1211,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: formatRubles(totalRevenue)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1212,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: [
                                                                allBookings.filter((booking)=>booking.payment_status === 'paid').length,
                                                                " оплат · ",
                                                                allSubscriptions.length,
                                                                " абонементов"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1213,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1210,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                    className: "admin-stat-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "admin-stat-label",
                                                            children: "Активные клиенты"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1216,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: activeClientIds.size
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1217,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: "С записями или действующим абонементом"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1218,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1215,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                    className: "admin-stat-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "admin-stat-label",
                                                            children: "Активные абонементы"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1221,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: activeAdminSubscriptions.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1222,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: [
                                                                "Осталось занятий: ",
                                                                remainingSubscriptionLessons
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1223,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1220,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                    className: "admin-stat-card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "admin-stat-label",
                                                            children: "Проведено / запланировано"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1226,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: [
                                                                completedLessons,
                                                                " / ",
                                                                plannedLessons
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1227,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                            children: "Завершённые / активные записи"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1228,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1225,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/PitflyApp.tsx",
                                            lineNumber: 1209,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "admin-forms-grid",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "card",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            children: "Создать одиночный слот"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1233,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: [
                                                                "Дата и время",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: "single-slot-date",
                                                                    type: "datetime-local"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1236,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1234,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "single-slot-hour",
                                                            type: "hidden",
                                                            value: "10"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1238,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: [
                                                                "Длительность, мин",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: "single-slot-duration",
                                                                    type: "number",
                                                                    defaultValue: 60,
                                                                    min: 1
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1241,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1239,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            children: [
                                                                "Мест",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: "single-slot-capacity",
                                                                    type: "number",
                                                                    defaultValue: 1,
                                                                    min: 1,
                                                                    max: 2
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1245,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1243,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "button",
                                                            disabled: loading,
                                                            onClick: createSlot,
                                                            children: "Создать слот"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1247,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1232,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "card bulk-generator",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            children: "Конструктор расписания"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1250,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bulk-control",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "bulk-label",
                                                                    children: "Период"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1252,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bulk-tile-row bulk-periods",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            className: "bulk-tile",
                                                                            onClick: ()=>applyBulkPeriod(7),
                                                                            children: "На 7 дней"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1254,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            className: "bulk-tile",
                                                                            onClick: ()=>applyBulkPeriod(14),
                                                                            children: "На 14 дней"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1255,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            className: "bulk-tile",
                                                                            onClick: ()=>applyBulkPeriod(30),
                                                                            children: "На 30 дней"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1256,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1253,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bulk-date-range",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            children: [
                                                                                "С",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "date",
                                                                                    value: bulkStartDate,
                                                                                    onChange: (event)=>setBulkStartDate(event.target.value)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                                    lineNumber: 1260,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1259,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            children: [
                                                                                "По",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "date",
                                                                                    value: bulkEndDate,
                                                                                    onChange: (event)=>setBulkEndDate(event.target.value)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                                    lineNumber: 1263,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1262,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1258,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1251,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bulk-control",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "bulk-label",
                                                                    children: "Дни недели"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1268,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bulk-tile-row bulk-weekdays",
                                                                    children: BULK_WEEKDAYS.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            "aria-pressed": bulkWeekdays.includes(day.value),
                                                                            className: `bulk-tile ${bulkWeekdays.includes(day.value) ? 'selected' : ''}`,
                                                                            onClick: ()=>setBulkWeekdays((current)=>current.includes(day.value) ? current.filter((value)=>value !== day.value) : [
                                                                                        ...current,
                                                                                        day.value
                                                                                    ]),
                                                                            children: day.label
                                                                        }, day.value, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1271,
                                                                            columnNumber: 25
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1269,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1267,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bulk-control",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "bulk-label",
                                                                    children: "Рабочие часы"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1286,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bulk-tile-row bulk-hours",
                                                                    children: BULK_HOURS.map((hour)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            "aria-pressed": bulkHours.includes(hour),
                                                                            className: `bulk-tile ${bulkHours.includes(hour) ? 'selected' : ''}`,
                                                                            onClick: ()=>setBulkHours((current)=>current.includes(hour) ? current.filter((value)=>value !== hour) : [
                                                                                        ...current,
                                                                                        hour
                                                                                    ].sort((a, b)=>a - b)),
                                                                            children: [
                                                                                String(hour).padStart(2, '0'),
                                                                                ":00"
                                                                            ]
                                                                        }, hour, true, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1289,
                                                                            columnNumber: 25
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1287,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1285,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bulk-control",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "bulk-label",
                                                                    children: "Тип слота"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1304,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "bulk-tile-row bulk-slot-types",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            "aria-pressed": bulkCapacity === 1,
                                                                            className: `bulk-tile ${bulkCapacity === 1 ? 'selected' : ''}`,
                                                                            onClick: ()=>setBulkCapacity(1),
                                                                            children: "Обычный · 1 место"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1306,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            "aria-pressed": bulkCapacity === 2,
                                                                            className: `bulk-tile ${bulkCapacity === 2 ? 'selected' : ''}`,
                                                                            onClick: ()=>setBulkCapacity(2),
                                                                            children: "Парный · 2 места"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1314,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1305,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1303,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "button bulk-submit",
                                                            disabled: loading,
                                                            onClick: createBulkSlots,
                                                            children: loading ? 'Генерирую...' : 'Сгенерировать расписание'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                            lineNumber: 1324,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1249,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/PitflyApp.tsx",
                                            lineNumber: 1231,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "admin-table-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    children: "Активные записи"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1330,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "admin-table-wrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        className: "admin-table",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Клиент"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1334,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Услуга"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1334,
                                                                            columnNumber: 44
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Дата и время"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1334,
                                                                            columnNumber: 59
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Оплата"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1334,
                                                                            columnNumber: 80
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Действие"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1334,
                                                                            columnNumber: 95
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1334,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1333,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: allBookings.filter((booking)=>booking.status === 'active').length ? allBookings.filter((booking)=>booking.status === 'active').map((booking)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: booking.profiles?.email || booking.profiles?.phone || booking.client_id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1340,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: booking.services?.title || booking.service_code
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1341,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: booking.slots ? formatDate(booking.slots.starts_at) : 'Время не указано'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1342,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: booking.payment_status === 'paid' ? 'status-paid' : 'muted',
                                                                                children: booking.payment_status === 'paid' ? 'Оплачено' : 'Не оплачено'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1343,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: booking.payment_status !== 'paid' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    className: "button small",
                                                                                    disabled: loading,
                                                                                    onClick: ()=>markPaid(booking.id),
                                                                                    children: "Отметить оплату"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                                    lineNumber: 1348,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1346,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, booking.id, true, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1339,
                                                                        columnNumber: 29
                                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "muted",
                                                                        colSpan: 5,
                                                                        children: "Активных записей пока нет."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1356,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1356,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1336,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1332,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1331,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/PitflyApp.tsx",
                                            lineNumber: 1329,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "admin-table-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    children: "Абонементы"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1363,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "admin-table-wrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        className: "admin-table",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Клиент"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1367,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Занятия"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1367,
                                                                            columnNumber: 44
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Срок действия"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1367,
                                                                            columnNumber: 60
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Статус"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1367,
                                                                            columnNumber: 82
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Действие"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1367,
                                                                            columnNumber: 97
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1367,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1366,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: allSubscriptions.length ? allSubscriptions.map((subscription)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: subscription.profiles?.email || subscription.profiles?.phone || subscription.client_id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1373,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: [
                                                                                    subscription.used_lessons,
                                                                                    " / ",
                                                                                    subscription.total_lessons,
                                                                                    " · осталось ",
                                                                                    Math.max(subscription.total_lessons - subscription.used_lessons, 0)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1374,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: formatDate(subscription.expires_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1375,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: subscription.status === 'active' && new Date(subscription.expires_at) > new Date() ? 'Действует' : subscription.status === 'active' ? 'Истёк' : subscription.status
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1376,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    className: "button secondary small",
                                                                                    disabled: loading,
                                                                                    onClick: ()=>extendSubscription(subscription.id),
                                                                                    children: "Продлить на 45 дней"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                                    lineNumber: 1380,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1379,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, subscription.id, true, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1372,
                                                                        columnNumber: 29
                                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "muted",
                                                                        colSpan: 5,
                                                                        children: "Абонементов пока нет."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1387,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1387,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1369,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1365,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1364,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/PitflyApp.tsx",
                                            lineNumber: 1362,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "admin-table-section",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    children: "Открытые слоты"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1394,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "admin-table-wrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        className: "admin-table",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Дата и время"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1398,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Места"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1398,
                                                                            columnNumber: 50
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            children: "Действие"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/PitflyApp.tsx",
                                                                            lineNumber: 1398,
                                                                            columnNumber: 64
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1398,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1397,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: slots.length ? slots.map((slot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: formatDate(slot.starts_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1404,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: [
                                                                                    slot.available_places ?? slot.capacity,
                                                                                    " / ",
                                                                                    slot.capacity
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1405,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    className: "button red small",
                                                                                    disabled: loading,
                                                                                    onClick: ()=>closeSlot(slot.id),
                                                                                    children: "Закрыть"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                                    lineNumber: 1407,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                                lineNumber: 1406,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, slot.id, true, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1403,
                                                                        columnNumber: 29
                                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "muted",
                                                                        colSpan: 3,
                                                                        children: "Открытых слотов нет."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                                        lineNumber: 1414,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                                    lineNumber: 1414,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/PitflyApp.tsx",
                                                                lineNumber: 1400,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/PitflyApp.tsx",
                                                        lineNumber: 1396,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PitflyApp.tsx",
                                                    lineNumber: 1395,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/PitflyApp.tsx",
                                            lineNumber: 1393,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/PitflyApp.tsx",
                                    lineNumber: 1207,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/PitflyApp.tsx",
                                lineNumber: 1203,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 920,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PitflyApp.tsx",
                lineNumber: 916,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "tab-bar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: tab === 'home' ? 'active' : '',
                        onClick: ()=>setTab('home'),
                        children: "Главная"
                    }, void 0, false, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 1428,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: tab === 'book' ? 'active' : '',
                        onClick: ()=>setTab('book'),
                        children: "Запись"
                    }, void 0, false, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 1429,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: tab === 'cabinet' ? 'active' : '',
                        onClick: ()=>setTab('cabinet'),
                        children: "Кабинет"
                    }, void 0, false, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 1430,
                        columnNumber: 9
                    }, this),
                    profile?.role === 'trainer' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: tab === 'admin' ? 'active' : '',
                        onClick: ()=>setTab('admin'),
                        children: "Админ"
                    }, void 0, false, {
                        fileName: "[project]/components/PitflyApp.tsx",
                        lineNumber: 1432,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PitflyApp.tsx",
                lineNumber: 1427,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/PitflyApp.tsx",
        lineNumber: 893,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSupabaseBrowserClient",
    ()=>createSupabaseBrowserClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
let browserClient;
function createSupabaseBrowserClient() {
    browserClient ??= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://jnkiskrizurokzompxmb.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impua2lza3JpenVyb2t6b21weG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMTIyNTUsImV4cCI6MjExMDU4ODI1NX0.Vhj5YiO4iz1Ete9Z16J2An-uK1h0sZw_Gkb_d0rilRo"));
    return browserClient;
}
}),
];

//# sourceMappingURL=_0luv7b3pdtyuj._.js.map