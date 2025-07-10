import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'

interface MulterRequest extends Request {
  file?: Express.Multer.File
}

export const uploadFile = async (req: MulterRequest, res: Response): Promise<void> => {
    try {
        const file = req.file
        
        if (!file) {
            res.status(400).json({ 
                message: 'No file uploaded',
                error: 'Please select a file to upload'
            })
            return
        }

        // Create response with file details
        const fileInfo = {
            originalName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            url: `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${file.filename}`,
            uploadedAt: new Date().toISOString()
        }

        res.status(200).json({
            message: 'File uploaded successfully',
            file: fileInfo
        })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ 
            message: 'Internal server error during file upload',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

// Optional: Function to handle multiple file uploads
export const uploadMultipleFiles = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[]
        
        if (!files || files.length === 0) {
            res.status(400).json({ 
                message: 'No files uploaded',
                error: 'Please select files to upload'
            })
            return
        }

        const fileInfos = files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            url: `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${file.filename}`,
            uploadedAt: new Date().toISOString()
        }))

        res.status(200).json({
            message: `${files.length} file(s) uploaded successfully`,
            files: fileInfos
        })
    } catch (error) {
        console.error('Multiple upload error:', error)
        res.status(500).json({ 
            message: 'Internal server error during file upload',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}