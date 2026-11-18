// src/pages/Series.jsx
// 🎯 Qué hace: Catálogo de series con filtros por género, recarga y selector de columnas.
// 🧩 Cómo se integra: App.jsx lo monta en "/series"; usa getGenres('tv'), discover('tv') y MovieGrid.

import { useEffect, useState } from 'react'
import { RotateCcw, Tv, ChevronLeft, ChevronRight } from 'lucide-react'
import MovieGrid from '../components/MovieGrid'
import { discover, getGenres } from '../services/tmdb'

const Series = () => {
  const [genres, setGenres] = useState([])
  const [genreError, setGenreError] = useState('')
  const [genreId, setGenreId] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [columns, setColumns] = useState(5)
  const [reloadKey, setReloadKey] = useState(0)
  const [sortBy, setSortBy] = useState('vote_average.desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    getGenres('tv', controller.signal)
      .then((data) => setGenres(data.genres ?? []))
      .catch((err) => {
        if (err.name !== 'AbortError') setGenreError(err.message)
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    discover('tv', { genreId, sortBy, page, signal: controller.signal })
      .then((data) => {
        setItems(data.results ?? [])
        setTotalPages(Math.min(data.total_pages || 1, 500))
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [genreId, sortBy, page, reloadKey])

  const activeGenre = genres.find((genre) => genre.id === genreId)

  const handleGenreSelect = (id) => {
    setGenreId(id)
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            <Tv size={14} /> Catálogo
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Series
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeGenre
              ? `Explorando: ${activeGenre.name}`
              : 'Las series más destacadas del momento.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Orden */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-brand-500"
            >
              <option value="vote_average.desc">⭐ Mejor puntuadas</option>
              <option value="popularity.desc">🔥 Más populares</option>
              <option value="first_air_date.desc">📅 Más recientes</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <RotateCcw size={14} /> Recargar
          </button>
        </div>
      </header>

      {/* Filtro de Géneros */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => handleGenreSelect(null)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition cursor-pointer ${
            genreId === null
              ? 'border-brand-500 bg-brand-500 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-700 hover:border-brand-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
          }`}
          aria-pressed={genreId === null}
        >
          Todas
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() => handleGenreSelect(genre.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition cursor-pointer ${
              genreId === genre.id
                ? 'border-brand-500 bg-brand-500 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
            }`}
            aria-pressed={genreId === genre.id}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {genreError && (
        <p className="text-sm text-red-500">No se pudieron cargar los géneros: {genreError}</p>
      )}

      {/* Grid de Series */}
      <MovieGrid
        items={items}
        loading={loading}
        error={error}
        mediaType="tv"
        columns={columns}
        onColumnsChange={setColumns}
        emptyMessage="No hay series para este filtro en este momento."
      />

      {/* Paginador */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-8 pb-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(p - 1, 1))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-3">
            Página <strong className="text-slate-900 dark:text-white font-bold">{page}</strong> de {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(p + 1, totalPages))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Series
