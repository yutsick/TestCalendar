import axios from 'axios'
import type { Task } from '../types'

const api = axios.create({ baseURL: '/api/tasks' })

export async function fetchTasks(start: string, end: string): Promise<Task[]> {
  const { data } = await api.get('/', { params: { start, end } })
  return data
}

export async function createTask(
  title: string,
  date: string,
  color?: string
): Promise<Task> {
  const { data } = await api.post('/', { title, date, color })
  return data
}

export async function updateTask(
  id: string,
  updates: Partial<Pick<Task, 'title' | 'date' | 'order' | 'color'>>
): Promise<Task> {
  const { data } = await api.put(`/${id}`, updates)
  return data
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/${id}`)
}

export async function reorderTasks(
  tasks: { id: string; date: string; order: number }[]
): Promise<void> {
  await api.put('/reorder/batch', { tasks })
}
