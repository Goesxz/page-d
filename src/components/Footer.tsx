import { artist, social } from '../data/site'
import { SocialIcons, type IconComponent } from './SocialIcons'

const nav = [['inicio', 'Início'], ['sobre', 'Sobre'], ['musica', 'Música'], ['galeria', 'Galeria'], ['shows', 'Shows']]

// lookup por label; se não houver ícone, o link mostra o texto como fallback
const icons: Record<string, IconComponent | undefined> = SocialIcons

export default function Footer() {
  const whatsapp = social.find(s => s.label === 'WhatsApp')

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <strong className="footer-name">{artist.name}</strong>
          <p className="footer-tagline">Música que vira história.</p>
        </div>

        <nav className="footer-nav" aria-label="Rodapé">
          {nav.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}
        </nav>

        <div className="footer-actions">
          <nav className="footer-social" aria-label="Redes sociais">
            {social.map(s => {
              const Icon = icons[s.label]
              return (
                <a
                  key={s.label}
                  className="footer-icon"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir ${s.label} em nova aba`}
                  title={s.label}
                >
                  {Icon ? <Icon className="footer-icon-svg" /> : s.label}
                </a>
              )
            })}
          </nav>
          {whatsapp && (
            <a
              className="btn btn-solid footer-cta"
              href={whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contratar show pelo WhatsApp (abre em nova aba)"
            >
              <SocialIcons.WhatsApp className="footer-cta-icon" />
              Contratar show
            </a>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <small>© 2026 {artist.name}. Todos os direitos reservados.</small>
        <a className="footer-icon footer-up" href="#inicio" aria-label="Voltar ao topo" title="Voltar ao topo">
          <svg className="footer-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </a>
      </div>
    </footer>
  )
}
