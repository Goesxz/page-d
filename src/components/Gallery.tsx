import { useEffect, useRef, useState } from 'react'
import { gallery } from '../data/gallery'
export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null), back = useRef<HTMLButtonElement>(null)
  const go = (d: number) => setOpen(o => o === null ? o : (o + d + gallery.length) % gallery.length)
  useEffect(() => {
    if (open === null) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }
    addEventListener('keydown', k); document.body.style.overflow = 'hidden'; back.current?.focus()
    return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open !== null])
  const ph = (i: number) => gallery[i].src ? { backgroundImage: `url(${gallery[i].src})` } : undefined
  return (
    <section id="galeria" className="gallery section light">
      <h2>POR TRÁS DA MÚSICA</h2>
      <p className="sub">Momentos que também fazem parte da história.</p>
      <div className="masonry">
        {gallery.map((g, i) => (
          <button key={i} className={`ph ${g.shape}`} style={ph(i)} onClick={() => setOpen(i)} aria-label={`Abrir foto: ${g.label}`}><span>{g.label}</span></button>
        ))}
      </div>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeria de fotos" onClick={() => setOpen(null)}>
          <div className="lb-img" style={ph(open)} onClick={e => e.stopPropagation()} />
          <button ref={back} className="lb-x" aria-label="Fechar" onClick={() => setOpen(null)}>✕</button>
          <button className="lb-n prev" aria-label="Anterior" onClick={e => { e.stopPropagation(); go(-1) }}>‹</button>
          <button className="lb-n next" aria-label="Próxima" onClick={e => { e.stopPropagation(); go(1) }}>›</button>
        </div>
      )}
    </section>
  )
}
