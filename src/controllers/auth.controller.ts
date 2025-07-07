import { Request, Response } from 'express'
import { registerSchema, loginSchema } from '../validation/user.validation.js'
import { hashPassword, comparePassword } from '../utils/password.utils.js'
import db from '../config/database.js'
import jwt from 'jsonwebtoken'

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

export const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const result = loginSchema.safeParse(req.body)
        if (!result.success) {
            res.status(400).json({ error: result.error.message })
            return
        } else {
            const { email, password } = result.data

            const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
            if (!user) {
                res.status(400).json({ error: 'User not found' })
                return
            }


            const isPasswordValid = await comparePassword(password, user.password as string)
            if (!isPasswordValid) {
                res.status(400).json({ error: 'Invalid password' })
                return
            }


            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })

            res.status(200).json({ message: 'Login successful', data: { token } })
            return

        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' })
        return
    }
}