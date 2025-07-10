import express from 'express'
import path from 'path'
import initDatabase from './config/init.js'
import authRouter from './routes/auth.route.js'
import uploadRouter from './routes/upload.route.js'
import dotenv from 'dotenv'
dotenv.config()




const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))
const port = 3000

const startServer = async () => {
  try {
    await initDatabase()
    
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    // Serve the upload test page
    app.get('/test-upload', (req, res) => {
      res.sendFile(path.resolve('test-upload.html'))
    })

    app.use('/api/auth', authRouter)  
    app.use('/api/upload', uploadRouter)
    app.listen(port, () => {
      console.log(`SecureShare server listening at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

startServer()
