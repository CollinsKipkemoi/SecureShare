import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'


interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    email: string
  }
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    res.status(401).json({ 
      message: 'Access token required',
      error: 'No authorization token provided'
    })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number }
    
    // Get user details from database
    const db = (await import('../config/database.js')).default
    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(decoded.id)
    
    if (!user) {
      res.status(401).json({ 
        message: 'Invalid token',
        error: 'User not found'
      })
      return
    }

    req.user = {
      id: user.id as number,
      email: user.email as string
    }
    
    next()
  } catch (error) {
    res.status(403).json({ 
      message: 'Invalid token',
      error: 'Token is invalid or expired'
    })
  }
}   