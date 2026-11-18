// src/components/Footer.jsx
// 🎯 Qué hace: Pie de página personalizable con enlaces del alumno y la atribución obligatoria de TMDB.
// 🧩 Cómo se integra: App.jsx lo renderiza al final del layout.

import { Code, Globe, Heart, Mail } from 'lucide-react'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
                <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Cine<span className="text-brand-500">Pulse</span>
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                        Recomendador de películas y series construido con React, Vite, Tailwind CSS y la API de
                        TMDB. Proyecto del Curso Fullstack JS 2026.
                    </p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        Desarrollado por <span className="font-semibold text-slate-800 dark:text-slate-200">Tu Nombre</span>
                    </p>
                </div>

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Enlaces
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li>
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                            >
                                <Code size={16} /> GitHub
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://example.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                            >
                                <Globe size={16} /> Portafolio
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:tu-correo@ejemplo.com"
                                className="inline-flex items-center gap-2 text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400"
                            >
                                <Mail size={16} /> tu-correo@ejemplo.com
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Datos
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        This product uses the TMDB API but is not endorsed or certified by TMDB.
                    </p>
                    <a
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400"
                    >
                        Visitar TMDB
                    </a>
                </div>
            </div>

            <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
                <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-1 text-center text-xs text-slate-500 dark:text-slate-400">
                    © {year} CinePulse · Hecho con <Heart size={12} className="fill-brand-500 text-brand-500" /> para el
                    Curso Fullstack JS 2026
                </p>
            </div>
        </footer>
    )
}

export default Footer
