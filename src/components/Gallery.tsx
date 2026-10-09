import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { gallery, type Photo } from '../data/gallery'

const colsFor = () => (innerWidth >= 1100 ? 4 : innerWidth >= 700 ? 3 : 2)

function useColumns() {
  const [n, setN] = useState(colsFor)
  useEffect(() => {
    const f = () => setN(colsFor()) // React ignora quando o valor não muda
    addEventListener('resize', f, { passive: true })
    return () => removeEventListener('resize', f)
  }, [])
  return n
}

const Pic = ({ g }: { g: Photo }) =>
  g.src ? (
    <img src={g.src} alt={g.label} width={g.w} height={g.h} loading="lazy" decoding="async" />
  ) : (
    <div className="ph-empty" style={{ aspectRatio: `${g.w}/${g.h}` }} />
  )

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const touchX = useRef<number | null>(null)
  const cols = useColumns()
  const isOpen = open !== null

  // cada foto vai para a coluna mais baixa no momento (efeito Pinterest)
  const columns = useMemo(() => {
    const c: number[][] = Array.from({ length: cols }, () => [])
    const h: number[] = Array(cols).fill(0)
    gallery.forEach((g, i) => {
      const k = h.indexOf(Math.min(...h))
      c[k].push(i)
      h[k] += g.h / g.w
    })
    return c
  }, [cols])

  const go = useCallback(
    (d: number) => setOpen(o => (o === null ? o : (o + d + gallery.length) % gallery.length)),
    [],
  )
  const show = (i: number) => {
    opener.current = document.activeElement as HTMLElement | null
    setOpen(i)
  }
  const close = useCallback(() => {
    setOpen(null)
    opener.current?.focus() // devolve o foco para a miniatura que abriu o lightbox
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab' && dialog.current) {
        // prende o foco dentro do diálogo
        const f = dialog.current.querySelectorAll<HTMLElement>('button')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => {
      removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, go])

  // pré-carrega as fotos vizinhas para a navegação ficar instantânea
  useEffect(() => {
    if (open === null) return
    for (const d of [-1, 1]) {
      const src = gallery[(open + d + gallery.length) % gallery.length].src
      if (src) new Image().src = src
    }
  }, [open])

  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  const cur = open === null ? null : gallery[open]

  return (
    <section id="galeria" className="gallery section light">
      <h2>POR TRÁS DA MÚSICA</h2>
      <p className="sub">Momentos que também fazem parte da história.</p>
      <div className="masonry">
        {columns.map((col, c) => (
          <div className="mcol" key={c}>
            {col.map(i => (
              <button key={i} className="ph" onClick={() => show(i)} aria-label={`Abrir foto: ${gallery[i].label}`}>
                <Pic g={gallery[i]} />
                <span aria-hidden="true">{gallery[i].label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {cur && open !== null && (
        <div
          ref={dialog}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos"
          onClick={close}
          onTouchStart={e => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={onTouchEnd}
        >
          <figure className="lb-fig" onClick={e => e.stopPropagation()}>
            {cur.src ? (
              <img className="lb-img" src={cur.src} alt={cur.label} />
            ) : (
              <div className="lb-img lb-empty" />
            )}
            <figcaption className="lb-cap">{cur.label}</figcaption>
          </figure>
          <span className="lb-count" aria-live="polite">
            {open + 1} / {gallery.length}
          </span>
          <button ref={closeBtn} className="lb-x" aria-label="Fechar" onClick={e => { e.stopPropagation(); close() }}>✕</button>
          <button className="lb-n prev" aria-label="Anterior" onClick={e => { e.stopPropagation(); go(-1) }}>‹</button>
          <button className="lb-n next" aria-label="Próxima" onClick={e => { e.stopPropagation(); go(1) }}>›</button>
        </div>
      )}
    </section>
  )
}
