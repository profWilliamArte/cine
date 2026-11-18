// src/context/WatchlistContext.jsx
// 🎯 Qué hace: Guarda "Para ver esta noche" en localStorage, evita duplicados y expone contador y acciones.
// 🧩 Cómo se integra: main.jsx lo provee; Navbar muestra el badge y MovieCard, MiLista y Detalle lo usan.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'cinepulse-watchlist'
const WatchlistContext = createContext(null)

const normalizeItem = (item) => {
    const mediaType = item.mediaType || item.media_type || 'movie'
    return {
        id: item.id,
        mediaType,
        title: item.title || item.name || 'Sin título',
        poster_path: item.poster_path ?? null,
        vote_average: Number(item.vote_average || 0),
        release_date: item.release_date || item.first_air_date || '',
    }
}

const readStoredItems = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : []
        if (!Array.isArray(parsed)) return []
        return parsed.filter(
            (item) => item && item.id && (item.mediaType === 'movie' || item.mediaType === 'tv'),
        )
    } catch {
        return []
    }
}

export const WatchlistProvider = ({ children }) => {
    const [items, setItems] = useState(readStoredItems)

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch { }
    }, [items])

    const isInList = useCallback(
        (mediaType, id) => {
            return items.some((item) => item.mediaType === mediaType && item.id === id)
        },
        [items],
    )

    const addItem = useCallback((item) => {
        if (!item?.id) return
        const normalized = normalizeItem(item)
        setItems((current) => {
            const exists = current.some(
                (entry) => entry.mediaType === normalized.mediaType && entry.id === normalized.id,
            )
            if (exists) return current
            return [normalized, ...current]
        })
    }, [])

    const removeItem = useCallback((mediaType, id) => {
        setItems((current) =>
            current.filter((entry) => !(entry.mediaType === mediaType && entry.id === id)),
        )
    }, [])

    const toggleItem = useCallback((item) => {
        if (!item?.id) return
        const normalized = normalizeItem(item)
        setItems((current) => {
            const exists = current.some(
                (entry) => entry.mediaType === normalized.mediaType && entry.id === normalized.id,
            )
            if (exists) {
                return current.filter(
                    (entry) =>
                        !(entry.mediaType === normalized.mediaType && entry.id === normalized.id),
                )
            }
            return [normalized, ...current]
        })
    }, [])

    const clearList = useCallback(() => setItems([]), [])

    const value = useMemo(
        () => ({ items, count: items.length, addItem, removeItem, toggleItem, clearList, isInList }),
        [items, addItem, removeItem, toggleItem, clearList, isInList],
    )

    return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export const useWatchlist = () => {
    const context = useContext(WatchlistContext)
    if (!context) throw new Error('useWatchlist debe usarse dentro de <WatchlistProvider>.')
    return context
}
