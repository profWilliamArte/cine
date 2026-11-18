// src/App.jsx
// 🎯 Qué hace: Define el layout global, el scroll al inicio y las 6 rutas de la aplicación.
// 🧩 Cómo se integra: main.jsx lo monta dentro de HashRouter; declara Navbar, páginas y Footer.

import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import QueVeoHoy from './pages/QueVeoHoy'
import Peliculas from './pages/Peliculas'
import Series from './pages/Series'
import MiLista from './pages/MiLista'
import Detalle from './pages/Detalle'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/que-veo-hoy" element={<QueVeoHoy />} />
          <Route path="/peliculas" element={<Peliculas />} />
          <Route path="/series" element={<Series />} />
          <Route path="/mi-lista" element={<MiLista />} />
          <Route path="/detalle/:mediaType/:id" element={<Detalle />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
