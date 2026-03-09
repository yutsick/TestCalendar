import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import taskRoutes from './routes/tasks.js'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())
app.use('/api/tasks', taskRoutes)

mongoose
  .connect('mongodb://127.0.0.1:27017/test-calendar')
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
