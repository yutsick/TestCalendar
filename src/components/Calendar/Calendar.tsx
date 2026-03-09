import { useState, useEffect, useRef, useCallback, type DragEvent } from 'react'
import type { Task } from '../../types'
import { useCalendar } from '../../hooks/useCalendar'
import { useTasks } from '../../hooks/useTasks'
import { useHolidays } from '../../hooks/useHolidays'
import { fetchCountries } from '../../api/holidays'
import CalendarCell from './CalendarCell'
import {
  CalendarWrapper,
  Header,
  MonthNav,
  MonthLabel,
  NavButton,
  TodayButton,
  SearchInput,
  CountrySelect,
  Grid,
  DayHeader,
} from './styles'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Calendar() {
  const {
    year,
    days,
    dateRange,
    monthLabel,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  } = useCalendar()

  const {
    addTask,
    editTask,
    removeTask,
    reorderTasks,
    getTasksForDate,
  } = useTasks(dateRange.start, dateRange.end)

  const [countryCode, setCountryCode] = useState('UA')
  const [countries, setCountries] = useState<
    { countryCode: string; name: string }[]
  >([])
  const [searchQuery, setSearchQuery] = useState('')

  const { getHolidaysForDate } = useHolidays(year, countryCode)

  useEffect(() => {
    fetchCountries().then(setCountries).catch(console.error)
  }, [])

  // Drag state
  const draggedTask = useRef<Task | null>(null)
  const dragOverTask = useRef<Task | null>(null)
  const dragOverDate = useRef<string | null>(null)

  const handleDragStart = useCallback((e: DragEvent, task: Task) => {
    draggedTask.current = task
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task._id)
  }, [])

  const handleDragEnd = useCallback(() => {
    draggedTask.current = null
    dragOverTask.current = null
    dragOverDate.current = null
  }, [])

  const handleDragOverTask = useCallback((_e: DragEvent, task: Task) => {
    dragOverTask.current = task
    dragOverDate.current = task.date
  }, [])

  const handleDrop = useCallback(
    (_e: DragEvent, targetDate: string, targetIndex: number) => {
      const dragged = draggedTask.current
      if (!dragged) return

      const overTask = dragOverTask.current
      const sameCell = dragged.date === targetDate

      if (sameCell && overTask && overTask._id !== dragged._id) {
        // Reorder within the same cell
        const cellTasks = getTasksForDate(targetDate).slice()
        const fromIdx = cellTasks.findIndex((t) => t._id === dragged._id)
        const toIdx = cellTasks.findIndex((t) => t._id === overTask._id)
        if (fromIdx === -1 || toIdx === -1) return

        cellTasks.splice(fromIdx, 1)
        cellTasks.splice(toIdx, 0, dragged)

        const updates = cellTasks.map((t, i) => ({
          id: t._id,
          date: targetDate,
          order: i,
        }))
        reorderTasks(updates)
      } else if (!sameCell) {
        // Move to different cell
        // Remove from source cell
        const sourceTasks = getTasksForDate(dragged.date)
          .filter((t) => t._id !== dragged._id)
        const sourceUpdates = sourceTasks.map((t, i) => ({
          id: t._id,
          date: dragged.date,
          order: i,
        }))

        // Insert into target cell
        const targetTasks = getTasksForDate(targetDate).slice()
        let insertIdx = targetIndex

        if (overTask) {
          const overIdx = targetTasks.findIndex(
            (t) => t._id === overTask._id
          )
          if (overIdx !== -1) insertIdx = overIdx
        }

        targetTasks.splice(insertIdx, 0, dragged)
        const targetUpdates = targetTasks.map((t, i) => ({
          id: t._id,
          date: targetDate,
          order: i,
        }))

        reorderTasks([...sourceUpdates, ...targetUpdates])
      }

      handleDragEnd()
    },
    [getTasksForDate, reorderTasks, handleDragEnd]
  )

  const handleAddTask = useCallback(
    (title: string, date: string) => {
      addTask(title, date)
    },
    [addTask]
  )

  const handleEditTask = useCallback(
    (id: string, title: string) => {
      editTask(id, { title })
    },
    [editTask]
  )

  return (
    <CalendarWrapper>
      <Header>
        <MonthNav>
          <NavButton onClick={goToPrevMonth}>‹</NavButton>
          <MonthLabel>{monthLabel}</MonthLabel>
          <NavButton onClick={goToNextMonth}>›</NavButton>
        </MonthNav>
        <TodayButton onClick={goToToday}>Today</TodayButton>
        <SearchInput
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <CountrySelect
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.countryCode} value={c.countryCode}>
              {c.name}
            </option>
          ))}
        </CountrySelect>
      </Header>

      <Grid>
        {WEEKDAYS.map((d) => (
          <DayHeader key={d}>{d}</DayHeader>
        ))}

        {days.map((day) => (
          <CalendarCell
            key={day.date}
            day={day}
            tasks={getTasksForDate(day.date)}
            holidays={getHolidaysForDate(day.date)}
            searchQuery={searchQuery}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={removeTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onDragOverTask={handleDragOverTask}
          />
        ))}
      </Grid>
    </CalendarWrapper>
  )
}
