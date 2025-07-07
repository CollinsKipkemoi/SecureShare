

import { Request, Response } from 'express'
import { registerSchema } from '../validation/user.validation.js'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = registerSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: result.error.message })
      return
    } else {
      const { email, password } = result.data
      console.log(`email: ${email}, password: ${password}`) 
      res.status(200).json({ message: 'User registered successfully', data: result.data })
      return
    }
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
    return
  }
}