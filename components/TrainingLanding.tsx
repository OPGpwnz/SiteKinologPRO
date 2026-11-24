import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowDown20Regular, ArrowUpRight20Regular, Location20Regular, Play20Filled } from '@fluentui/react-icons'

const mapLink = 'https://yandex.ru/maps/50/perm/?ll=56.370996%2C57.991274&mode=whatshere&whatshere%5Bpoint%5D=56.370996%2C57.991274&whatshere%5Bzoom%5D=17.01265&z=17'

export function TrainingLanding({ onBook }: { onBook: () => void }) {
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches || !('IntersectionObserver' in window)) return

    const animations: Animation[] = []
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        if (!motionPreference.matches) {
          animations.push(entry.target.animate(
            [{ opacity: 0.55, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 540, easing: 'cubic-bezier(.2,.65,.3,1)' },
          ))
        }
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.12 })

    document.querySelectorAll('.home-screen [data-reveal]').forEach(element => observer.observe(element))
    return () => {
      observer.disconnect()
      animations.forEach(animation => animation.cancel())
    }
  }, [])

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-body">
          <div className="eyebrow">Физическая подготовка собак · Пермь</div>
          <h1 id="hero-title">Сильнее<br /> <span>в движении</span></h1>
          <p>Индивидуальные тренировки под возраст, породу и физическую форму вашей собаки.</p>
          <div className="hero-actions">
            <button className="hero-cta" type="button" onClick={onBook}>Записаться на тренировку <ArrowUpRight20Regular aria-hidden /></button>
            <a className="hero-location" href="#training"><ArrowDown20Regular aria-hidden /> Как проходят занятия</a>
          </div>
        </div>
        <div className="hero-visual">
          <Image className="hero-photo" src="/images/pitfly-session-jump.webp" fill preload
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 64vw, 850px"
            alt="Собака в шлейке перепрыгивает препятствие на уличной тренировке" />
        </div>
      </section>

      <section className="training-feature" id="training" data-reveal aria-labelledby="training-title">
        <div className="training-feature-media">
          {showVideo ? (
            <video autoPlay muted controls playsInline width={480} height={854}
              poster="/images/pitfly-session-poster.webp" aria-label="Фрагмент тренировки: прыжок через препятствие">
              <source src="/videos/pitfly-training.mp4" type="video/mp4" />
              <a href="/videos/pitfly-training.mp4">Открыть видео тренировки</a>
            </video>
          ) : (
            <button type="button" className="training-video-preview" onClick={() => setShowVideo(true)}
              aria-label="Смотреть фрагмент тренировки, 8 секунд">
              <Image src="/images/pitfly-session-poster.webp" alt="" fill sizes="254px" />
              <span className="training-play-icon"><Play20Filled aria-hidden /></span>
              <span className="training-video-duration" aria-hidden>0:08</span>
            </button>
          )}
        </div>
        <div className="training-feature-text">
          <h2 id="training-title">Как проходят тренировки</h2>
          <p>В кадре — разбег и прыжок через препятствие под руководством тренера. Упражнения подбираем под задачи вашей собаки.</p>
          <dl className="training-focus">
            <div><dt>Сила</dt><dd>Упражнения для развития мышц</dd></div>
            <div><dt>Выносливость</dt><dd>Работа в контролируемом темпе</dd></div>
            <div><dt>Координация</dt><dd>Разбег, прыжки и препятствия</dd></div>
          </dl>
          <a className="hero-location" href="#services">Посмотреть услуги <ArrowUpRight20Regular aria-hidden /></a>
        </div>
      </section>
    </>
  )
}

export function TrainingLocation() {
  return (
    <section className="training-location" id="location" data-reveal aria-labelledby="location-title">
      <div className="training-location-text">
        <Location20Regular aria-hidden />
        <h2 id="location-title">Где тренируемся</h2>
        <p>Откройте точку PITFLY в Яндекс Картах, чтобы построить маршрут до места тренировки.</p>
        <a className="hero-cta" href={mapLink} target="_blank" rel="noopener noreferrer">
          Открыть Яндекс Карты <ArrowUpRight20Regular aria-hidden />
        </a>
      </div>
      <iframe title="Точка тренировок PITFLY на Яндекс Картах" loading="lazy" allowFullScreen
        src="https://yandex.ru/map-widget/v1/?ll=56.370996%2C57.991274&z=17&pt=56.370996%2C57.991274%2Cpm2rdl&lang=ru_RU" />
    </section>
  )
}
