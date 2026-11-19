export type AuthMode = 'login' | 'signup'

export function validateAuthCredentials(email: string, password: string, mode: AuthMode) {
  const normalizedEmail = email.trim()
  if (!normalizedEmail) return 'Введите email.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return 'Введите корректный email.'
  }
  if (!password) return 'Введите пароль.'
  if (mode === 'signup' && password.length < 6) {
    return 'Пароль слишком короткий: минимум 6 символов.'
  }
  return null
}

export function getAuthErrorMessage(code: string | undefined, message: string, mode: AuthMode) {
  const normalizedMessage = message.toLowerCase()
  if (code === 'invalid_credentials' || normalizedMessage.includes('invalid login credentials')) {
    return 'Неверная почта или пароль.'
  }
  if (code === 'user_already_exists' || code === 'email_exists'
    || normalizedMessage.includes('already registered')) {
    return 'Аккаунт с таким email уже зарегистрирован.'
  }
  if (code === 'weak_password' || /password.*(short|at least|characters)/.test(normalizedMessage)) {
    return 'Пароль слишком короткий. Используйте не менее 6 символов.'
  }
  if (code === 'email_not_confirmed') {
    return 'Подтвердите email по ссылке из письма.'
  }
  if (code === 'email_address_invalid' || normalizedMessage.includes('invalid email')) {
    return 'Введите корректный email.'
  }
  return mode === 'signup'
    ? 'Не удалось зарегистрироваться. Проверьте данные и повторите попытку.'
    : 'Не удалось войти. Проверьте данные и повторите попытку.'
}
