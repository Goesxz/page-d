import { useEffect, useMemo, useRef, useState } from 'react'
import { gallery, Photo } from '../data/gallery'

const colsFor = () => (innerWidth >= 1100 ? 4 : innerWidth >= 700 ? 3 : 2)
function useColumns() {
  const [n, setN] = useState(colsFor)
  useEffect(() => {
    const f = () => setN(colsFor())
    addEventListener('resize', f)
    return () => removeEventListener('resize', f)
  }, [])
  return n
}
const Pic = ({ g }: { g: Photo }) =>
  g.src ? <img src={g.src} alt={g.label} width={g.w} height={g.h} loading="lazy" />
        : <div className="ph-empty" style={{ aspectRatio: `${g.w}/${g.h}` }} />

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null), back = useRef<HTMLButtonElement>(null)
  const cols = useColumns()
  // cada foto vai para a coluna mais baixa no momento (efeito Pinterest)
  const columns = useMemo(() => {
    const c: number[][] = Array.from({ length: cols }, () => [])
    const h: number[] = Array(cols).fill(0)
    gallery.forEach((g, i) => { const k = h.indexOf(Math.min(...h)); c[k].push(i); h[k] += g.h / g.w })
    return c
  }, [cols])
  const go = (d: number) => setOpen(o => o === null ? o : (o + d + gallery.length) % gallery.length)
  useEffect(() => {
    if (open === null) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }
    addEventListener('keydown', k); document.body.style.overflow = 'hidden'; back.current?.focus()
    return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open !== null])
  const cur = open === null ? null : gallery[open]
  return (
    <section id="galeria" className="gallery section light">
      <h2>POR TRÁS DA MÚSICA</h2>
      <p className="sub">Momentos que também fazem parte da história.</p>
      <div className="masonry">
        {columns.map((col, c) => (
          <div className="mcol" key={c}>
            {col.map(i => (
              <button key={i} className="ph" onClick={() => setOpen(i)} aria-label={`Abrir foto: ${gallery[i].label}`}>
                <Pic g={gallery[i]} /><span>{gallery[i].label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {cur && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeria de fotos" onClick={() => setOpen(null)}>
          {cur.src
            ? <img className="lb-img" src={cur.src} alt={cur.label} onClick={e => e.stopPropagation()} />
            : <div className="lb-img lb-empty" onClick={e => e.stopPropagation()} />}
          <button ref={back} className="lb-x" aria-label="Fechar" onClick={() => setOpen(null)}>✕</button>
          <button className="lb-n prev" aria-label="Anterior" onClick={e => { e.stopPropagation(); go(-1) }}>‹</button>
          <button className="lb-n next" aria-label="Próxima" onClick={e => { e.stopPropagation(); go(1) }}>›</button>
        </div>
      )}
    </section>
  )
}
