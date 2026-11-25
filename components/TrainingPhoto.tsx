'use client'

import { useState, type CSSProperties } from 'react'
import Image from 'next/image'
import {
  FloatingPortal, autoUpdate, flip, offset, safePolygon, shift, useClick,
  useDismiss, useFloating, useFocus, useHover, useInteractions, useRole,
} from '@floating-ui/react'

type Point = { x: number; y: number; target?: [number, number]; title: string; text: string }

// Coordinates refer to the exported photograph, so the markers scale with the subject.
const grip: Point[] = [
  { x: 34, y: 85, target: [52, 81], title: 'Взрывная сила прыжка', text: 'Мощный толчок задними лапами задаёт высоту и дальность прыжка. Короткие серии помогают развивать взрывную силу.' },
  { x: 56, y: 55, title: 'Мышцы спины и груди', text: 'При удержании снаряда мышцы груди и спины работают вместе. Сильный корпус помогает собаке сохранять устойчивость под нагрузкой.' },
  { x: 81, y: 29, target: [56, 34], title: 'Сила хвата', text: 'Собака захватывает подушку и удерживает её. В этой фазе работают мышцы челюстей и тренируется устойчивый хват.' },
  { x: 36, y: 26, target: [56, 40], title: 'Баланс и координация', text: 'Следя за снарядом, собака меняет положение головы и корпуса и учится управлять телом в воздухе.' },
]
const sprint: Point[] = [
  { x: 35, y: 58, title: 'Толчок в беге', text: 'Задние лапы разгибаются и направляют корпус вперёд. На боковом ракурсе хорошо видна длина шага.' },
]

type Photo = {
  width: number; height: number; title: string; caption: string; alt: string; points: Point[]
}

export const photos = {
  grip: {
    width: 720, height: 1142, title: 'Удержание снаряда', caption: 'Нажмите на точку',
    alt: 'Собака в шлейке удерживает подвешенный снаряд на площадке PITFLY', points: grip,
  },
  sprint: {
    width: 1280, height: 720, title: 'Разгон с места', caption: 'Техника толчка',
    alt: 'Собака в полном разгоне, вид сбоку на тренировочной площадке', points: sprint,
  },
  balloon: {
    width: 854, height: 1280, title: 'Прыжок за шариком', caption: 'Слежение за целью',
    alt: 'Две собаки подпрыгивают к голубому надувному шарику на конце длинной удочки',
    points: [
      { x: 66, y: 12, target: [47, 14], title: 'Шарик на удочке', text: 'Шарик движется вместе с удочкой. Собаки следят за ним взглядом и выбирают момент для прыжка.' },
      { x: 68, y: 80, target: [48, 76], title: 'Толчок вверх', text: 'У ближней собаки задние лапы вытянуты после толчка. Видно, как корпус поднимается вслед за шариком.' },
    ],
  },
  rise: {
    width: 720, height: 1280, title: 'Взлёт в прыжке', caption: 'Положение тела',
    alt: 'Серая собака в прыжке крупным планом, морда поднята, передние лапы согнуты',
    points: [
      { x: 27, y: 19, target: [47, 20], title: 'Взгляд вверх', text: 'Морда поднята, взгляд направлен вверх. По положению головы хорошо видно направление движения.' },
      { x: 71, y: 72, target: [42, 64], title: 'Передние лапы', text: 'В верхней фазе прыжка собака сгибает передние лапы и держит их перед грудью.' },
    ],
  },
  'wall-grip': {
    width: 720, height: 1280, title: 'Хват у стенки', caption: 'Хват и опора',
    alt: 'Собака в шлейке держит меховой снаряд зубами и упирается передними лапами в рифлёную стенку',
    points: [
      { x: 85, y: 19, target: [65, 12], title: 'Удержание хватом', text: 'Меховой снаряд зажат в пасти. Корпус вытянут вдоль стенки, пока собака удерживает хват.' },
      { x: 27, y: 25, target: [46, 22], title: 'Опора на стенку', text: 'Передняя лапа упирается в рифлёную поверхность. Эта точка опоры помогает удерживать положение у снаряда.' },
    ],
  },
} satisfies Record<string, Photo>

function PhotoPoint({ point, index, open, onOpenChange }: {
  point: Point; index: number; open: boolean; onOpenChange: (open: boolean) => void
}) {
  const { refs, floatingStyles, context, placement } = useFloating({
    open, onOpenChange, placement: 'right', strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [offset(12), flip({ padding: 14, fallbackAxisSideDirection: 'end' }), shift({ padding: 14 })],
  })
  const hover = useHover(context, { mouseOnly: true, handleClose: safePolygon() })
  const focus = useFocus(context)
  const click = useClick(context, { ignoreMouse: true })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, click, dismiss, role])

  return <>
    <button ref={refs.setReference} type="button" className="photo-point"
      style={{ left: point.x + '%', top: point.y + '%', '--delay': `${index * -.47}s` } as CSSProperties}
      {...getReferenceProps({ 'aria-label': point.title, 'aria-expanded': open })}>
      <span aria-hidden="true" />
    </button>
    {open && <FloatingPortal>
      <div ref={refs.setFloating} style={floatingStyles} className="photo-tooltip" data-side={placement.split('-')[0]}
        {...getFloatingProps()}>
        <strong>{point.title}</strong>
        <p>{point.text}</p>
      </div>
    </FloatingPortal>}
  </>
}

export function TrainingPhoto({ exercise }: { exercise: keyof typeof photos }) {
  const [active, setActive] = useState<number | null>(null)
  const hanging = exercise === 'grip'
  const { width, height, title, alt, caption, points }: Photo = photos[exercise]
  return (
    <figure className={`exercise-photo exercise-${exercise}`} style={{ '--photo-ratio': width / height } as CSSProperties}>
      <div className="exercise-frame">
        <div className="exercise-print">
          <Image src={`/images/pitfly-${exercise}.webp`}
            width={width} height={height}
            sizes={hanging ? '(max-width: 600px) 80vw, 430px' : '(max-width: 768px) 95vw, 68vw'}
            preload={hanging}
            alt={alt} />
          {points.some(point => point.target) && <svg aria-hidden="true" className="photo-leaders" viewBox="0 0 100 100" preserveAspectRatio="none">
            {points.map(point => point.target && <line key={point.title} x1={point.x} y1={point.y} x2={point.target[0]} y2={point.target[1]} />)}
          </svg>}
          {points.map((point, index) => (
            <PhotoPoint key={point.title} point={point} index={index} open={active === index}
              onOpenChange={open => setActive(previous => open ? index : previous === index ? null : previous)} />
          ))}
        </div>
      </div>
      <figcaption><strong>{title}</strong><span>{caption}</span></figcaption>
    </figure>
  )
}
