// Quick password reset utility
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const db = new Database('./database.sqlite');

console.log('\n🔐 Password Reset Utility\n');

rl.question('Enter email: ', async (email) => {
  const user = db.prepare('SELECT id, email, full_name FROM users WHERE email = ?').get(email);
  
  if (!user) {
    console.log('❌ User not found!');
    db.close();
    rl.close();
    return;
  }
  
  console.log(`✅ Found user: ${user.full_name} (${user.email})`);
  
  rl.question('Enter new password: ', async (password) => {
    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      db.close();
      rl.close();
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashedPassword, email);
    
    console.log('✅ Password updated successfully!');
    console.log('\nYou can now login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    db.close();
    rl.close();
  });
});

