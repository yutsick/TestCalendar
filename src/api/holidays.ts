import axios from 'axios'
import type { Holiday } from '../types'

const cache = new Map<string, Holiday[]>()

export async function fetchHolidays(
  year: number,
  countryCode: string
): Promise<Holiday[]> {
  const key = `${year}-${countryCode}`
  if (cache.has(key)) return cache.get(key)!

  const { data } = await axios.get<Holiday[]>(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
  )
  cache.set(key, data)
  return data
}

export async function fetchCountries(): Promise<
  { countryCode: string; name: string }[]
> {
  const { data } = await axios.get(
    'https://date.nager.at/api/v3/AvailableCountries'
  )
  return data
}
