import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
  title: string
  date: string
  order: number
  color: string
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true, index: true },
    order: { type: Number, required: true, default: 0 },
    color: { type: String, default: '#4a90d9' },
  },
  { timestamps: true }
)

TaskSchema.index({ date: 1, order: 1 })

export default mongoose.model<ITask>('Task', TaskSchema)
