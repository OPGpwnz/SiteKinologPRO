'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft20Regular, ArrowRight20Regular } from '@fluentui/react-icons'
import { photos, TrainingPhoto } from './TrainingPhoto'

const slides = ['sprint', 'balloon', 'rise', 'wall-grip'] as const

export function TrainingGallery() {
  const [index, setIndex] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)
  const exercise = slides[index]

  function move(step: number) {
    setIndex(current => (current + step + slides.length) % slides.length)
  }

  return (
    <section id="training-gallery" className="sprint-study" data-reveal
      aria-labelledby="sprint-title" aria-roledescription="карусель"
      onKeyDown={event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        // Keep keyboard focus on the gallery if the current hotspot disappears.
        if ((event.target as Element).closest('.photo-point')) event.currentTarget.focus()
        move(event.key === 'ArrowRight' ? 1 : -1)
      }} tabIndex={-1}>
      <div className="sprint-copy">
        <h2 id="sprint-title">Сила в каждом шаге</h2>
        <p>Листайте фотографии и нажимайте на латунные точки, чтобы рассмотреть движение.</p>
        <div className="gallery-thumbs" role="group" aria-label="Выбор фотографии">
          {slides.map((id, i) => (
            <button type="button" key={id} aria-pressed={i === index}
              aria-label={photos[id].title} onClick={() => setIndex(i)}>
              <Image src={`/images/pitfly-${id}.webp`} alt="" width={64} height={64} sizes="64px" />
            </button>
          ))}
        </div>
        <div className="gallery-nav">
          <button type="button" aria-label="Предыдущее фото" onClick={() => move(-1)}><ArrowLeft20Regular /></button>
          <span aria-live="polite" aria-atomic="true" aria-label={`${index + 1} из ${slides.length}. ${photos[exercise].title}`}>
            {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          <button type="button" aria-label="Следующее фото" onClick={() => move(1)}><ArrowRight20Regular /></button>
        </div>
      </div>
      <div className="gallery-stage"
        onTouchStart={event => {
          const touch = event.touches[0]
          start.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null
        }}
        onTouchCancel={() => { start.current = null }}
        onTouchEnd={event => {
          const origin = start.current
          start.current = null
          if (!origin) return
          const touch = event.changedTouches[0]
          const dx = touch.clientX - origin.x
          const dy = touch.clientY - origin.y
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
        }}>
        <TrainingPhoto key={exercise} exercise={exercise} />
      </div>
    </section>
  )
}
