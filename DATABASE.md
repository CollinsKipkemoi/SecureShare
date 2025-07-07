# Database Setup for SecureShare

## Overview
SecureShare uses SQLite as its database, which is stored locally as `database.db`.

## Initial Setup

### 1. Initialize Database
```bash
pnpm run init-db
```
This creates the database file and sets up the required tables.

### 2. View Database Contents
```bash
pnpm run view-db
```
Shows all tables, data, and schema information.

## Database Schema

### Users Table
- `id` - Primary key (auto-increment)
- `email` - User email (unique)
- `password` - Hashed password
- `createdAt` - Timestamp

### Files Table
- `id` - Primary key (auto-increment)
- `userId` - Foreign key to users table
- `originalName` - Original filename
- `storedName` - Stored filename
- `downloadLimit` - Maximum downloads allowed
- `currentDownloads` - Current download count
- `expiryAt` - Expiration timestamp
- `createdAt` - Timestamp

## Important Notes

### Git Ignore
The `database.db` file is ignored by git for security and performance reasons:
- Contains sensitive user data
- Can grow large over time
- Each developer should have their own local database

### Development Workflow
1. Clone the repository
2. Run `pnpm run init-db` to create your local database
3. Start development with `pnpm run dev`
4. Use `pnpm run view-db` to inspect data

### Production Considerations
- Consider using PostgreSQL or MySQL for production
- Implement proper database migrations
- Set up automated backups
- Use environment variables for database configuration

## Troubleshooting

### Database Locked
If you get a "database is locked" error:
1. Stop the application (`Ctrl+C`)
2. Wait a few seconds
3. Try again

### Database Not Found
If the database doesn't exist:
```bash
pnpm run init-db
```

### Permission Issues
Make sure the application has write permissions in the project directory. 