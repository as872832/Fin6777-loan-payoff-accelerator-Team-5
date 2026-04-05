import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import DebtForm from './components/DebtForm';
import StrategyPicker from './components/StrategyPicker';
import WhatIfSimulator from './components/WhatIfSimulator';
import PayoffChart from './components/PayoffChart';
import { calcPayoff, calcWhatIf } from './utils/calcEngine';
import api from './api/client';

const TYPE_COLORS = {
  'Credit Card': { bg: '#faece7', color: '#993c1d' },
  'Student Loan': { bg: '#e6f1fb', color: '#185fa5' },
  'Auto Loan': { bg: '#eaf3de', color: '#3b6d11' },
  'BNPL': { bg: '#faeeda', color: '#854f0b' },
  'Mortgage': { bg: '#eeedfe', color: '#534ab7' },
  'Medical': { bg: '#e1f5ee', color: '#0f6e56' },
  'Other': { bg: '#f1efe8', color: '#5f5e5a' }
};

export default function App() {
  const { token, email, logout } = useAuth();
  const [debts, setDebts] = useState([]);
  const [strategy, setStrategy] = useState('avalanche');
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (token) api.get('/api/debts').then(res => setDebts(res.data));
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

  const totalBalance = debts.reduce((sum, d) => sum + parseFloat(d.balance), 0);
  const highestRate = debts.length ? Math.max(...debts.map(d => parseFloat(d.rate))) : 0;
  const totalMin = debts.reduce((sum, d) => sum + parseFloat(d.minPayment), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#1a3a5c', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', border: '2.5px solid #fff', borderRadius: '50%' }}></div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Loan Payoff Accelerator</div>
            <div style={{ fontSize: '11px', color: '#85b7eb' }}>FIN 6777 · Team 5</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#85b7eb' }}>{email}</span>
          <button onClick={logout} style={{ fontSize: '12px', color: '#fff', background: 'rgba(255,255,255,0.15)', border: '0.5px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {debts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total balance', value: '$' + Math.round(totalBalance).toLocaleString() },
              { label: 'Monthly minimums', value: '$' + Math.round(totalMin).toLocaleString() },
              { label: 'Highest APR', value: highestRate + '%' }
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#fff', border: '0.5px solid #d3d1c7', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '12px', color: '#5f5e5a', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '22px', fontWeight: 600, color: '#1a3a5c' }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ fontSize: '13px', fontWeight: 600, color: '#5f5e5a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Add a debt</div>
        <div style={{ marginBottom: '1.5rem' }}>
          <DebtForm onAdd={addDebt} />
        </div>

        {debts.length > 0 && (
          <>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#5f5e5a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Your debts</div>
            <div style={{ background: '#fff', border: '0.5px solid #d3d1c7', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              {debts.map((d, i) => {
                const tc = TYPE_COLORS[d.type] || TYPE_COLORS['Other'];
                return (
                  <div key={d._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: i < debts.length - 1 ? '0.5px solid #f1efe8' : 'none' }}>
                    <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '20px', fontWeight: 600, background: tc.bg, color: tc.color, flexShrink: 0 }}>{d.type}</span>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: '#2c2c2a' }}>{d.name}</span>
                    <span style={{ fontSize: '13px', color: '#5f5e5a' }}>${parseFloat(d.balance).toLocaleString()}</span>
                    <span style={{ fontSize: '13px', color: '#5f5e5a', minWidth: '60px', textAlign: 'right' }}>{d.rate}% APR</span>
                    <button onClick={() => removeDebt(d._id)} style={{ background: 'none', border: 'none', color: '#a32d2d', cursor: 'pointer', fontSize: '13px', padding: '0 4px' }}>Remove</button>
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: '#5f5e5a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Choose a strategy</div>
            <div style={{ marginBottom: '1.5rem' }}>
              <StrategyPicker strategy={strategy} setStrategy={setStrategy} snowballResult={snowball} avalancheResult={avalanche} />
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: '#5f5e5a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>What-if simulator</div>
            <div style={{ marginBottom: '1.5rem' }}>
              <WhatIfSimulator result={whatIf} extra={extra} setExtra={setExtra} />
            </div>

            <PayoffChart baseline={whatIf?.baselineBalances} accelerated={whatIf?.acceleratedBalances} />
          </>
        )}
      </div>
    </div>
  );
}