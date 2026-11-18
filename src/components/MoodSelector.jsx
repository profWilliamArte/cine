// src/components/MoodSelector.jsx
// 🎯 Qué hace: Muestra los botones de ánimo y la ruleta "Sorpréndeme"; exporta la lista MOODS.
// 🧩 Cómo se integra: QueVeoHoy lo usa y lee MOODS para convertir cada ánimo en un género de TMDB.

import { CloudRain, Dices, Ghost, Laugh, Users, Zap } from 'lucide-react'

export const MOODS = [
  { id: 'risas', label: 'Risas', Icon: Laugh, genreId: 35 },
  { id: 'tension', label: 'Tensión', Icon: Ghost, genreId: 53 },
  { id: 'accion', label: 'Acción', Icon: Zap, genreId: 28 },
  { id: 'drama', label: 'Drama', Icon: CloudRain, genreId: 18 },
  { id: 'familia', label: 'Familia', Icon: Users, genreId: 10751 },
]

const MoodSelector = ({ selectedMood, onSelect, onRandom, disabled = false }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MOODS.map((mood) => {
          const active = selectedMood === mood.id
          const Icon = mood.Icon
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelect(mood.id)}
              disabled={disabled}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                active
                  ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-600 dark:hover:text-brand-400'
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              {mood.label}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onRandom}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-brand-400"
      >
        <Dices size={18} />
        Sorpréndeme
      </button>
    </div>
  )
}

export default MoodSelector
