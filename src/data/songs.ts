export type Song = { title: string; year: number; type: string; dur: number; cover?: string; src?: string }
// Para adicionar música: copie uma linha. 'src' = arquivo em public/music (ex: '/music/faixa.mp3').
// Sem 'src', o player roda em modo demonstração (apenas simula o tempo).
export const songs: Song[] = [
  { title: 'Nome da Música 1', year: 2026, type: 'Single', dur: 222 },
  { title: 'Nome da Música 2', year: 2025, type: 'Single', dur: 198 },
  { title: 'Nome da Música 3', year: 2025, type: 'EP', dur: 241 },
  { title: 'Nome da Música 4', year: 2024, type: 'Álbum', dur: 205 },
]
