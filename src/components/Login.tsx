import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LogIn } from 'lucide-react';
import ResetPassword from './ResetPassword';

interface LoginProps {
  onToggleMode: () => void;
}

export default function Login({ onToggleMode }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showReset, setShowReset] = useState(false);
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled by store
    }
  };

  if (showReset) {
    return <ResetPassword onClose={() => setShowReset(false)} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LogIn size={48} className="auth-icon" />
          <h1>Welcome Back</h1>
          <p>Sign in to your migration account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="link-button"
                style={{ fontSize: '0.875rem', color: '#667eea' }}
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={onToggleMode} className="link-button">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

