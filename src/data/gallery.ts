export type Photo = { label: string; shape: 'tall' | 'wide' | 'sq'; src?: string }
// Sem 'src' aparece um placeholder. Use '/images/foto.jpg' (arquivos em public/images).
export const gallery: Photo[] = [
  { label: 'Show', shape: 'tall' }, { label: 'Bastidores', shape: 'sq' },
  { label: 'Ensaio', shape: 'wide' }, { label: 'Estúdio', shape: 'sq' },
  { label: 'Show', shape: 'wide' }, { label: 'Close', shape: 'tall' },
]
