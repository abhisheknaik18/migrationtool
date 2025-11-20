import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initializeDatabase() {
  // Users table for authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      company TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration jobs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS migration_jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_data TEXT NOT NULL,
      destination_config TEXT NOT NULL,
      mapping_config TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      total_records INTEGER DEFAULT 0,
      processed_records INTEGER DEFAULT 0,
      failed_records INTEGER DEFAULT 0,
      error_log TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Migration logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS migration_logs (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      record_index INTEGER NOT NULL,
      status TEXT NOT NULL,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES migration_jobs(id)
    )
  `);

  // NovaTab configurations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS novatab_configs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      config_name TEXT NOT NULL,
      api_endpoint TEXT NOT NULL,
      api_key TEXT NOT NULL,
      field_mappings TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('Database initialized successfully');
}

export default db;

