// Quick test script to diagnose registration issue
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

console.log('Testing registration components...\n');

// Test 1: Database connection
try {
  const db = new Database('./database.sqlite');
  console.log('✅ Database connection: OK');
  
  // Test 2: Check if users table exists
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").all();
  console.log('✅ Users table exists:', tables.length > 0);
  
  // Test 3: Try bcrypt
  const testPassword = 'test123';
  const hashedPassword = await bcrypt.hash(testPassword, 10);
  console.log('✅ Bcrypt hashing: OK');
  
  // Test 4: Try inserting a user
  const userId = uuidv4();
  const testEmail = `test-${Date.now()}@example.com`;
  
  try {
    db.prepare(`
      INSERT INTO users (id, email, password, full_name, company)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, testEmail, hashedPassword, 'Test User', null);
    console.log('✅ Database insert: OK');
    
    // Clean up test user
    db.prepare('DELETE FROM users WHERE email = ?').run(testEmail);
    console.log('✅ Database delete: OK');
    
    console.log('\n✅ All tests passed! Registration should work.');
  } catch (err) {
    console.error('❌ Database operation failed:', err.message);
  }
  
  db.close();
} catch (err) {
  console.error('❌ Test failed:', err.message);
  console.error('Full error:', err);
}

