import { useEffect, useRef } from 'react'
import { images, artist, social } from '../data/site'

export default function Hero() {
  const photo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hasHover = matchMedia('(hover: hover)').matches
    let y = 0, mx = 0, my = 0, raf = 0

    const draw = () => {
      raf = 0
      if (photo.current)
        photo.current.style.transform = `translate3d(${mx * -14}px, ${y * 0.15 + my * -10}px, 0)`
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(draw) }

    const onScroll = () => { y = Math.min(scrollY, innerHeight); queue() }
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / innerWidth - 0.5
      my = e.clientY / innerHeight - 0.5
      queue()
    }

    addEventListener('scroll', onScroll, { passive: true })
    // efeito de mouse só em dispositivos com hover (não faz sentido em touch)
    if (hasHover) addEventListener('mousemove', onMove, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="inicio" className="hero">
      <div className="hero-photo" ref={photo} aria-hidden="true">
        <img className="hero-img" src={images.hero} alt="" fetchPriority="high" decoding="async" />
      </div>
      <div className="hero-shade" />
      <div className="grain" />

      <div className="hero-body">
        <p className="label a4">Artista • Pagode</p>
        <h1 className="name">
          <span className="mask"><span>{artist.name}</span></span>
        </h1>
        <p className="headline a5">Música que<br />vira história.</p>
        <p className="lead a6">Canções para cantar, sentir e lembrar.</p>
        <div className="ctas a7">
          {/* corrigido: o id da seção é "musica" (antes apontava para "#musicas") */}
          <a className="btn btn-solid" href="#musica">Ouvir agora</a>
          <a className="btn btn-line" href="#sobre">Conhecer o artista</a>
        </div>
        <nav className="socials a8" aria-label="Redes sociais">
          {social.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}