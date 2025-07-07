import { DatabaseSync } from 'node:sqlite';
import path from 'path';


const dbPath = path.join(process.cwd(), 'database.db');

const db = new DatabaseSync(dbPath);

console.log('Connected to the SQLite database at:', dbPath);

process.on('SIGINT', () => {
    try {
        db.close();
        console.log('Database connection closed.');
    } catch (err) {
        console.error('Error closing database:', err);
    }
    process.exit(0);
});

export default db;
