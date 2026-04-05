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
    <div style={{ maxWidth: '360px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#1a3a5c', marginBottom: '1.5rem' }}>{isRegister ? 'Create account' : 'Sign in'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {error && <p style={{ color: '#a32d2d', fontSize: '13px' }}>{error}</p>}
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <p style={{ marginTop: '1rem', fontSize: '13px', color: '#555', textAlign: 'center' }}>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#1a3a5c', cursor: 'pointer', fontWeight: 600 }}>
          {isRegister ? ' Sign in' : ' Register'}
        </button>
      </p>
    </div>
  );
}