import { Router, Request, Response } from 'express'
import Task from '../models/Task.js'

const router = Router()

// GET tasks for a date range
router.get('/', async (req: Request, res: Response) => {
  const { start, end } = req.query
  if (!start || !end) {
    res.status(400).json({ error: 'start and end query params required' })
    return
  }
  const tasks = await Task.find({
    date: { $gte: start as string, $lte: end as string },
  }).sort({ date: 1, order: 1 })
  res.json(tasks)
})

// POST create task
router.post('/', async (req: Request, res: Response) => {
  const { title, date, color } = req.body
  const maxOrder = await Task.findOne({ date }).sort({ order: -1 })
  const order = maxOrder ? maxOrder.order + 1 : 0
  const task = await Task.create({ title, date, order, color })
  res.status(201).json(task)
})

// PUT update task
router.put('/:id', async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json(task)
})

// PUT reorder tasks
router.put('/reorder/batch', async (req: Request, res: Response) => {
  const { tasks } = req.body as {
    tasks: { id: string; date: string; order: number }[]
  }
  const ops = tasks.map((t) => ({
    updateOne: {
      filter: { _id: t.id },
      update: { $set: { date: t.date, order: t.order } },
    },
  }))
  await Task.bulkWrite(ops)
  res.json({ ok: true })
})

// DELETE task
router.delete('/:id', async (req: Request, res: Response) => {
  const task = await Task.findByIdAndDelete(req.params.id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  res.json({ ok: true })
})

export default router
