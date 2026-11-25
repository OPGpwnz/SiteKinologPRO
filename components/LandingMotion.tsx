'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

export function LandingMotion() {
  const cursor = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ anchors: true, duration: .85 })
      // Use one animation clock for scrolling and parallax.
      const tick = (seconds: number) => lenis.raf(seconds * 1000)
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      document.querySelectorAll('.home-screen [data-reveal]').forEach(element => {
        gsap.from(element, {
          y: 24, opacity: .25, duration: .65, ease: 'power2.out',
          delay: element.classList.contains('training-feature-text') ? .12 : 0,
          scrollTrigger: { trigger: element, start: 'top 95%', once: true },
        })
      })
      gsap.to('.exercise-grip .exercise-print', { yPercent: 2.8, ease: 'none',
        scrollTrigger: { trigger: '.metal-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      return () => { gsap.ticker.remove(tick); lenis.destroy() }
    })
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const dot = cursor.current
      if (!dot) return
      const root = document.documentElement
      const hide = () => root.classList.remove('metal-pointer')
      const move = (event: PointerEvent) => {
        const target = event.target
        if (event.pointerType !== 'mouse' || !(target instanceof Element)
          || target.closest('.training-feature-media, iframe, input, textarea, select')) { hide(); return }
        dot.style.left = event.clientX + 'px'
        dot.style.top = event.clientY + 'px'
        dot.classList.toggle('over-control', Boolean(target.closest('a, button, [role="button"]')))
        root.classList.add('metal-pointer')
      }
      document.addEventListener('pointermove', move, { passive: true })
      document.addEventListener('pointerleave', hide)
      window.addEventListener('blur', hide)
      return () => {
        hide()
        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerleave', hide)
        window.removeEventListener('blur', hide)
      }
    })
    return () => media.revert()
  }, [])
  return <span aria-hidden="true" className="brass-cursor" ref={cursor} />
}
