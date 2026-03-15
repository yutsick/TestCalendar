import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import taskRoutes from './routes/tasks.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/api/tasks', taskRoutes)

// Serve frontend static files
const clientDist = path.join(__dirname, '../../dist')
app.use(express.static(clientDist))
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/test-calendar')
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
