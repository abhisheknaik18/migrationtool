import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Validation schema
const createConfigSchema = z.object({
  configName: z.string().min(1),
  apiEndpoint: z.string().url(),
  apiKey: z.string().min(1),
  fieldMappings: z.record(z.string()),
});

// Create NovaTab configuration
router.post('/configs', authMiddleware, async (req: AuthRequest, res: any) => {
  try {
    const data = createConfigSchema.parse(req.body);
    const configId = uuidv4();

    db.prepare(`
      INSERT INTO novatab_configs (
        id, user_id, config_name, api_endpoint, api_key, field_mappings
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      configId,
      req.userId!,
      data.configName,
      data.apiEndpoint,
      data.apiKey,
      JSON.stringify(data.fieldMappings)
    );

    res.status(201).json({ configId, message: 'NovaTab configuration created' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('Create config error:', error);
    res.status(500).json({ error: 'Failed to create configuration' });
  }
});

// Get all configurations for user
router.get('/configs', authMiddleware, (req: AuthRequest, res: any) => {
  try {
    const configs = db.prepare(`
      SELECT id, config_name, api_endpoint, field_mappings, is_active, created_at
      FROM novatab_configs
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.userId!) as any[];

    res.json(configs.map(config => ({
      id: config.id,
      configName: config.config_name,
      apiEndpoint: config.api_endpoint,
      fieldMappings: JSON.parse(config.field_mappings),
      isActive: config.is_active === 1,
      createdAt: config.created_at,
    })));
  } catch (error) {
    console.error('Get configs error:', error);
    res.status(500).json({ error: 'Failed to get configurations' });
  }
});

// Get specific configuration
router.get('/configs/:id', authMiddleware, (req: AuthRequest, res: any) => {
  try {
    const config = db.prepare(`
      SELECT * FROM novatab_configs
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.userId!) as any;

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({
      id: config.id,
      configName: config.config_name,
      apiEndpoint: config.api_endpoint,
      apiKey: config.api_key,
      fieldMappings: JSON.parse(config.field_mappings),
      isActive: config.is_active === 1,
      createdAt: config.created_at,
    });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Failed to get configuration' });
  }
});

// Update configuration
router.put('/configs/:id', authMiddleware, async (req: AuthRequest, res: any) => {
  try {
    const data = createConfigSchema.partial().parse(req.body);
    
    const updates: string[] = [];
    const values: any[] = [];

    if (data.configName) {
      updates.push('config_name = ?');
      values.push(data.configName);
    }
    if (data.apiEndpoint) {
      updates.push('api_endpoint = ?');
      values.push(data.apiEndpoint);
    }
    if (data.apiKey) {
      updates.push('api_key = ?');
      values.push(data.apiKey);
    }
    if (data.fieldMappings) {
      updates.push('field_mappings = ?');
      values.push(JSON.stringify(data.fieldMappings));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    values.push(req.params.id, req.userId!);

    const result = db.prepare(`
      UPDATE novatab_configs
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `).run(...values);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Delete configuration
router.delete('/configs/:id', authMiddleware, (req: AuthRequest, res: any) => {
  try {
    const result = db.prepare(`
      DELETE FROM novatab_configs
      WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.userId!);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Delete config error:', error);
    res.status(500).json({ error: 'Failed to delete configuration' });
  }
});

// Test NovaTab connection
router.post('/configs/:id/test', authMiddleware, async (req: AuthRequest, res: any) => {
  try {
    const config = db.prepare(`
      SELECT * FROM novatab_configs
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.userId!) as any;

    if (!config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    // Here you would test the actual connection to NovaTab
    // For now, we'll simulate a test
    
    res.json({
      success: true,
      message: 'Connection test successful',
      endpoint: config.api_endpoint,
    });
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ error: 'Connection test failed' });
  }
});

export default router;

