import express from 'express'
import initDatabase from './config/init.js'
import authRouter from './routes/auth.route.js'




const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const port = 3000

const startServer = async () => {
  try {
    await initDatabase()
    
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.use('/api/auth', authRouter)  
    app.listen(port, () => {
      console.log(`SecureShare server listening at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

startServer()
