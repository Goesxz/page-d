# Landing page: cantor de pagode romântico
React + TypeScript + Vite.

## Requisitos
Node.js 18 ou superior.

## Rodar
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera a pasta dist/ (produção)
npm run preview  # testa o build
```

## Onde editar
- **Nome, @ e links das redes:** `src/data/site.ts`
- **Fotos da hero e do "Sobre":** salve em `public/images/hero.jpg` e `public/images/about.jpg` (ou mude os caminhos em `site.ts`)
- **Músicas:** `src/data/songs.ts` (copie uma linha; coloque o áudio em `public/music` e informe `src: '/music/arquivo.mp3'`). Sem `src`, o player roda em modo demonstração.
- **Shows:** `src/data/shows.ts` (lista vazia mostra "Novas datas estão chegando.")
- **Galeria:** `src/data/gallery.ts` (campo `src` com o caminho da foto em `public/images`)
- **Textos e números do "Sobre":** `src/components/About.tsx`
- **Cores e fontes:** variáveis no topo de `src/index.css`

## Ainda não incluído nesta versão
Latest Release, Vídeos (modal), Social/Instagram, CTA final e cursor personalizado.
