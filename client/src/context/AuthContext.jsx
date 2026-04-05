import { createContext, useContext, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));

  async function login(email, password) {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('email', res.data.email);
    setToken(res.data.token);
    setEmail(res.data.email);
  }

  async function register(email, password) {
    const res = await api.post('/api/auth/register', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('email', res.data.email);
    setToken(res.data.token);
    setEmail(res.data.email);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, email, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}