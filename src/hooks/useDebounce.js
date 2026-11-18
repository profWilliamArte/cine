// src/hooks/useDebounce.js
// 🎯 Qué hace: Retrasa un valor 350 ms para no llamar a la API en cada tecla.
// 🧩 Cómo se integra: SearchBar lo usa con el texto del input.

import { useEffect, useState } from 'react'

export const useDebounce = (value, delay = 350) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
