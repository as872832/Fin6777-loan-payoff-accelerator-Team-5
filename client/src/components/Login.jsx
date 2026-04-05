import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      isRegister
        ? await register(form.email, form.password)
        : await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#fff', border: '0.5px solid #d3d1c7', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '380px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <div style={{ width: '36px', height: '36px', background: '#1a3a5c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: '18px', height: '18px', border: '2.5px solid #fff', borderRadius: '50%' }}></div>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a3a5c' }}>Loan Payoff Accelerator</div>
            <div style={{ fontSize: '12px', color: '#888780' }}>FIN 6777 · Team 5</div>
          </div>
        </div>

        <div style={{ fontSize: '18px', fontWeight: 600, color: '#2c2c2a', marginBottom: '1.25rem' }}>
          {isRegister ? 'Create an account' : 'Welcome back'}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#5f5e5a', display: 'block', marginBottom: '4px' }}>Email</label>
            <input
              type="email" placeholder="you@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #d3d1c7', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#5f5e5a', display: 'block', marginBottom: '4px' }}>Password</label>
            <input
              type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #d3d1c7', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {error && <div style={{ fontSize: '13px', color: '#a32d2d', background: '#fcebeb', padding: '8px 12px', borderRadius: '6px' }}>{error}</div>}
          <button type="submit" style={{ marginTop: '4px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            {isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', fontSize: '13px', color: '#888780', textAlign: 'center' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#1a3a5c', cursor: 'pointer', fontWeight: 600, fontSize: '13px', marginLeft: '4px' }}>
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}