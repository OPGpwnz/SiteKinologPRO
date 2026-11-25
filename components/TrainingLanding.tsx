import { ArrowDown20Regular, ArrowUpRight20Regular, Location20Regular } from '@fluentui/react-icons'

import { TrainingPhoto } from './TrainingPhoto'
import { TrainingFilms } from './TrainingFilms'
import { TrainingGallery } from './TrainingGallery'
import { LandingMotion } from './LandingMotion'

const mapLink = 'https://yandex.ru/maps/50/perm/?ll=56.370996%2C57.991274&mode=whatshere&whatshere%5Bpoint%5D=56.370996%2C57.991274&whatshere%5Bzoom%5D=17.01265&z=17'

export function TrainingLanding({ onBook }: { onBook: () => void }) {
  return (
    <>
      <LandingMotion />
      <section className="hero metal-hero" aria-labelledby="hero-title">
        <div className="hero-body">
          <div className="eyebrow">Физическая подготовка собак · Пермь</div>
          <h1 id="hero-title">Сильнее<br /> <span>в движении</span></h1>
          <p>Индивидуальные тренировки под возраст, породу и физическую форму вашей собаки.</p>
          <div className="hero-actions">
            <button className="hero-cta" type="button" onClick={onBook}>Записаться на тренировку <ArrowUpRight20Regular aria-hidden /></button>
            <a className="hero-location" href="#training"><ArrowDown20Regular aria-hidden /> Как проходят занятия</a>
          </div>
        </div>
        <TrainingPhoto exercise="grip" />
      </section>

      <TrainingFilms />
      <TrainingGallery />
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
