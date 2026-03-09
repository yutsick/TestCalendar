import { useState, useMemo, useCallback } from 'react'
import type { DayCell } from '../types'

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isToday(date: string): boolean {
  return date === formatDate(new Date())
}

export function useCalendar() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())

  const days = useMemo<DayCell[]>(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Monday=0

    const cells: DayCell[] = []

    // Previous month fill
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      const date = formatDate(d)
      cells.push({
        date,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: isToday(date),
      })
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = formatDate(new Date(year, month, d))
      cells.push({
        date,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: isToday(date),
      })
    }

    // Next month fill (up to 42 cells = 6 rows)
    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d++) {
      const date = formatDate(new Date(year, month + 1, d))
      cells.push({
        date,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: isToday(date),
      })
    }

    return cells
  }, [year, month])

  const dateRange = useMemo(
    () => ({
      start: days[0].date,
      end: days[days.length - 1].date,
    }),
    [days]
  )

  const goToPrevMonth = useCallback(() => {
    if (month === 0) {
      setYear((y) => y - 1)
      setMonth(11)
    } else {
      setMonth((m) => m - 1)
    }
  }, [month])

  const goToNextMonth = useCallback(() => {
    if (month === 11) {
      setYear((y) => y + 1)
      setMonth(0)
    } else {
      setMonth((m) => m + 1)
    }
  }, [month])

  const goToToday = useCallback(() => {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
  }, [])

  const monthLabel = useMemo(() => {
    return new Date(year, month).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }, [year, month])

  return {
    year,
    month,
    days,
    dateRange,
    monthLabel,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  }
}
