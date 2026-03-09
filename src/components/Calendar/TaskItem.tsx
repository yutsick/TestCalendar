import { useState, useRef, useEffect, type DragEvent } from 'react'
import type { Task } from '../../types'
import { TaskItemWrapper, TaskTitle, TaskDeleteBtn, InlineInput } from './styles'

interface Props {
  task: Task
  dimmed: boolean
  onEdit: (id: string, title: string) => void
  onDelete: (id: string) => void
  onDragStart: (e: DragEvent, task: Task) => void
  onDragEnd: () => void
  onDragOver: (e: DragEvent, task: Task) => void
}

export default function TaskItem({
  task,
  dimmed,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    setTitle(task.title)
  }, [task.title])

  const save = () => {
    const trimmed = title.trim()
    if (trimmed && trimmed !== task.title) {
      onEdit(task._id, trimmed)
    } else {
      setTitle(task.title)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <InlineInput
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') {
            setTitle(task.title)
            setEditing(false)
          }
        }}
      />
    )
  }

  return (
    <TaskItemWrapper
      $color={task.color}
      $isDragging={false}
      $dimmed={dimmed}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, task)}
      onDoubleClick={() => setEditing(true)}
    >
      <TaskTitle>{task.title}</TaskTitle>
      <TaskDeleteBtn onClick={() => onDelete(task._id)}>×</TaskDeleteBtn>
    </TaskItemWrapper>
  )
}
