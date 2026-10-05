import { artist, social } from '../data/site'
const nav = [['inicio', 'Início'], ['sobre', 'Sobre'], ['musica', 'Música'], ['galeria', 'Galeria'], ['shows', 'Shows']]
export default function Footer() {
  return (
    <footer className="footer">
      <div><strong>{artist.name}</strong><p>Música que vira história.</p></div>
      <nav aria-label="Rodapé">{nav.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</nav>
      <nav aria-label="Redes sociais">{social.map(s => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>)}</nav>
      <small>© 2026 {artist.name}. Todos os direitos reservados.</small>
    </footer>
  )
}
