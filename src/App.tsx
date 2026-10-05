import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Music from './components/Music'
import Gallery from './components/Gallery'
import Shows from './components/Shows'
import Footer from './components/Footer'
import MusicPlayer, { usePlayer } from './components/MusicPlayer'
export default function App() {
  const p = usePlayer()
  return (<>
    <a className="skip" href="#musica">Pular para o conteúdo</a>
    <Navbar /><main><Hero /><About /><Music p={p} /><Gallery /><Shows /></main><Footer /><MusicPlayer p={p} />
  </>)
}
