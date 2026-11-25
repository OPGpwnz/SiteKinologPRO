'use client'

import { useEffect, useRef, useState } from 'react'
import { Phone20Regular } from '@fluentui/react-icons'

type MobilePlatform = 'android' | 'ios'

type InstallPromptEvent = Event & {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallApp({ visible }: { visible: boolean }) {
  const [platform, setPlatform] = useState<MobilePlatform | null>(null)
  const [installed, setInstalled] = useState(false)
  const [prompting, setPrompting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const installPrompt = useRef<InstallPromptEvent | null>(null)

  useEffect(() => {
    const mobileNavigator = navigator as Navigator & { standalone?: boolean }
    const isAndroid = /Android/i.test(mobileNavigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(mobileNavigator.userAgent)
      || (mobileNavigator.platform === 'MacIntel' && mobileNavigator.maxTouchPoints > 1)
    if (!isAndroid && !isIOS) return

    if (window.matchMedia('(display-mode: standalone)').matches || mobileNavigator.standalone) return

    setPlatform(isAndroid ? 'android' : 'ios')

    function handleInstallPrompt(event: Event) {
      event.preventDefault()
      installPrompt.current = event as InstallPromptEvent
    }

    function handleInstalled() {
      installPrompt.current = null
      setInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function handleInstall() {
    const prompt = installPrompt.current
    if (!prompt) {
      setShowHint(current => !current)
      return
    }

    installPrompt.current = null
    setShowHint(false)
    setPrompting(true)
    try {
      const { outcome } = await prompt.prompt()
      if (outcome === 'accepted') setInstalled(true)
    } catch {
      setShowHint(true)
    } finally {
      setPrompting(false)
    }
  }

  if (!visible || !platform || installed) return null

  return (
    <div className="install-app">
      <button className="button secondary small" type="button" disabled={prompting} onClick={handleInstall}>
        <Phone20Regular aria-hidden /> Добавить на главный экран
      </button>
      <div className="install-app-hint" role="status">
        {showHint && (platform === 'ios'
          ? 'В Safari нажмите «Поделиться» → «На экран „Домой“» → «Добавить».'
          : 'В меню браузера ⋮ выберите «Установить приложение» или «Добавить на главный экран». Если этих пунктов нет, откройте PITFLY в Chrome.')}
      </div>
    </div>
  )
}
