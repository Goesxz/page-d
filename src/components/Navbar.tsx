import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { artist, social } from '../data/site'
import { SocialIcons, type IconComponent } from './SocialIcons'

const links = [['sobre', 'Sobre'], ['musica', 'Música'], ['galeria', 'Galeria'], ['shows', 'Shows']]
const icons: Record<string, IconComponent | undefined> = SocialIcons
const step = (i: number) => ({ '--i': i }) as CSSProperties

export default function Navbar() {
  const [solid, setSolid] = useState(false), [open, setOpen] = useState(false), [active, setActive] = useState(''), [away, setAway] = useState(false)
  const bar = useRef<HTMLSpanElement>(null)
  const whatsapp = social.find(s => s.label === 'WhatsApp')
  const close = () => setOpen(false)

  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight
      setSolid(y > 40)
      if (y < 200) setActive('')
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`
      if (Math.abs(y - last) > 8) { setAway(y > last && y > 400); last = y }
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll()
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    links.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => { removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => innerWidth > 900 && setOpen(false)
    addEventListener('keydown', onKey); addEventListener('resize', onResize)
    return () => { removeEventListener('keydown', onKey); removeEventListener('resize', onResize); document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={`nav ${solid || open ? 'solid' : ''} ${away && !open ? 'away' : ''}`}>
      <span className="nav-progress" ref={bar} aria-hidden="true" />
      <a href="#inicio" className="brand" onClick={close}>{artist.name}</a>
      <nav className={`menu ${open ? 'open' : ''}`} aria-label="Principal">
        {links.map(([id, l], i) => (
          <a key={id} href={`#${id}`} style={step(i)} aria-current={active === id ? 'true' : undefined} onClick={close}>{l}</a>
        ))}
        <a
          className="btn btn-solid"
          style={step(links.length)}
          href={whatsapp?.url ?? '#shows'}
          {...(whatsapp ? { target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Contratar show pelo WhatsApp (abre em nova aba)' } : {})}
          onClick={close}
        >
          {whatsapp && <SocialIcons.WhatsApp className="menu-cta-icon" />}
          Contratar show
        </a>
        <div className="menu-foot" style={step(links.length + 1)}>
          {social.map(s => {
            const Icon = icons[s.label]
            return (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${s.label} em nova aba`} title={s.label}>
                {Icon ? <Icon className="menu-foot-icon" /> : s.label}
              </a>
            )
          })}
        </div>
      </nav>
      <button className="burger" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
    </header>
  )
}
