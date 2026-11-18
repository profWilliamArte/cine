// src/pages/Home.jsx
// 🎯 Qué hace: Muestra un hero con la tendencia #1 de la semana, accesos rápidos y la rejilla de tendencias.
// 🧩 Cómo se integra: App.jsx lo renderiza en "/"; usa getTrending, getImageUrl, MovieGrid y WatchlistContext.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Clapperboard, Heart, Plus, Sparkles, Star, Tv } from 'lucide-react'
import MovieGrid from '../components/MovieGrid'
import { getImageUrl, getTrending } from '../services/tmdb'
import { useWatchlist } from '../context/WatchlistContext'

const QUICK_LINKS = [
  {
    to: '/que-veo-hoy',
    title: '¿Qué veo hoy?',
    description: 'Elige por ánimo y tiempo disponible.',
    Icon: Sparkles,
  },
  {
    to: '/peliculas',
    title: 'Películas',
    description: 'Explora el catálogo por género.',
    Icon: Clapperboard,
  },
  {
    to: '/series',
    title: 'Series',
    description: 'Encuentra tu próxima maratón.',
    Icon: Tv,
  },
  {
    to: '/mi-lista',
    title: 'Mi lista',
    description: 'Tus títulos guardados para esta noche.',
    Icon: Heart,
  },
]

const Home = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [columns, setColumns] = useState(5)
  const { toggleItem, isInList } = useWatchlist()

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getTrending('all', 'week', controller.signal)
      .then((data) => setItems(data.results ?? []))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const hero = items[0]
  const heroType = hero?.media_type || 'movie'
  const heroTitle = hero?.title || hero?.name || 'Sin título'
  const heroBackdrop = getImageUrl(hero?.backdrop_path, 'original')
  const heroSaved = hero ? isInList(heroType, hero.id) : false

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map(({ to, title, description, Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Icon size={20} />
            </span>
            <h2 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
          </Link>
        ))}
      </section>

      {loading && <div className="h-[420px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />}

      {!loading && !error && hero && (
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
          {heroBackdrop && (
            <img
              src={heroBackdrop}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-950/10" />
          <div className="relative flex min-h-[420px] flex-col justify-end gap-4 p-6 sm:p-10">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <Sparkles size={14} /> Tendencia de la semana
            </span>
            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              {heroTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                <Star size={16} className="fill-amber-300" />{' '}
                {Number(hero.vote_average || 0).toFixed(1)}
              </span>
              <span>{(hero.release_date || hero.first_air_date || '').slice(0, 4) || '—'}</span>
              <span className="rounded-full border border-white/30 px-2 py-0.5 text-xs uppercase">
                {heroType === 'tv' ? 'Serie' : 'Película'}
              </span>
            </div>
            <p className="line-clamp-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              {hero.overview || 'Sin sinopsis disponible.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/detalle/${heroType}/${hero.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-brand-400"
              >
                Ver detalle
              </Link>
              <button
                type="button"
                onClick={() => toggleItem({ ...hero, mediaType: heroType })}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:border-brand-400 hover:text-brand-300"
              >
                {heroSaved ? <Check size={16} /> : <Plus size={16} />}
                {heroSaved ? 'En mi lista' : 'Mi lista'}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tendencias
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Lo más visto en películas y series esta semana.
          </p>
        </div>
        <MovieGrid
          items={items}
          loading={loading}
          error={error}
          columns={columns}
          onColumnsChange={setColumns}
          emptyMessage="TMDB no devolvió tendencias en este momento."
        />
      </section>
    </div>
  )
}

export default Home
