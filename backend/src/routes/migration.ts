import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Validation schema
const createMigrationSchema = z.object({
  name: z.string().min(1),
  sourceType: z.string(),
  sourceData: z.array(z.record(z.any())),
  destinationConfig: z.object({
    type: z.string(),
    endpoint: z.string().optional(),
    apiKey: z.string().optional(),
  }),
  mappingConfig: z.record(z.string()),
});

// Create migration job
router.post('/jobs', authMiddleware, async (req: AuthRequest, res: any) => {
  try {
    const data = createMigrationSchema.parse(req.body);
    const jobId = uuidv4();

    db.prepare(`
      INSERT INTO migration_jobs (
        id, user_id, name, source_type, source_data,
        destination_config, mapping_config, total_records
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      jobId,
      req.userId!,
      data.name,
      data.sourceType,
      JSON.stringify(data.sourceData),
      JSON.stringify(data.destinationConfig),
      JSON.stringify(data.mappingConfig),
      data.sourceData.length
    );

    res.status(201).json({ jobId, message: 'Migration job created' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.issues });
    }
    console.error('Create migration error:', error);
    res.status(500).json({ error: 'Failed to create migration job' });
  }
});

// Get all migration jobs for user
router.get('/jobs', authMiddleware, (req: AuthRequest, res: any) => {
  try {
    const jobs = db.prepare(`
      SELECT id, name, source_type, status, total_records,
             processed_records, failed_records, created_at, completed_at
      FROM migration_jobs
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.userId!) as any[];

    res.json(jobs.map(job => ({
      id: job.id,
      name: job.name,
      sourceType: job.source_type,
      status: job.status,
      totalRecords: job.total_records,
      processedRecords: job.processed_records,
      failedRecords: job.failed_records,
      createdAt: job.created_at,
      completedAt: job.completed_at,
    })));
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to get migration jobs' });
  }
});

// Get specific migration job
router.get('/jobs/:id', authMiddleware, (req: AuthRequest, res: any) => {
  try {
    const job = db.prepare(`
      SELECT * FROM migration_jobs
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.userId!) as any;

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      id: job.id,
      name: job.name,
      sourceType: job.source_type,
      sourceData: JSON.parse(job.source_data),
      destinationConfig: JSON.parse(job.destination_config),
      mappingConfig: JSON.parse(job.mapping_config),
      status: job.status,
      totalRecords: job.total_records,
      processedRecords: job.processed_records,
      failedRecords: job.failed_records,
      errorLog: job.error_log,
      createdAt: job.created_at,
      completedAt: job.completed_at,
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to get migration job' });
  }
});

// Execute migration job
router.post('/jobs/:id/execute', authMiddleware, async (req: AuthRequest, res: any) => {
  try {
    const job = db.prepare(`
      SELECT * FROM migration_jobs
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.userId!) as any;

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === 'completed') {
      return res.status(400).json({ error: 'Job already completed' });
    }

    // Update status to processing
    db.prepare(`
      UPDATE migration_jobs
      SET status = 'processing'
      WHERE id = ?
    `).run(job.id);

    // Parse data
    const sourceData = JSON.parse(job.source_data);
    const destinationConfig = JSON.parse(job.destination_config);
    const mappingConfig = JSON.parse(job.mapping_config);

    // Process migration (this is a simplified version)
    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < sourceData.length; i++) {
      try {
        const record = sourceData[i];
        const mappedData: any = {};

        // Apply mapping
        for (const [sourceField, destField] of Object.entries(mappingConfig)) {
          mappedData[destField as string] = record[sourceField];
        }

        // Here you would send to destination (NovaTab API)
        // For now, we'll just simulate success
        
        // Log success
        db.prepare(`
          INSERT INTO migration_logs (id, job_id, record_index, status)
          VALUES (?, ?, ?, 'success')
        `).run(uuidv4(), job.id, i);

        processed++;
      } catch (error: any) {
        failed++;
        errors.push(`Record ${i}: ${error.message}`);
        
        // Log error
        db.prepare(`
          INSERT INTO migration_logs (id, job_id, record_index, status, error_message)
          VALUES (?, ?, ?, 'failed', ?)
        `).run(uuidv4(), job.id, i, error.message);
      }
    }

    // Update job status
    db.prepare(`
      UPDATE migration_jobs
      SET status = 'completed',
          processed_records = ?,
          failed_records = ?,
          error_log = ?,
          completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(processed, failed, JSON.stringify(errors), job.id);

    res.json({
      message: 'Migration completed',
      processed,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Execute migration error:', error);
    
    // Update job status to failed
    db.prepare(`
      UPDATE migration_jobs
      SET status = 'failed',
          error_log = ?
      WHERE id = ?
    `).run(JSON.stringify([error instanceof Error ? error.message : 'Unknown error']), req.params.id);

    res.status(500).json({ error: 'Migration execution failed' });
  }
});

// Delete migration job
router.delete('/jobs/:id', authMiddleware, (req: AuthRequest, res: any) => {
  try {
    const result = db.prepare(`
      DELETE FROM migration_jobs
      WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.userId!);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;

