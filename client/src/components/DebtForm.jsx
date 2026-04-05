import { useState } from 'react';

const DEBT_TYPES = ['Credit Card', 'Student Loan', 'Auto Loan', 'Mortgage', 'BNPL', 'Medical', 'Other'];

const inputStyle = {
  width: '100%', padding: '8px 12px', border: '0.5px solid #d3d1c7',
  borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  background: '#fff', color: '#2c2c2a'
};

const labelStyle = { fontSize: '12px', color: '#5f5e5a', display: 'block', marginBottom: '4px' };

export default function DebtForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.balance || !form.rate || !form.minPayment) return;
    onAdd({ ...form, id: Date.now() });
    setForm({ name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card' });
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid #d3d1c7', borderRadius: '12px', padding: '1.25rem' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Debt name</label>
            <input name="name" placeholder="e.g. Chase Sapphire" value={form.name} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Current balance ($)</label>
            <input name="balance" type="number" placeholder="4250" value={form.balance} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Annual interest rate (%)</label>
            <input name="rate" type="number" step="0.01" placeholder="24.99" value={form.rate} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Min. monthly payment ($)</label>
            <input name="minPayment" type="number" placeholder="85" value={form.minPayment} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Debt type</label>
            <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
              {DEBT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" style={{ width: '100%', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          Add debt
        </button>
      </form>
    </div>
  );
}