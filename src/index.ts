import express from 'express'
import initDatabase from './config/init.js'

const app = express()
const port = 3000

const startServer = async () => {
  try {
    await initDatabase()
    
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    app.listen(port, () => {
      console.log(`SecureShare server listening at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

startServer()
