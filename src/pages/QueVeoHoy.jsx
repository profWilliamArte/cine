// src/pages/QueVeoHoy.jsx
// 🎯 Qué hace: Recomienda una película según ánimo y tiempo, y la ruleta elige una opción con confeti.
// 🧩 Cómo se integra: App.jsx lo monta en "/que-veo-hoy"; usa MoodSelector, discover, MovieCard y canvas-confetti.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { Dices, Film, LoaderCircle, RotateCcw, Sparkles, Star } from 'lucide-react'
import MoodSelector, { MOODS } from '../components/MoodSelector'
import MovieCard from '../components/MovieCard'
import { discover, getImageUrl } from '../services/tmdb'

const RUNTIMES = [
  { value: 90, label: 'Hasta 90 min' },
  { value: 120, label: 'Hasta 2 horas' },
  { value: 150, label: 'Hasta 2 h 30 min' },
  { value: 180, label: 'Hasta 3 horas' },
]

const QueVeoHoy = () => {
  const [moodId, setMoodId] = useState(MOODS[0].id)
  const [maxRuntime, setMaxRuntime] = useState(120)
  const [results, setResults] = useState([])
  const [picked, setPicked] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const mood = MOODS.find((item) => item.id === moodId) ?? MOODS[0]

  const reset = (nextMoodId = moodId, nextRuntime = maxRuntime) => {
    setMoodId(nextMoodId)
    setMaxRuntime(nextRuntime)
    setResults([])
    setPicked(null)
    setError('')
    setSearched(false)
  }

  const loadOptions = async () => {
    setLoading(true)
    setError('')
    setPicked(null)
    try {
      const data = await discover('movie', { genreId: mood.genreId, maxRuntime })
      const list = (data.results ?? []).filter((item) => item.poster_path)
      setResults(list)
      setSearched(true)
      return list
    } catch (err) {
      setError(err.message)
      setResults([])
      setSearched(true)
      return []
    } finally {
      setLoading(false)
    }
  }

  const handleRandom = async () => {
    let list = results
    if (!searched || list.length === 0) {
      list = await loadOptions()
    }
    if (list.length === 0) return
    const pool = list.length > 1 && picked ? list.filter((item) => item.id !== picked.id) : list
    const choice = pool[Math.floor(Math.random() * pool.length)]
    setPicked(choice)
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
  }

  const handleMood = (nextMoodId) => reset(nextMoodId, maxRuntime)
  const handleRuntime = (event) => reset(moodId, Number(event.target.value))
  const pickedPoster = getImageUrl(picked?.poster_path, 'w500')

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          <Sparkles size={14} /> Recomendador
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          ¿Qué veo hoy?
        </h1>
        <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Elige tu ánimo y el tiempo que tienes. CinePulse buscará películas populares en TMDB y la
          ruleta elegirá una.
        </p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <MoodSelector
          selectedMood={moodId}
          onSelect={handleMood}
          onRandom={handleRandom}
          disabled={loading}
        />
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label htmlFor="runtime" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Tiempo disponible
          </label>
          <select
            id="runtime"
            value={maxRuntime}
            onChange={handleRuntime}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            {RUNTIMES.map((runtime) => (
              <option key={runtime.value} value={runtime.value}>
                {runtime.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={loadOptions}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200"
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Film size={16} />}
            Ver opciones
          </button>
          <button
            type="button"
            onClick={handleRandom}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Dices size={16} /> Girar la ruleta
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {picked && (
        <section className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-xl dark:border-brand-900 dark:bg-slate-900">
          <div className="grid gap-6 p-5 sm:grid-cols-[180px_1fr] sm:p-6">
            <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
              {pickedPoster ? (
                <img
                  src={pickedPoster}
                  alt={`Póster de ${picked.title}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-slate-400">
                  <Film size={40} />
                </div>
              )}
            </div>
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                <Dices size={14} /> La ruleta eligió
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {picked.title || picked.name}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <Star size={14} className="fill-amber-400 text-amber-400" />{' '}
                  {Number(picked.vote_average || 0).toFixed(1)}
                </span>
                <span>{(picked.release_date || '').slice(0, 4) || '—'}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {picked.overview || 'Sin sinopsis disponible.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/detalle/movie/${picked.id}`}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-900 dark:hover:bg-brand-400"
                >
                  Ver detalle
                </Link>
                <button
                  type="button"
                  onClick={handleRandom}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                >
                  <RotateCcw size={15} /> Otra opción
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No encontramos películas con ese ánimo y ese tiempo. Prueba con más minutos.
        </div>
      )}

      {results.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Opciones para tu noche
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.slice(0, 10).map((item) => (
              <MovieCard key={item.id} item={item} mediaType="movie" />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default QueVeoHoy
