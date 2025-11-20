import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '../db/database.js';

const router = Router();

const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
});

// Reset password endpoint (no auth required)
router.post('/reset-password', async (req: any, res: any) => {
  try {
    console.log('🔄 Password reset attempt:', req.body?.email);
    const { email, newPassword } = resetPasswordSchema.parse(req.body);

    // Find user
    const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      console.log('❌ User not found for password reset:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    console.log('🔐 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?')
      .run(hashedPassword, email);

    console.log('✅ Password reset successful:', email);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.issues);
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('❌ Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

export default router;

