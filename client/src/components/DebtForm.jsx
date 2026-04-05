import { useState } from 'react';

const DEBT_TYPES = ['Credit Card', 'Student Loan', 'Auto Loan', 'Mortgage', 'BNPL', 'Medical', 'Other'];

export default function DebtForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card'
  });

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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '480px' }}>
      <input name="name" placeholder="Debt name (e.g. Chase Sapphire)" value={form.name} onChange={handleChange} />
      <input name="balance" type="number" placeholder="Current balance ($)" value={form.balance} onChange={handleChange} />
      <input name="rate" type="number" step="0.01" placeholder="Annual interest rate (%)" value={form.rate} onChange={handleChange} />
      <input name="minPayment" type="number" placeholder="Minimum monthly payment ($)" value={form.minPayment} onChange={handleChange} />
      <select name="type" value={form.type} onChange={handleChange}>
        {DEBT_TYPES.map(t => <option key={t}>{t}</option>)}
      </select>
      <button type="submit">Add Debt</button>
    </form>
  );
}