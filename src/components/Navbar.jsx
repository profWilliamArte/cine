// src/components/Navbar.jsx
// 🎯 Qué hace: Muestra el logo, los enlaces activos, el buscador, el badge de la lista y el switch claro/oscuro.
// 🧩 Cómo se integra: App.jsx lo renderiza; usa ThemeContext, WatchlistContext y SearchBar.

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Clapperboard, Heart, Menu, Moon, Sun, X } from 'lucide-react'
import SearchBar from './SearchBar'
import { useTheme } from '../context/ThemeContext'
import { useWatchlist } from '../context/WatchlistContext'

const LINKS = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/que-veo-hoy', label: '¿Qué veo hoy?' },
    { to: '/peliculas', label: 'Películas' },
    { to: '/series', label: 'Series' },
    { to: '/mi-lista', label: 'Mi lista' },
]

const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${isActive
        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`

const Navbar = () => {
    const { isDark, toggleTheme } = useTheme()
    const { count } = useWatchlist()
    const [menuOpen, setMenuOpen] = useState(false)

    const closeMenu = () => setMenuOpen(false)

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
            <nav className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3">
                <NavLink
                    to="/"
                    end
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white"
                >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                        <Clapperboard size={20} />
                    </span>
                    <span>
                        Cine<span className="text-brand-500">Pulse</span>
                    </span>
                </NavLink>

                <div className="ml-4 hidden items-center gap-1 lg:flex">
                    {LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="ml-auto hidden w-72 md:block">
                    <SearchBar />
                </div>

                <NavLink
                    to="/mi-lista"
                    onClick={closeMenu}
                    className="relative ml-auto grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand-400 hover:text-brand-500 md:ml-0 dark:border-slate-800 dark:text-slate-300"
                    aria-label={`Mi lista: ${count} títulos`}
                >
                    <Heart size={18} />
                    {count > 0 && (
                        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
                            {count > 99 ? '99+' : count}
                        </span>
                    )}
                </NavLink>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-brand-400 hover:text-brand-500 dark:border-slate-800 dark:text-slate-300"
                    aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 lg:hidden dark:border-slate-800 dark:text-slate-300"
                    aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </nav>

            {menuOpen && (
                <div className="border-t border-slate-200 px-4 pb-4 pt-3 lg:hidden dark:border-slate-800">
                    <div className="mb-3 md:hidden">
                        <SearchBar />
                    </div>
                    <div className="flex flex-col gap-1">
                        {LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={closeMenu}
                                className={navLinkClass}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
