import { useEffect, useState } from 'react'
import { artist } from '../data/site'
const links = [['sobre', 'Sobre'], ['musica', 'Música'], ['galeria', 'Galeria'], ['shows', 'Shows']]
export default function Navbar() {
  const [solid, setSolid] = useState(false), [open, setOpen] = useState(false), [active, setActive] = useState('')
  useEffect(() => {
    const onScroll = () => setSolid(scrollY > 40)
    addEventListener('scroll', onScroll, { passive: true }); onScroll()
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    links.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => { removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <header className={`nav ${solid || open ? 'solid' : ''}`}>
      <a href="#inicio" className="brand" onClick={() => setOpen(false)}>{artist.name}</a>
      <nav className={`menu ${open ? 'open' : ''}`} aria-label="Principal">
        {links.map(([id, l]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{l}</a>)}
        <a className="btn btn-solid" href="#musica" onClick={() => setOpen(false)}>Ouvir agora</a>
      </nav>
      <button className="burger" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
    </header>
  )
}
