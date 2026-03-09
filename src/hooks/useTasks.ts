import { useState, useEffect, useCallback } from 'react'
import type { Task } from '../types'
import * as api from '../api/tasks'

export function useTasks(start: string, end: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.fetchTasks(start, end)
      setTasks(data)
    } catch (err) {
      console.error('Failed to load tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [start, end])

  useEffect(() => {
    load()
  }, [load])

  const addTask = useCallback(
    async (title: string, date: string, color?: string) => {
      const task = await api.createTask(title, date, color)
      setTasks((prev) => [...prev, task])
      return task
    },
    []
  )

  const editTask = useCallback(
    async (
      id: string,
      updates: Partial<Pick<Task, 'title' | 'date' | 'order' | 'color'>>
    ) => {
      const updated = await api.updateTask(id, updates)
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)))
      return updated
    },
    []
  )

  const removeTask = useCallback(async (id: string) => {
    await api.deleteTask(id)
    setTasks((prev) => prev.filter((t) => t._id !== id))
  }, [])

  const reorderTasks = useCallback(
    async (updates: { id: string; date: string; order: number }[]) => {
      // Optimistic update
      setTasks((prev) => {
        const map = new Map(updates.map((u) => [u.id, u]))
        return prev
          .map((t) => {
            const upd = map.get(t._id)
            if (upd) return { ...t, date: upd.date, order: upd.order }
            return t
          })
          .sort((a, b) => a.order - b.order)
      })
      await api.reorderTasks(updates)
    },
    []
  )

  const getTasksForDate = useCallback(
    (date: string) =>
      tasks.filter((t) => t.date === date).sort((a, b) => a.order - b.order),
    [tasks]
  )

  return {
    tasks,
    loading,
    addTask,
    editTask,
    removeTask,
    reorderTasks,
    getTasksForDate,
    reload: load,
  }
}
