import { useEffect, useRef } from 'react'
import { artist, images, social } from '../data/site'
export default function Hero() {
  const img = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let mx = 0, my = 0, raf = 0
    const tick = () => { raf = 0; if (img.current) img.current.style.transform = `translate3d(${mx}px,${scrollY * 0.12 + my}px,0)` }
    const req = () => { raf ||= requestAnimationFrame(tick) }
    const mm = (e: MouseEvent) => { mx = (e.clientX / innerWidth - 0.5) * -14; my = (e.clientY / innerHeight - 0.5) * -10; req() }
    addEventListener('scroll', req, { passive: true }); addEventListener('mousemove', mm)
    return () => { removeEventListener('scroll', req); removeEventListener('mousemove', mm) }
  }, [])
  return (
    <section id="inicio" className="hero">
      <div className="hero-photo"><div ref={img} className="hero-img" style={{ backgroundImage: `url(${images.hero})` }} role="img" aria-label={`Foto de ${artist.name} no palco`} /></div>
      <div className="hero-shade" /><div className="grain" />
      <div className="hero-body">
        <p className="label a4">Artista • Pagode</p>
        <h1 className="name"><span className="mask"><span>{artist.name}</span></span></h1>
        <p className="headline a5">MÚSICA QUE<br />VIRA HISTÓRIA.</p>
        <p className="lead a6">Canções para cantar, sentir e lembrar.</p>
        <div className="ctas a7"><a className="btn btn-solid" href="#musica">Ouvir agora</a><a className="btn btn-line" href="#sobre">Conhecer o artista</a></div>
        <ul className="socials a8">{social.map(s => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul>
      </div>
    </section>
  )
}
