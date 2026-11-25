import { useRef, useState } from 'react'
import { ArrowUpRight20Regular, Play20Filled } from '@fluentui/react-icons'

const films = [
  { id: 'reach', title: 'Прыжок за снарядом', duration: '0:09', description: 'Собака следит за зелёной подушкой, отталкивается от земли и захватывает её в воздухе.' },
  { id: 'wall', title: 'Подъём по стенке', duration: '0:15', description: 'После короткого разбега собака упирается лапами в вертикальную стенку и тянется к подвешенному снаряду.' },
  { id: 'long-jump', title: 'Прыжок в длину', duration: '0:09', description: 'С бокового ракурса видны толчок, полёт над рядом планок и приземление за препятствием.' },
  { id: 'high-jump', title: 'Прыжок через барьер', duration: '0:13', description: 'Сначала смотрим на разбег спереди, затем сбоку видно, как собака проходит над верхней планкой.' },
]

export function TrainingFilms() {
  const [selected, setSelected] = useState(0)
  const [playOnSelect, setPlayOnSelect] = useState(false)
  const player = useRef<HTMLVideoElement>(null)
  const film = films[selected]
  return (
    <section className="training-feature" id="training" aria-labelledby="training-title">
      <div className="training-feature-media" data-reveal>
        <video ref={player} key={film.id} id="training-player" controls playsInline muted autoPlay={playOnSelect} preload="none"
          width={540} height={960} poster={`/images/training-${film.id}.webp`}
          aria-label={film.title} aria-describedby="film-description">
          <source src={`/videos/training-${film.id}.mp4`} type="video/mp4" />
          <a href={`/videos/training-${film.id}.mp4`}>Смотреть видео «{film.title}»</a>
        </video>
      </div>
      <div className="training-feature-text" data-reveal>
        <h2 id="training-title">Как проходят тренировки</h2>
        <div className="film-list" role="group" aria-label="Выберите упражнение">
          {films.map((item, index) => (
            <button key={item.id} type="button" aria-controls="training-player" aria-pressed={selected === index}
              onClick={() => {
                if (selected === index) {
                  void player.current?.play().catch(() => {})
                  return
                }
                setPlayOnSelect(true)
                setSelected(index)
              }}>
              <Play20Filled aria-hidden /><span>{item.title}</span><small>{item.duration}</small>
            </button>
          ))}
        </div>
        <p id="film-description" aria-live="polite">{film.description}</p>
        <a className="hero-location" href="#services">Посмотреть услуги <ArrowUpRight20Regular aria-hidden /></a>
      </div>
    </section>
  )
}
