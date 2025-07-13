import { Router } from "express"
import { getUserFiles, getFileById, deleteFile } from "../controllers/file.controller.js"
import { authenticateToken } from '../middleware/auth.middleware.js'

const fileRouter = Router()

// Get all files for the current user
fileRouter.get('/files', authenticateToken, getUserFiles)

// Get a specific file by ID
fileRouter.get('/files/:id', authenticateToken, getFileById)

// Delete a file by ID
fileRouter.delete('/files/:id', authenticateToken, deleteFile)

export default fileRouter 