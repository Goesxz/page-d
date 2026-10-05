// w e h = largura e altura reais do arquivo (definem a proporção).
// Sem 'src', aparece um placeholder. Com foto: src: '/images/g1.jpg' (arquivos em public/images).
export type Photo = { label: string; w: number; h: number; src?: string }
export const gallery: Photo[] = [
  { label: 'Show', w: 800, h: 1200 },
  { label: 'Bastidores', w: 1000, h: 800 },
  { label: 'Ensaio', w: 800, h: 1000 },
  { label: 'Estúdio', w: 1200, h: 800 },
  { label: 'Show', w: 800, h: 1100 },
  { label: 'Close', w: 800, h: 1300 },
  { label: 'Palco', w: 1200, h: 900 },
  { label: 'Viagem', w: 800, h: 1000 },
]