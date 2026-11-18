// src/pages/MiLista.jsx
// 🎯 Qué hace: Lista la watchlist persistida, permite eliminar un título o vaciar toda la lista.
// 🧩 Cómo se integra: App.jsx lo monta en "/mi-lista"; usa WatchlistContext y MovieGrid con onRemove.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, ListX } from 'lucide-react'
import MovieGrid from '../components/MovieGrid'
import { useWatchlist } from '../context/WatchlistContext'

const MiLista = () => {
  const { items, count, removeItem, clearList } = useWatchlist()
  const [columns, setColumns] = useState(5)

  const handleClear = () => {
    if (window.confirm('¿Quieres vaciar toda tu lista?')) clearList()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            <Heart size={14} /> Para ver esta noche
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Mi lista
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {count === 1 ? '1 título guardado.' : `${count} títulos guardados.`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          disabled={count === 0}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          <ListX size={15} /> Limpiar todo
        </button>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
          <Heart size={44} className="mx-auto text-slate-300 dark:text-slate-700" />
          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            Tu lista está vacía
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Guarda películas y series con el botón + de cada tarjeta.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link
              to="/peliculas"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              Explorar películas <ArrowRight size={15} />
            </Link>
            <Link
              to="/series"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 dark:border-slate-700 dark:text-slate-200"
            >
              Explorar series
            </Link>
          </div>
        </div>
      ) : (
        <MovieGrid
          items={items}
          columns={columns}
          onColumnsChange={setColumns}
          onRemove={removeItem}
          emptyMessage="Tu lista está vacía."
        />
      )}
    </div>
  )
}

export default MiLista
