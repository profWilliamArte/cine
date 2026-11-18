// src/components/SearchBar.jsx
// 🎯 Qué hace: Buscador en vivo con debounce, dropdown de resultados, teclado y limpieza.
// 🧩 Cómo se integra: Navbar lo renderiza; usa useDebounce y searchMulti, y navega al detalle.

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Film, LoaderCircle, Search, X } from 'lucide-react'
import useDebounce from '../hooks/useDebounce'
import { getImageUrl, searchMulti } from '../services/tmdb'

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 350)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const term = debouncedQuery.trim()
    if (term.length < 2) {
      setResults([])
      setLoading(false)
      setError('')
      return undefined
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    searchMulti(term, controller.signal)
      .then((data) => setResults((data.results ?? []).slice(0, 6)))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [debouncedQuery])

  useEffect(() => {
    setOpen(false)
    setQuery('')
    setResults([])
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goToDetail = (item) => {
    navigate(`/detalle/${item.media_type}/${item.id}`)
    setOpen(false)
    setQuery('')
    setResults([])
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (event.key === 'Enter' && results.length > 0) {
      event.preventDefault()
      goToDetail(results[0])
    }
  }

  const showPanel = open && debouncedQuery.trim().length >= 2

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20 dark:border-slate-800 dark:bg-slate-900">
        <Search size={16} className="shrink-0 text-slate-400" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar películas o series…"
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          aria-label="Buscar películas o series"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              setOpen(false)
            }}
            aria-label="Limpiar búsqueda"
            className="text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          {loading && (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-500">
              <LoaderCircle size={16} className="animate-spin" /> Buscando…
            </div>
          )}
          {!loading && error && <p className="px-4 py-4 text-sm text-red-500">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="px-4 py-4 text-sm text-slate-500">
              Sin resultados para “{debouncedQuery.trim()}”.
            </p>
          )}
          {!loading && !error && results.length > 0 && (
            <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
              {results.map((item) => {
                const poster = getImageUrl(item.poster_path, 'w92')
                const title = item.title || item.name || 'Sin título'
                const date = item.release_date || item.first_air_date || ''
                return (
                  <li key={`${item.media_type}-${item.id}`}>
                    <button
                      type="button"
                      onClick={() => goToDetail(item)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <span className="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                        {poster ? (
                          <img src={poster} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="grid h-full w-full place-items-center">
                            <Film size={16} className="text-slate-400" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
                          {title}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {item.media_type === 'tv' ? 'Serie' : 'Película'}
                          {date ? ` · ${date.slice(0, 4)}` : ''}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
