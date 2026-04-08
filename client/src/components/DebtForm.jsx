import { useState } from 'react';

const DEBT_TYPES = ['Credit Card', 'Student Loan', 'Auto Loan', 'Mortgage', 'BNPL', 'Medical', 'Other'];

const T = { navy: '#0f2340', navyMid: '#1a3a5c', gold: '#c9a84c', goldLight: '#e8c97a', slate: '#4a5568', border: '#e2e2e2' };

const inputStyle = {
  width: '100%', padding: '10px 14px',
  border: '1px solid #e2e2e2', borderRadius: '10px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  background: '#fff', color: T.navy, fontFamily: 'DM Sans, sans-serif',
  transition: 'border-color 0.15s'
};

const labelStyle = {
  fontSize: '11px', fontWeight: 600, color: T.slate,
  display: 'block', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.06em'
};

export default function DebtForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card' });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.balance || !form.rate || !form.minPayment) return;
    onAdd({ ...form, id: Date.now() });
    setForm({ name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card' });
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(15,35,64,0.1)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Debt name</label>
            <input name="name" placeholder="e.g. Chase Sapphire" value={form.name} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Balance ($)</label>
            <input name="balance" type="number" placeholder="4,250" value={form.balance} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Interest rate (%)</label>
            <input name="rate" type="number" step="0.01" placeholder="24.99" value={form.rate} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Min. payment ($/mo)</label>
            <input name="minPayment" type="number" placeholder="85" value={form.minPayment} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Debt type</label>
            <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
              {DEBT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" style={{
          width: '100%', padding: '11px',
          background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
          color: '#fff', border: 'none', borderRadius: '10px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s'
        }}>Add debt</button>
      </form>
    </div>
  );
}