import { useState } from 'react';
import { X, Mail, Check } from 'lucide-react';
import axios from 'axios';

interface ResetPasswordProps {
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function ResetPassword({ onClose }: ResetPasswordProps) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2>Reset Password</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {success ? (
            <div className="success-state">
              <Check size={64} color="#48bb78" />
              <h3>Password Reset Successfully!</h3>
              <p>You can now login with your new password.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="link-button"
                  style={{ fontSize: '0.9rem' }}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

