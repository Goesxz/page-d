import { shows } from '../data/shows'
export default function Shows() {
  return (
    <section id="shows" className="shows section wine">
      <h2>AO VIVO</h2>
      <p className="sub">Encontre o próximo encontro.</p>
      {shows.length === 0 ? (
        <div className="empty"><b>Novas datas estão chegando.</b><p>Fique de olho para não perder o próximo encontro.</p></div>
      ) : (
        <ul className="dates">
          {shows.map(s => (
            <li key={s.day + s.month + s.venue}>
              <div className="date"><b>{s.day}</b><span>{s.month}</span></div>
              <div className="where"><b>{s.city}</b><span>{s.venue}</span></div>
              <a className="btn btn-line" href={s.url} target="_blank" rel="noopener noreferrer">Ingressos</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
