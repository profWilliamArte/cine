// src/pages/Detalle.jsx
// 🎯 Qué hace: Muestra la ficha completa de una película o serie, reparto y tráiler oficial de YouTube.
// 🧩 Cómo se integra: App.jsx lo monta en "/detalle/:mediaType/:id"; lee useParams, llama getDetails y usa WatchlistContext.

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Film,
  Heart,
  LoaderCircle,
  Plus,
  Star,
  Tv,
  User,
} from 'lucide-react'
import { getDetails, getImageUrl, getTrailer } from '../services/tmdb'
import { useWatchlist } from '../context/WatchlistContext'

const formatRuntime = (minutes) => {
  if (!minutes) return 'No disponible'
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  if (hours === 0) return `${remaining} min`
  return `${hours} h ${remaining} min`
}

const formatDate = (date) => {
  if (!date) return 'No disponible'
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat('es-VE', { dateStyle: 'long' }).format(parsed)
}

const formatMoney = (value) => {
  if (!value || value <= 0) return 'No disponible'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

const Detalle = () => {
  const { mediaType, id } = useParams()
  const navigate = useNavigate()
  const { toggleItem, isInList } = useWatchlist()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paisCodigo, setPaisCodigo] = useState('ES')
  const validType = mediaType === 'movie' || mediaType === 'tv'

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!validType) {
      setData(null)
      setError('El tipo de contenido debe ser "movie" o "tv".')
      setLoading(false)
      return undefined
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setData(null)
    getDetails(mediaType, id, controller.signal)
      .then((detail) => setData(detail))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [mediaType, id, validType])

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-4">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <LoaderCircle size={22} className="animate-spin" /> Cargando detalle…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          No pudimos cargar este título
        </h1>
        <p className="mt-2 text-sm text-red-500">{error}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
          >
            Volver
          </button>
          <Link
            to="/"
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 dark:border-slate-700 dark:text-slate-200"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!data) return null

  const title = data.title || data.name || 'Sin título'
  const date = data.release_date || data.first_air_date || ''
  const runtime = mediaType === 'movie' ? data.runtime : data.episode_run_time?.[0]
  const backdrop = getImageUrl(data.backdrop_path, 'original')
  const poster = getImageUrl(data.poster_path, 'w500')
  const trailerKey = getTrailer(data.videos?.results)
  const cast = (data.credits?.cast ?? []).slice(0, 10)
  const genres = data.genres ?? []
  const saved = isInList(mediaType, data.id)
  const typeLabel = mediaType === 'movie' ? 'Película' : 'Serie'
  const totalSeasons = data.number_of_seasons
  const totalEpisodes = data.number_of_episodes

  // Proveedores de streaming (JustWatch vía TMDB)
  const watchResults = data['watch/providers']?.results || {}
  const region =
    watchResults[paisCodigo] ||
    watchResults.ES ||
    watchResults.MX ||
    watchResults.US ||
    Object.values(watchResults)[0] ||
    {}
  const streamingPlatforms = region.flatrate || []
  const rentPlatforms = region.rent || []
  const buyPlatforms = region.buy || []
  const justWatchLink = region.link

  return (
    <article className="pb-12">
      <div className="relative min-h-[420px] overflow-hidden bg-slate-900 text-white">
        {backdrop ? (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-brand-900" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-end sm:py-12">
          <div className="hidden w-52 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-2xl sm:block">
            {poster ? (
              <img
                src={poster}
                alt={`Póster de ${title}`}
                className="aspect-[2/3] h-full w-full object-cover"
              />
            ) : (
              <div className="grid aspect-[2/3] place-items-center bg-slate-800">
                <Film size={42} className="text-slate-500" />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition hover:border-brand-400 hover:text-brand-300"
            >
              <ArrowLeft size={15} /> Volver
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
                {typeLabel}
              </span>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
              {data.tagline && (
                <p className="mt-2 text-sm italic text-slate-300">“{data.tagline}”</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                <Star size={16} className="fill-amber-300" />{' '}
                {Number(data.vote_average || 0).toFixed(1)}
                <span className="font-normal text-slate-400">({data.vote_count ?? 0} votos)</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar size={15} /> {formatDate(date)}
              </span>
              {runtime ? (
                <span className="inline-flex items-center gap-1">
                  <Clock size={15} /> {formatRuntime(runtime)}
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => toggleItem({ ...data, mediaType })}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  saved
                    ? 'bg-brand-500 text-white hover:bg-brand-600'
                    : 'bg-white text-slate-900 hover:bg-brand-400'
                }`}
              >
                {saved ? <Check size={16} /> : <Plus size={16} />}
                {saved ? 'En mi lista' : 'Añadir a mi lista'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Sinopsis</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {data.overview || 'Sin sinopsis disponible para este título.'}
            </p>
          </section>

          {/* ¿Dónde verla en Streaming? (JustWatch) */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📺</span>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  ¿Dónde verla ahora?
                </h2>
              </div>

              {/* Selector de País */}
              <div className="flex items-center gap-2">
                <select
                  value={paisCodigo}
                  onChange={(e) => setPaisCodigo(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="ES">🇪🇸 España</option>
                  <option value="MX">🇲🇽 México</option>
                  <option value="AR">🇦🇷 Argentina</option>
                  <option value="CO">🇨🇴 Colombia</option>
                  <option value="US">🇺🇸 EE.UU.</option>
                </select>

                {justWatchLink && (
                  <a
                    href={justWatchLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 no-underline"
                  >
                    JustWatch ↗
                  </a>
                )}
              </div>
            </div>

            {/* Suscripción (Streaming plano) */}
            {streamingPlatforms.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  En Suscripción (Streaming):
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {streamingPlatforms.map((provider) => (
                    <div
                      key={provider.provider_id}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 pr-3 dark:border-slate-800 dark:bg-slate-950 shadow-xs hover:border-brand-500 transition-all"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="h-7 w-7 rounded-lg object-cover shadow"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {provider.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alquiler / Compra si no hay streaming directo o como complemento */}
            {streamingPlatforms.length === 0 && (rentPlatforms.length > 0 || buyPlatforms.length > 0) && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Disponible en Alquiler / Compra:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {[...rentPlatforms, ...buyPlatforms]
                    .filter((v, i, a) => a.findIndex((t) => t.provider_id === v.provider_id) === i)
                    .map((provider) => (
                      <div
                        key={provider.provider_id}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 pr-3 dark:border-slate-800 dark:bg-slate-950 shadow-xs hover:border-brand-500 transition-all"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="h-7 w-7 rounded-lg object-cover shadow"
                        />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {provider.provider_name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Sin opciones para este país */}
            {streamingPlatforms.length === 0 && rentPlatforms.length === 0 && buyPlatforms.length === 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ℹ️ No disponible en streaming ni alquiler en esta región actualmente (próximo estreno o sin licencia activa).
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Tráiler oficial
            </h2>
            {trailerKey ? (
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-lg dark:border-slate-800">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title={`Tráiler de ${title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                TMDB no tiene un tráiler de YouTube disponible para este título.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Reparto principal
            </h2>
            {cast.length > 0 ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cast.map((person) => {
                  const photo = getImageUrl(person.profile_path, 'w185')
                  return (
                    <div
                      key={`${person.id}-${person.character || person.order}`}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        {photo ? (
                          <img
                            src={photo}
                            alt={`Foto de ${person.name}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="grid h-full w-full place-items-center text-slate-400">
                            <User size={22} />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {person.name}
                        </span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                          {person.character || 'Reparto'}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                No hay información de reparto disponible.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Ficha
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Tv size={15} /> Tipo
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-white">{typeLabel}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar size={15} /> Estreno
                </dt>
                <dd className="text-right font-semibold text-slate-900 dark:text-white">
                  {date || 'No disponible'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock size={15} /> Duración
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-white">
                  {formatRuntime(runtime)}
                </dd>
              </div>
              {mediaType === 'movie' ? (
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <DollarSign size={15} /> Presupuesto
                  </dt>
                  <dd className="text-right font-semibold text-slate-900 dark:text-white">
                    {formatMoney(data.budget)}
                  </dd>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Tv size={15} /> Temporadas
                    </dt>
                    <dd className="font-semibold text-slate-900 dark:text-white">
                      {totalSeasons ?? 'No disponible'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Film size={15} /> Episodios
                    </dt>
                    <dd className="font-semibold text-slate-900 dark:text-white">
                      {totalEpisodes ?? 'No disponible'}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          <Link
            to="/mi-lista"
            className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <span className="inline-flex items-center gap-2">
              <Heart size={16} /> Ver mi lista
            </span>
            <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </article>
  )
}

export default Detalle
