import { useEffect, useRef, useState } from 'react'
import { images } from '../data/site'
// Números de exemplo: substitua pelos dados reais.
const stats = [[10, '+', 'anos de música'], [2, 'M+', 'streams'], [150, '+', 'shows'], [12, '', 'lançamentos']] as const
function Count({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0), ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect()
      if (reduce) return setN(to)
      const t0 = performance.now(), step = (t: number) => { const p = Math.min((t - t0) / 1400, 1); setN(Math.round(to * (1 - (1 - p) ** 3))); p < 1 && requestAnimationFrame(step) }
      requestAnimationFrame(step)
    }, { threshold: 0.6 })
    ref.current && io.observe(ref.current); return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{n}{suffix}</span>
}
export default function About() {
  return (
    <section id="sobre" className="about section">
      <div className="about-photo" style={{ backgroundImage: `url(${images.about})` }} role="img" aria-label="Retrato do artista" />
      <div className="about-text">
        <p className="label dark">Conheça o artista</p>
        <h2>MAIS QUE MÚSICA.<br />UMA HISTÓRIA PARA CONTAR.</h2>
        {/* Texto facilmente substituível */}
        <p>Entre melodias, encontros e histórias vividas, sua música nasceu da vontade de transformar sentimentos em canções. Com uma identidade marcada pelo pagode romântico, cada interpretação carrega emoção, verdade e proximidade.</p>
        <dl className="stats">{stats.map(([n, s, l]) => <div key={l}><dt><Count to={n} suffix={s} /></dt><dd>{l}</dd></div>)}</dl>
      </div>
    </section>
  )
}
