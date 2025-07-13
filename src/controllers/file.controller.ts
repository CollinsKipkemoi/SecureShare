import { Request, Response } from 'express'
import db from '../config/database.js'

interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    email: string
  }
}

export const getUserFiles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id
        if (!userId) {
            res.status(401).json({ 
                message: 'Authentication required',
                error: 'User not authenticated'
            })
            return
        }

        const stmt = db.prepare(`
            SELECT id, originalName, storedName, downloadLimit, currentDownloads, 
                   expiryAt, createdAt
            FROM files 
            WHERE userId = ?
            ORDER BY createdAt DESC
        `)
        
        const files = stmt.all(userId)

        const fileList = files.map(file => ({
            id: file.id,
            originalName: file.originalName,
            storedName: file.storedName,
            downloadLimit: file.downloadLimit,
            currentDownloads: file.currentDownloads,
            expiryAt: file.expiryAt,
            createdAt: file.createdAt,
            url: `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${file.storedName}`
        }))

        res.status(200).json({
            message: 'Files retrieved successfully',
            files: fileList
        })
    } catch (error) {
        console.error('Error retrieving files:', error)
        res.status(500).json({ 
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

export const getFileById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const fileId = parseInt(req.params.id)
        const userId = req.user?.id
        if (!userId) {
            res.status(401).json({ 
                message: 'Authentication required',
                error: 'User not authenticated'
            })
            return
        }

        const stmt = db.prepare(`
            SELECT id, originalName, storedName, downloadLimit, currentDownloads, 
                   expiryAt, createdAt
            FROM files 
            WHERE id = ? AND userId = ?
        `)
        
        const file = stmt.get(fileId, userId)

        if (!file) {
            res.status(404).json({ 
                message: 'File not found',
                error: 'The requested file does not exist or you do not have access to it'
            })
            return
        }

        const fileInfo = {
            id: file.id,
            originalName: file.originalName,
            storedName: file.storedName,
            downloadLimit: file.downloadLimit,
            currentDownloads: file.currentDownloads,
            expiryAt: file.expiryAt,
            createdAt: file.createdAt,
            url: `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${file.storedName}`
        }

        res.status(200).json({
            message: 'File retrieved successfully',
            file: fileInfo
        })
    } catch (error) {
        console.error('Error retrieving file:', error)
        res.status(500).json({ 
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

export const deleteFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const fileId = parseInt(req.params.id)
        const userId = req.user?.id
        if (!userId) {
            res.status(401).json({ 
                message: 'Authentication required',
                error: 'User not authenticated'
            })
            return
        }

        // First, get the file info to delete the physical file
        const getStmt = db.prepare(`
            SELECT storedName FROM files 
            WHERE id = ? AND userId = ?
        `)
        
        const file = getStmt.get(fileId, userId)

        if (!file) {
            res.status(404).json({ 
                message: 'File not found',
                error: 'The requested file does not exist or you do not have access to it'
            })
            return
        }

        // Delete from database
        const deleteStmt = db.prepare(`
            DELETE FROM files WHERE id = ? AND userId = ?
        `)
        
        const result = deleteStmt.run(fileId, userId)

        if (result.changes === 0) {
            res.status(404).json({ 
                message: 'File not found',
                error: 'The requested file does not exist or you do not have access to it'
            })
            return
        }

        // TODO: Delete physical file from uploads directory
        // This would require fs.unlink() but we need to handle errors properly

        res.status(200).json({
            message: 'File deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting file:', error)
        res.status(500).json({ 
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
} 