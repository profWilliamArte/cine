// src/components/MovieGrid.jsx
// 🎯 Qué hace: Rejilla responsive con selector de columnas, skeletons, error y estado vacío.
// 🧩 Cómo se integra: Home, Peliculas, Series y MiLista lo usan; renderiza MovieCard.

import { LayoutGrid, TriangleAlert } from 'lucide-react'
import MovieCard from './MovieCard'

const COLUMN_OPTIONS = [3, 4, 5, 6]

const COLUMN_CLASSES = {
  3: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
}

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div className="aspect-[2/3] animate-pulse bg-slate-200 dark:bg-slate-800" />
    <div className="space-y-2 p-3">
      <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-3 w-2/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
)

const MovieGrid = ({
  items = [],
  loading = false,
  error = '',
  mediaType,
  columns = 5,
  onColumnsChange,
  onRemove,
  emptyMessage = 'No encontramos resultados con esos filtros.',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
        <TriangleAlert size={18} className="mt-0.5 shrink-0" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{items.length} título(s)</p>
        {onColumnsChange && (
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-400 sm:flex">
              <LayoutGrid size={14} /> Columnas
            </span>
            <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1 dark:border-slate-800">
              {COLUMN_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onColumnsChange(option)}
                  className={`h-7 w-7 rounded-full text-xs font-bold transition ${
                    columns === option
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                  aria-label={`Mostrar ${option} columnas`}
                  aria-pressed={columns === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${COLUMN_CLASSES[columns] || COLUMN_CLASSES[5]}`}>
          {items.map((item) => (
            <MovieCard
              key={`${item.mediaType || item.media_type || mediaType || 'movie'}-${item.id}`}
              item={item}
              mediaType={mediaType}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MovieGrid
