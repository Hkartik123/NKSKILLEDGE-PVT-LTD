import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('nksk_token', data.token);
        localStorage.setItem('nksk_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.message || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      setError('Unable to contact authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-box glass-panel">
        <div className="login-header">
          <img src="/nkskilledge-logo.png" alt="NKSKILLEDGE logo" className="login-brand-logo" />
          <h2>Staff & Admin Portal</h2>
          <p>NKSKILLEDGE Pvt. Ltd. Centralized CMS & Lead Pipeline</p>
        </div>

        {error && (
          <div className="login-error-pill">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                required 
                autoComplete="off"
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input 
                type="password" 
                required 
                autoComplete="new-password"
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      <style>{`
        .admin-login-overlay {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .admin-login-box {
          max-width: 440px;
          width: 100%;
          padding: 40px;
          border-radius: var(--radius-xl);
          background: rgba(16, 42, 86, 0.96);
          box-shadow: var(--shadow-lg), 0 0 35px rgba(22, 119, 255, 0.15);
        }
        .login-header {
          text-align: center;
          margin-bottom: 28px;
        }
        .login-brand-logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          padding: 4px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: var(--shadow-md);
          margin: 0 auto 16px;
        }
        .login-header h2 {
          font-size: 1.5rem;
          margin-bottom: 6px;
        }
        .login-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .input-icon-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-icon-wrap .form-input {
          padding-left: 42px;
        }
        .login-error-pill {
          background: rgba(244, 63, 94, 0.12);
          border: 1px solid rgba(244, 63, 94, 0.3);
          color: #fca5a5;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .default-creds-hint {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 14px;
        }
        .default-creds-hint code {
          color: var(--primary-hover);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
