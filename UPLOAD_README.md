# SecureShare File Upload Documentation

This document explains how to use the file upload functionality in SecureShare, which is implemented using Multer middleware.

## Features

- **Single File Upload**: Upload one file at a time
- **File Type Validation**: Only allows JPEG, PNG, GIF, PDF, and text files
- **File Size Limit**: Maximum 5MB per file
- **Unique Filenames**: Prevents filename conflicts with timestamps
- **Static File Serving**: Uploaded files are accessible via URLs

## API Endpoints

### POST `/api/upload/upload`

Upload a single file.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `file`

**Example using curl:**
```bash
curl -X POST -F "file=@/path/to/your/file.jpg" http://localhost:3000/api/upload/upload
```

**Example using JavaScript:**
```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])

fetch('/api/upload/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "originalName": "photo.jpg",
    "filename": "file-1703123456789-123456789.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000,
    "url": "http://localhost:3000/uploads/file-1703123456789-123456789.jpg",
    "uploadedAt": "2023-12-21T10:30:45.123Z"
  }
}
```

## Error Handling

The API returns appropriate error messages for various scenarios:

- **No file uploaded**: `400 Bad Request`
- **Invalid file type**: `400 Bad Request`
- **File too large**: `400 Bad Request` (over 5MB)
- **Server error**: `500 Internal Server Error`

## File Storage

- Files are stored in the `uploads/` directory
- Filenames include timestamps to prevent conflicts
- Files are served statically at `/uploads/` URL path

## Testing

1. Start the server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/test-upload` to test file uploads

3. Or use the API directly with tools like Postman, curl, or your frontend application

## Configuration

The multer configuration is in `src/middleware/multer.config.ts`:

- **Storage**: Disk storage with custom filename generation
- **File Filter**: Only allows specific MIME types
- **Limits**: 5MB file size, 1 file per request
- **Destination**: `uploads/` directory

## Security Considerations

- File type validation prevents malicious uploads
- File size limits prevent abuse
- Unique filenames prevent overwrites
- Uploaded files are in a separate directory

## Future Enhancements

- Multiple file upload support
- Cloud storage integration (AWS S3, etc.)
- Image resizing and optimization
- Virus scanning
- User-specific upload directories 