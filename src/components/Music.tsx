import { songs } from '../data/songs'
import { fmt, type Player } from './MusicPlayer'

export default function Music({ p }: { p: Player }) {
  return (
    <section id="musica" className="music section dark">
      <h2>MINHA MÚSICA</h2>
      <p className="sub">
        Histórias diferentes.
        <br />
        O mesmo sentimento.
      </p>
      <ol className="tracks">
        {songs.map((s, n) => {
          const on = p.i === n
          return (
            <li key={s.title} className={on ? 'on' : ''}>
              <button
                onClick={() => p.play(n)}
                aria-label={`${on && p.playing ? 'Pausar' : 'Tocar'} ${s.title}`}
                aria-current={on ? 'true' : undefined}
              >
                <span className="num">{String(n + 1).padStart(2, '0')}</span>
                <span className="cover" style={s.cover ? { backgroundImage: `url(${s.cover})` } : undefined} />
                <span className="ttl">
                  <b>{s.title}</b>
                  <small>{s.year} • {s.type}</small>
                </span>
                <span className="dur">{fmt(s.dur)}</span>
                <span className="go" aria-hidden="true">{on && p.playing ? '❚❚' : '▶'}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}