import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { migrationApi } from '../lib/api';
import type { MigrationJob } from '../types';
import {
  LogOut,
  Plus,
  Database,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Trash2,
  Settings,
} from 'lucide-react';
import NewMigration from './NewMigration';
import NovaTabSettings from './NovaTabSettings';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [jobs, setJobs] = useState<MigrationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewMigration, setShowNewMigration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await migrationApi.getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteJob = async (id: string) => {
    if (!confirm('Are you sure you want to execute this migration?')) return;

    try {
      await migrationApi.executeJob(id);
      await loadJobs();
      alert('Migration completed successfully!');
    } catch (error) {
      console.error('Failed to execute job:', error);
      alert('Migration failed. Please check the logs.');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await migrationApi.deleteJob(id);
      await loadJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="status-icon success" />;
      case 'processing':
        return <Clock className="status-icon processing" />;
      case 'failed':
        return <AlertCircle className="status-icon error" />;
      default:
        return <Clock className="status-icon pending" />;
    }
  };

  if (showNewMigration) {
    return (
      <NewMigration
        onClose={() => setShowNewMigration(false)}
        onSuccess={() => {
          setShowNewMigration(false);
          loadJobs();
        }}
      />
    );
  }

  if (showSettings) {
    return <NovaTabSettings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <Database size={32} />
          <div>
            <h1>Data Migration</h1>
            <p>Welcome back, {user?.fullName}</p>
          </div>
        </div>
        <div className="header-right">
          <button onClick={() => setShowSettings(true)} className="btn-secondary">
            <Settings size={20} />
            NovaTab Settings
          </button>
          <button onClick={logout} className="btn-secondary">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="content-header">
          <h2>Migration Jobs</h2>
          <button onClick={() => setShowNewMigration(true)} className="btn-primary">
            <Plus size={20} />
            New Migration
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading migrations...</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <Database size={64} />
            <h3>No migrations yet</h3>
            <p>Create your first data migration to get started</p>
            <button onClick={() => setShowNewMigration(true)} className="btn-primary">
              <Plus size={20} />
              Create Migration
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-title">
                    <h3>{job.name}</h3>
                    <span className="job-type">{job.sourceType}</span>
                  </div>
                  <div className="job-status">
                    {getStatusIcon(job.status)}
                    <span>{job.status}</span>
                  </div>
                </div>

                <div className="job-stats">
                  <div className="stat">
                    <span className="stat-label">Total Records</span>
                    <span className="stat-value">{job.totalRecords}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Processed</span>
                    <span className="stat-value success">{job.processedRecords}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Failed</span>
                    <span className="stat-value error">{job.failedRecords}</span>
                  </div>
                </div>

                <div className="job-footer">
                  <span className="job-date">
                    Created: {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <div className="job-actions">
                    {job.status === 'pending' && (
                      <button
                        onClick={() => handleExecuteJob(job.id)}
                        className="btn-icon success"
                        title="Execute"
                      >
                        <Play size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="btn-icon error"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

