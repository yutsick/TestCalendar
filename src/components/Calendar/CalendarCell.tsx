import { useState, useRef, useEffect, type DragEvent } from 'react'
import type { Task, Holiday, DayCell } from '../../types'
import TaskItem from './TaskItem'
import {
  Cell,
  DayNumber,
  HolidayBadge,
  TaskList,
  InlineInput,
  AddTaskArea,
} from './styles'

interface Props {
  day: DayCell
  tasks: Task[]
  holidays: Holiday[]
  searchQuery: string
  onAddTask: (title: string, date: string) => void
  onEditTask: (id: string, title: string) => void
  onDeleteTask: (id: string) => void
  onDragStart: (e: DragEvent, task: Task) => void
  onDragEnd: () => void
  onDrop: (e: DragEvent, date: string, targetIndex: number) => void
  onDragOverTask: (e: DragEvent, task: Task) => void
}

export default function CalendarCell({
  day,
  tasks,
  holidays,
  searchQuery,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragOverTask,
}: Props) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (adding) inputRef.current?.focus()
  }, [adding])

  const handleAdd = () => {
    const trimmed = newTitle.trim()
    if (trimmed) {
      onAddTask(trimmed, day.date)
    }
    setNewTitle('')
    setAdding(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(e, day.date, tasks.length)
  }

  const query = searchQuery.toLowerCase()

  return (
    <Cell
      $isCurrentMonth={day.isCurrentMonth}
      $isToday={day.isToday}
      $isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DayNumber $isToday={day.isToday}>{day.dayNumber}</DayNumber>

      {holidays.map((h) => (
        <HolidayBadge key={h.name} title={h.name}>
          {h.localName}
        </HolidayBadge>
      ))}

      <TaskList>
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            dimmed={!!query && !task.title.toLowerCase().includes(query)}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOverTask}
          />
        ))}
      </TaskList>

      {adding ? (
        <InlineInput
          ref={inputRef}
          value={newTitle}
          placeholder="Task title..."
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleAdd}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd()
            if (e.key === 'Escape') {
              setNewTitle('')
              setAdding(false)
            }
          }}
        />
      ) : (
        <AddTaskArea onClick={() => setAdding(true)}>+ Add</AddTaskArea>
      )}
    </Cell>
  )
}
