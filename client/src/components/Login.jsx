import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const T = {
  navy: '#0f2340', navyMid: '#1a3a5c',
  gold: '#c9a84c', goldLight: '#e8c97a', goldPale: '#fdf3dc',
  white: '#ffffff', slate: '#4a5568', muted: '#8896a8',
  danger: '#922b21', dangerBg: '#fadbd8',
};

export default function Login() {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      isRegister ? await register(form.email, form.password) : await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', fontFamily: "'DM Sans', sans-serif",
      background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 60%, #1e4d7a 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      position: 'relative', overflow: 'hidden'
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(201,168,76,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(201,168,76,0.04)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px', margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: '24px', height: '24px', border: '3px solid #fff', borderRadius: '50%' }} />
          </div>
          <div style={{ fontSize: '26px', fontFamily: 'DM Serif Display, serif', color: T.white, marginBottom: '6px' }}>Loan Payoff Accelerator</div>
          <div style={{ fontSize: '13px', color: T.gold, opacity: 0.8 }}>FIN 6777 · Team 5</div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '2rem',
          border: '1px solid rgba(201,168,76,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '20px', fontFamily: 'DM Serif Display, serif', color: T.navy, marginBottom: '1.5rem' }}>
            {isRegister ? 'Create an account' : 'Welcome back'}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: T.slate, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
              <input type="email" placeholder="you@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: T.slate, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
            </div>
            {error && <div style={{ fontSize: '13px', color: T.danger, background: T.dangerBg, padding: '10px 14px', borderRadius: '8px' }}>{error}</div>}
            <button type="submit" style={{
              marginTop: '4px', padding: '12px',
              background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
              color: T.white, border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'opacity 0.15s'
            }}>{isRegister ? 'Create account' : 'Sign in'}</button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '13px', color: T.slate }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsRegister(!isRegister)} style={{
              background: 'none', border: 'none', color: T.navyMid,
              fontWeight: 600, fontSize: '13px', cursor: 'pointer', marginLeft: '5px',
              fontFamily: 'DM Sans, sans-serif'
            }}>{isRegister ? 'Sign in' : 'Register'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}