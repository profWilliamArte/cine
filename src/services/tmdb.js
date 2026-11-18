// src/services/tmdb.js
// 🎯 Qué hace: Centraliza el cliente fetch de TMDB, los endpoints y los helpers de imágenes y tráileres.
// 🧩 Cómo se integra: lo consumen todas las páginas, MovieCard, SearchBar y Detalle.

const API_BASE = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

export const DEFAULT_LANG = 'es-VE'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// Alternativa v4 (Read Access Token): define VITE_TMDB_READ_TOKEN, elimina la comprobación de API_KEY,
// quita la línea que añade api_key a la URL y envía en fetch:
// headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}` }.

const buildUrl = (path, params = {}) => {
  if (!API_KEY) {
    throw new Error('Falta VITE_TMDB_API_KEY. Copia .env.example a .env y reinicia el servidor.')
  }
  const url = new URL(`${API_BASE}${path}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', DEFAULT_LANG)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

const fetchJson = async (path, { params = {}, signal } = {}) => {
  const response = await fetch(buildUrl(path, params), { signal })
  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body.status_message ? `: ${body.status_message}` : ''
    } catch {
      detail = ''
    }
    throw new Error(`TMDB respondió ${response.status}${detail}`)
  }
  return response.json()
}

const assertMediaType = (mediaType) => {
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    throw new Error('El tipo de contenido debe ser "movie" o "tv".')
  }
}

export const getTrending = async (mediaType = 'all', timeWindow = 'week', signal) => {
  const data = await fetchJson(`/trending/${mediaType}/${timeWindow}`, { signal })
  if (mediaType === 'all') {
    return {
      ...data,
      results: (data.results ?? []).filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv',
      ),
    }
  }
  return data
}

export const getGenres = async (mediaType = 'movie', signal) => {
  assertMediaType(mediaType)
  return fetchJson(`/genre/${mediaType}/list`, { signal })
}

export const discover = async (
  mediaType = 'movie',
  { genreId, maxRuntime, sortBy = 'vote_average.desc', page = 1, signal } = {},
) => {
  assertMediaType(mediaType)
  const params = {
    sort_by: sortBy,
    page,
    include_adult: 'false',
    with_genres: genreId,
    'with_runtime.lte': maxRuntime,
  }
  if (sortBy.startsWith('vote_average')) {
    params['vote_count.gte'] = 100
  }
  return fetchJson(`/discover/${mediaType}`, {
    params,
    signal,
  })
}

export const searchMulti = async (query, signal) => {
  const term = query.trim()
  if (term.length < 2) return { results: [] }
  const data = await fetchJson('/search/multi', {
    params: { query: term, include_adult: 'false' },
    signal,
  })
  return {
    ...data,
    results: (data.results ?? []).filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv',
    ),
  }
}

export const getDetails = async (mediaType, id, signal) => {
  assertMediaType(mediaType)
  if (!id) throw new Error('Falta el id del título.')
  return fetchJson(`/${mediaType}/${id}`, {
    params: { append_to_response: 'credits,videos,watch/providers' },
    signal,
  })
}

export const getVideos = async (mediaType, id, signal) => {
  assertMediaType(mediaType)
  if (!id) throw new Error('Falta el id del título.')
  return fetchJson(`/${mediaType}/${id}/videos`, { signal })
}

export const getTrailer = (videos) => {
  const list = Array.isArray(videos) ? videos : (videos?.results ?? [])
  const youTube = list.filter((video) => video.site === 'YouTube')
  const trailer =
    youTube.find((video) => video.type === 'Trailer' && video.official) ||
    youTube.find((video) => video.type === 'Trailer') ||
    youTube.find((video) => video.type === 'Teaser') ||
    youTube[0]
  return trailer?.key ?? null
}

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null
  return `${IMG_BASE}/${size}${path}`
}
