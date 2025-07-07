import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.db');

console.log('🔍 SecureShare Database Viewer');
console.log('==============================\n');

try {
  const db = new DatabaseSync(dbPath);
  
  // View users table
  console.log('👥 USERS TABLE:');
  console.log('================');
  const users = db.prepare('SELECT * FROM users').all();
  if (users.length === 0) {
    console.log('No users found in database.');
  } else {
    console.table(users);
  }
  console.log('');
  
  // View files table
  console.log('📁 FILES TABLE:');
  console.log('===============');
  const files = db.prepare('SELECT * FROM files').all();
  if (files.length === 0) {
    console.log('No files found in database.');
  } else {
    console.table(files);
  }
  console.log('');
  
  // Show table schemas
  console.log('🏗️  TABLE SCHEMAS:');
  console.log('==================');
  
  const usersSchema = db.prepare("PRAGMA table_info(users)").all();
  console.log('Users table structure:');
  console.table(usersSchema.map((col: any) => ({
    column: col.name,
    type: col.type,
    notNull: col.notnull ? 'YES' : 'NO',
    primaryKey: col.pk ? 'YES' : 'NO'
  })));
  console.log('');
  
  const filesSchema = db.prepare("PRAGMA table_info(files)").all();
  console.log('Files table structure:');
  console.table(filesSchema.map((col: any) => ({
    column: col.name,
    type: col.type,
    notNull: col.notnull ? 'YES' : 'NO',
    primaryKey: col.pk ? 'YES' : 'NO'
  })));
  
  db.close();
  console.log('\n✅ Database viewer completed successfully!');
  
} catch (error) {
  console.error('❌ Error viewing database:', error);
  process.exit(1);
} 