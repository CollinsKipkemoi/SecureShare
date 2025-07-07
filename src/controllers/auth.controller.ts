import { Request, Response } from 'express'
import { registerSchema } from '../validation/user.validation.js'
import { hashPassword } from '../utils/password.utils.js'
import db from '../config/database.js'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = registerSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: result.error.message })
      return
    } else {
      const { email, password } = result.data

      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
      if (user) {
        res.status(400).json({ error: 'User already exists' })
        return
      }

      const hashedPassword = await hashPassword(password)

      // insert
      const insertUser = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
      insertUser.run(email, hashedPassword)

      res.status(200).json({ message: 'User registered successfully', data: result.data })
      return
    }
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
    return
  }
}