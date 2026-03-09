import { useState, useEffect, useCallback } from 'react'
import type { Holiday } from '../types'
import { fetchHolidays } from '../api/holidays'

export function useHolidays(year: number, countryCode: string) {
  const [holidays, setHolidays] = useState<Holiday[]>([])

  useEffect(() => {
    if (!countryCode) return
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetchHolidays(year, countryCode)
        if (!cancelled) setHolidays(data)
      } catch (err) {
        console.error('Failed to load holidays:', err)
      }
    }
    load()

    return () => {
      cancelled = true
    }
  }, [year, countryCode])

  const getHolidaysForDate = useCallback(
    (date: string) => holidays.filter((h) => h.date === date),
    [holidays]
  )

  return { holidays, getHolidaysForDate }
}
