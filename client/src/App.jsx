import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import DebtForm from './components/DebtForm';
import StrategyPicker from './components/StrategyPicker';
import WhatIfSimulator from './components/WhatIfSimulator';
import PayoffChart from './components/PayoffChart';
import { calcPayoff, calcWhatIf } from './utils/calcEngine';
import api from './api/client';

export default function App() {
  const { token, email, logout } = useAuth();
  const [debts, setDebts] = useState([]);
  const [strategy, setStrategy] = useState('avalanche');
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (token) {
      api.get('/api/debts').then(res => setDebts(res.data));
    }
  }, [token]);

  async function addDebt(debt) {
    const res = await api.post('/api/debts', debt);
    setDebts(res.data);
  }

  async function removeDebt(id) {
    const res = await api.delete(`/api/debts/${id}`);
    setDebts(res.data);
  }

  if (!token) return <Login />;

  const snowball = debts.length ? calcPayoff(debts, 'snowball') : null;
  const avalanche = debts.length ? calcPayoff(debts, 'avalanche') : null;
  const whatIf = debts.length ? calcWhatIf(debts, strategy, extra) : null;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#1a3a5c', marginBottom: '4px' }}>Loan Payoff Accelerator</h1>
          <p style={{ color: '#888', fontSize: '13px' }}>FIN 6777 · Team 5 · {email}</p>
        </div>
        <button onClick={logout} style={{ fontSize: '13px', color: '#888', background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>Sign out</button>
      </div>

      <h2 style={{ fontSize: '16px', marginBottom: '10px' }}>Add a debt</h2>
      <DebtForm onAdd={addDebt} />

      {debts.length > 0 && (
        <>
          <h2 style={{ fontSize: '16px', margin: '1.5rem 0 10px' }}>Your debts</h2>
          {debts.map(d => (
            <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', marginBottom: '6px', fontSize: '14px' }}>
              <span><strong>{d.name}</strong> — ${parseFloat(d.balance).toLocaleString()} at {d.rate}% APR</span>
              <button onClick={() => removeDebt(d._id)} style={{ background: 'none', border: 'none', color: '#a32d2d', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}

          <h2 style={{ fontSize: '16px', margin: '1.5rem 0 10px' }}>Choose a strategy</h2>
          <StrategyPicker strategy={strategy} setStrategy={setStrategy} snowballResult={snowball} avalancheResult={avalanche} />

          <h2 style={{ fontSize: '16px', margin: '1.5rem 0 10px' }}>What-if simulator</h2>
          <WhatIfSimulator result={whatIf} extra={extra} setExtra={setExtra} />

          <h2 style={{ fontSize: '16px', margin: '1.5rem 0 10px' }}>Payoff timeline</h2>
          <PayoffChart baseline={whatIf?.baselineBalances} accelerated={whatIf?.acceleratedBalances} />
        </>
      )}
    </div>
  );
}