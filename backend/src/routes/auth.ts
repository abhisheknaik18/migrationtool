import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import passwordResetRouter from './password-reset.js';

const router = Router();

// Include password reset routes
router.use(passwordResetRouter);

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  company: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register endpoint
router.post('/register', async (req: any, res: any) => {
  try {
    console.log('📝 Registration attempt:', req.body?.email);
    const { email, password, fullName, company } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    console.log('💾 Creating user in database...');
    db.prepare(`
      INSERT INTO users (id, email, password, full_name, company)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, email, hashedPassword, fullName, company || null);

    // Generate JWT
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    console.log('✅ Registration successful:', email);
    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        fullName,
        company,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.issues);
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('❌ Registration error:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack');
    res.status(500).json({ error: 'Registration failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Login endpoint
router.post('/login', async (req: any, res: any) => {
  try {
    console.log('🔐 Login attempt:', req.body?.email);
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    console.log('🔍 Looking up user in database...');
    const user = db.prepare(`
      SELECT id, email, password, full_name, company
      FROM users WHERE email = ?
    `).get(email) as any;

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ User found:', email);
    console.log('🔐 Verifying password...');
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('❌ Password verification failed');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Password verified');
    console.log('🎫 Generating JWT token...');
    
    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    console.log('✅ Login successful:', email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        company: user.company,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.issues);
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('❌ Login error:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack');
    res.status(500).json({ error: 'Login failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get current user
router.get('/me', authMiddleware, (req: AuthRequest, res: any) => {
  try {
    const user = db.prepare(`
      SELECT id, email, full_name, company, created_at
      FROM users WHERE id = ?
    `).get(req.userId!) as any;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      company: user.company,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;

