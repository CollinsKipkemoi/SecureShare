import db from "./database.js";

const initDatabase = async (): Promise<void> => {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created/verified successfully🎉");

    db.exec(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        originalName TEXT NOT NULL,
        storedName TEXT NOT NULL,
        downloadLimit INTEGER,
        currentDownloads INTEGER DEFAULT 0,
        expiryAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `);
    console.log("Files table created/verified successfully🎉");
    console.log("Database initialized successfully!🎉");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export default initDatabase;  
