import { Router } from "express"
import { uploadFile } from "../controllers/upload.controller.js"
import upload from '../middleware/multer.config.js'
import multer from 'multer'

const uploadRouter = Router()

uploadRouter.post('/upload', upload.single('file'), uploadFile)

// uploadRouter.post('/upload-multiple', upload.array('files', 5), uploadMultipleFiles)

// Handle multer errors
uploadRouter.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 1 file.' })
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected field name.' })
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ message: error.message })
  }
  
  next(error)
})

export default uploadRouter