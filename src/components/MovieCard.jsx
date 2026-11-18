// src/components/MovieCard.jsx
// 🎯 Qué hace: Muestra una tarjeta con póster, título, año, rating, link al detalle y botón de watchlist.
// 🧩 Cómo se integra: MovieGrid, Home, QueVeoHoy y MiLista lo renderizan; usa WatchlistContext.

import { Link } from 'react-router-dom'
import { Check, Film, Plus, Star, Trash2 } from 'lucide-react'
import { getImageUrl } from '../services/tmdb'
import { useWatchlist } from '../context/WatchlistContext'

const MovieCard = ({ item, mediaType, onRemove }) => {
  const { toggleItem, isInList } = useWatchlist()
  const type = mediaType || item.media_type || item.mediaType || 'movie'
  const title = item.title || item.name || 'Sin título'
  const date = item.release_date || item.first_air_date || ''
  const year = date ? date.slice(0, 4) : '—'
  const poster = getImageUrl(item.poster_path, 'w342')
  const rating = Number(item.vote_average || 0).toFixed(1)
  const saved = isInList(type, item.id)

  const handleWatchlist = () => {
    toggleItem({ ...item, mediaType: type })
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700">
      <Link to={`/detalle/${type}/${item.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          {poster ? (
            <img
              src={poster}
              alt={`Póster de ${title}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-400">
              <Film size={40} aria-hidden="true" />
            </div>
          )}
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-slate-950/80 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star size={12} className="fill-amber-400 text-amber-400" /> {rating}
          </span>
          <div className="absolute inset-0 grid place-items-center bg-slate-950/60 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-900">
              Ver detalle
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {year} · {type === 'tv' ? 'Serie' : 'Película'}
          </p>
        </div>
      </Link>

      {onRemove ? (
        <button
          type="button"
          onClick={() => onRemove(type, item.id)}
          className="absolute right-2 top-2 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-red-500 hover:text-white dark:bg-slate-800/90 dark:text-slate-200"
          aria-label={`Quitar ${title} de mi lista`}
        >
          <Trash2 size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleWatchlist}
          className={`absolute right-2 top-2 z-20 grid h-9 w-9 place-items-center rounded-full shadow-md transition ${
            saved
              ? 'bg-brand-500 text-white hover:bg-brand-600'
              : 'bg-white/90 text-slate-700 hover:bg-brand-500 hover:text-white dark:bg-slate-800/90 dark:text-slate-200'
          }`}
          aria-label={saved ? `Quitar ${title} de mi lista` : `Añadir ${title} a mi lista`}
          aria-pressed={saved}
        >
          {saved ? <Check size={16} /> : <Plus size={16} />}
        </button>
      )}
    </article>
  )
}

export default MovieCard
