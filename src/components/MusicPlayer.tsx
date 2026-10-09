import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { songs } from '../data/songs'
import { artist } from '../data/site'

export const fmt = (s: number) => {
  const v = Number.isFinite(s) && s > 0 ? s : 0
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(Math.floor(v % 60)).padStart(2, '0')}`
}

export function usePlayer() {
  const audio = useRef<HTMLAudioElement | null>(null)
  const loaded = useRef('')
  const stepRef = useRef<(d: number) => void>(() => {})
  const [i, setI] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const song = i === null ? null : songs[i]

  // cria o <audio> uma única vez
  useEffect(() => {
    const a = new Audio()
    a.preload = 'none'
    audio.current = a
    loaded.current = '' // evita estado velho (React StrictMode monta o efeito duas vezes)
    a.ontimeupdate = () => setT(a.currentTime)
    a.onended = () => {
      if (songs.length > 1) stepRef.current(1) // toca a próxima faixa automaticamente
      else { setPlaying(false); setT(0) }
    }
    a.onerror = () => setPlaying(false)
    return () => {
      a.pause()
      a.removeAttribute('src')
      a.load()
    }
  }, [])

  // sincroniza play/pause e troca de faixa
  useEffect(() => {
    const a = audio.current
    if (!a) return
    if (!song?.src) { a.pause(); return }
    if (loaded.current !== song.src) { a.src = song.src; loaded.current = song.src }
    if (playing) a.play().catch(() => setPlaying(false))
    else a.pause()
  }, [song, playing])

  // modo demonstração (faixa sem arquivo de áudio)
  useEffect(() => {
    if (!song || song.src || !playing) return
    const id = setInterval(() => setT(x => x + 1), 1000)
    return () => clearInterval(id)
  }, [song, playing])

  useEffect(() => {
    if (!song || song.src || !playing || t < song.dur) return
    if (songs.length > 1) stepRef.current(1)
    else { setPlaying(false); setT(0) }
  }, [t, song, playing])

  const seek = (v: number) => {
    if (song?.src && audio.current) audio.current.currentTime = v
    setT(v)
  }
  const step = (d: number) => {
    if (i === null) return
    if (d < 0 && t > 3) { seek(0); return } // "anterior" reinicia a faixa se já passou de 3s
    setI((i + d + songs.length) % songs.length)
    setT(0)
    setPlaying(true)
  }
  stepRef.current = step

  // controles de mídia do sistema (tela de bloqueio, fones, teclado)
  useEffect(() => {
    if (!song || !('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    ms.metadata = new MediaMetadata({
      title: song.title,
      artist: artist.name,
      artwork: song.cover ? [{ src: song.cover }] : [],
    })
    ms.setActionHandler('play', () => setPlaying(true))
    ms.setActionHandler('pause', () => setPlaying(false))
    ms.setActionHandler('previoustrack', () => stepRef.current(-1))
    ms.setActionHandler('nexttrack', () => stepRef.current(1))
    return () => {
      for (const a of ['play', 'pause', 'previoustrack', 'nexttrack'] as const) ms.setActionHandler(a, null)
    }
  }, [song])

  return {
    i, song, playing, t,
    play: (n: number) => {
      if (n === i) setPlaying(p => !p)
      else { setI(n); setT(0); setPlaying(true) }
    },
    toggle: () => setPlaying(p => !p),
    seek,
    step,
  }
}

export type Player = ReturnType<typeof usePlayer>

export default function MusicPlayer({ p }: { p: Player }) {
  if (!p.song) return null
  const { dur } = p.song
  const now = Math.min(p.t, dur)
  const style = { '--p': `${dur ? (now / dur) * 100 : 0}%` } as CSSProperties

  return (
    <div className="player" role="region" aria-label="Player de música">
      <button aria-label="Faixa anterior" onClick={() => p.step(-1)}>⏮</button>
      <button className="pp" aria-label={p.playing ? 'Pausar' : 'Tocar'} onClick={p.toggle}>
        {p.playing ? '❚❚' : '▶'}
      </button>
      <button aria-label="Próxima faixa" onClick={() => p.step(1)}>⏭</button>
      <div className="pinfo">
        <strong>{p.song.title}</strong>
        <span>{artist.name}</span>
      </div>
      <span className="time">{fmt(now)}</span>
      <input
        type="range"
        min={0}
        max={dur}
        value={now}
        style={style}
        onChange={e => p.seek(+e.target.value)}
        aria-label="Progresso da música"
        aria-valuetext={`${fmt(now)} de ${fmt(dur)}`}
      />
      <span className="time">{fmt(dur)}</span>
    </div>
  )
}
