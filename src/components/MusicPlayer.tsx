import { useEffect, useRef, useState } from 'react'
import { songs } from '../data/songs'
import { artist } from '../data/site'
export const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`
export function usePlayer() {
  const audio = useRef<HTMLAudioElement | null>(null), loaded = useRef('')
  const [i, setI] = useState<number | null>(null), [playing, setPlaying] = useState(false), [t, setT] = useState(0)
  const song = i === null ? null : songs[i]
  useEffect(() => { const a = new Audio(); audio.current = a; a.ontimeupdate = () => setT(a.currentTime); a.onended = () => { setPlaying(false); setT(0) }; return () => a.pause() }, [])
  useEffect(() => {
    const a = audio.current!
    if (!song?.src) { a.pause(); return }
    if (loaded.current !== song.src) { a.src = song.src; loaded.current = song.src }
    playing ? a.play().catch(() => setPlaying(false)) : a.pause()
  }, [i, playing])
  useEffect(() => { // modo demonstração (sem arquivo de áudio)
    if (!song || song.src || !playing) return
    const id = setInterval(() => setT(x => { if (x + 1 >= song.dur) { setPlaying(false); return 0 } return x + 1 }), 1000)
    return () => clearInterval(id)
  }, [i, playing])
  return {
    i, song, playing, t,
    play: (n: number) => { if (n === i) setPlaying(p => !p); else { setI(n); setT(0); setPlaying(true) } },
    toggle: () => setPlaying(p => !p),
    seek: (v: number) => { if (song?.src) audio.current!.currentTime = v; setT(v) },
    step: (d: number) => { if (i === null) return; setI((i + d + songs.length) % songs.length); setT(0); setPlaying(true) },
  }
}
export type Player = ReturnType<typeof usePlayer>
export default function MusicPlayer({ p }: { p: Player }) {
  if (!p.song) return null
  return (
    <div className="player" role="region" aria-label="Player de música">
      <button aria-label="Faixa anterior" onClick={() => p.step(-1)}>⏮</button>
      <button className="pp" aria-label={p.playing ? 'Pausar' : 'Tocar'} onClick={p.toggle}>{p.playing ? '❚❚' : '▶'}</button>
      <button aria-label="Próxima faixa" onClick={() => p.step(1)}>⏭</button>
      <div className="pinfo"><strong>{p.song.title}</strong><span>{artist.name}</span></div>
      <span className="time">{fmt(p.t)}</span>
      <input type="range" min={0} max={p.song.dur} value={p.t} onChange={e => p.seek(+e.target.value)} aria-label="Progresso da música" />
      <span className="time">{fmt(p.song.dur)}</span>
    </div>
  )
}
