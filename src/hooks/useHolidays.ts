import { useState, useEffect, useCallback } from 'react'
import type { Holiday } from '../types'
import { fetchHolidays, fetchCountries } from '../api/holidays'

export function useHolidays(year: number, countryCode: string) {
  const [holidays, setHolidays] = useState<Holiday[]>([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        if (countryCode) {
          const data = await fetchHolidays(year, countryCode)
          if (!cancelled) setHolidays(data)
        } else {
          const countries = await fetchCountries()
          const results = await Promise.all(
            countries.map((c) => fetchHolidays(year, c.countryCode))
          )
          if (!cancelled) setHolidays(results.flat())
        }
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
