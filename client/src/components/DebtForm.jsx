import { useState, useEffect } from 'react';

const DEBT_TYPES = ['Credit Card', 'Student Loan', 'Auto Loan', 'Mortgage', 'BNPL', 'Medical', 'Other'];
const TERM_TYPES = ['Auto Loan', 'Mortgage', 'Student Loan'];

const T = { navy: '#0f2340', navyMid: '#1a3a5c', gold: '#c9a84c', slate: '#4a5568' };

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

function calcRequiredPayment(balance, annualRate, termMonths) {
  if (!balance || !termMonths) return null;
  const r = parseFloat(annualRate) / 100 / 12;
  const p = parseFloat(balance);
  const n = parseInt(termMonths);
  if (!r || !p || !n) return null;
  if (r === 0) return p / n;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function DebtForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card', termMonths: ''
  });
  const [calculatedMin, setCalculatedMin] = useState(null);
  const [minWarning, setMinWarning] = useState('');

  const showTerm = TERM_TYPES.includes(form.type);

  useEffect(() => {
    if (showTerm && form.balance && form.rate && form.termMonths) {
      const required = calcRequiredPayment(form.balance, form.rate, form.termMonths);
      if (required) {
        const rounded = Math.ceil(required * 100) / 100;
        setCalculatedMin(rounded);
        setForm(f => ({ ...f, minPayment: rounded.toFixed(2) }));
        setMinWarning('');
      }
    } else {
      setCalculatedMin(null);
    }
  }, [form.balance, form.rate, form.termMonths, form.type]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));

    if (name === 'minPayment' && calculatedMin) {
      const entered = parseFloat(value);
      if (entered < calculatedMin) {
        setMinWarning(`Minimum required payment is $${calculatedMin.toFixed(2)} based on your loan term. Entering less risks default.`);
      } else {
        setMinWarning('');
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.balance || !form.rate || !form.minPayment) return;
    const enteredMin = parseFloat(form.minPayment);
    const finalMin = calculatedMin ? Math.max(enteredMin, calculatedMin) : enteredMin;
    onAdd({ ...form, minPayment: finalMin, id: Date.now() });
    setForm({ name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card', termMonths: '' });
    setCalculatedMin(null);
    setMinWarning('');
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(15,35,64,0.1)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Debt name</label>
            <input name="name" placeholder="e.g. 30yr Fixed Mortgage" value={form.name} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Balance ($)</label>
            <input name="balance" type="number" placeholder="250,000" value={form.balance} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Interest rate (%)</label>
            <input name="rate" type="number" step="0.01" placeholder="6.75" value={form.rate} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Debt type</label>
            <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
              {DEBT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {showTerm && (
            <div>
              <label style={labelStyle}>
                Remaining term (months)
              </label>
              <input
                name="termMonths" type="number"
                placeholder={form.type === 'Mortgage' ? '360' : form.type === 'Auto Loan' ? '60' : '120'}
                value={form.termMonths} onChange={handleChange} style={inputStyle}
              />
              <div style={{ fontSize: '11px', color: T.slate, marginTop: '4px', opacity: 0.7 }}>
                {form.type === 'Mortgage' ? '360 = 30yr · 180 = 15yr' : form.type === 'Auto Loan' ? '60 = 5yr · 72 = 6yr' : '120 = 10yr · 120 = standard'}
              </div>
            </div>
          )}

          <div style={{ gridColumn: showTerm ? '1 / -1' : 'auto' }}>
            <label style={labelStyle}>
              Min. payment ($/mo)
              {calculatedMin && (
                <span style={{ fontWeight: 400, color: '#2d6a4f', marginLeft: '8px', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                  — auto-calculated: ${calculatedMin.toFixed(2)}
                </span>
              )}
            </label>
            <input
              name="minPayment" type="number" step="0.01"
              placeholder={calculatedMin ? calculatedMin.toFixed(2) : '85'}
              value={form.minPayment} onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: minWarning ? '#e53e3e' : calculatedMin ? '#2d6a4f' : '#e2e2e2',
                background: calculatedMin && !minWarning ? '#f0faf4' : minWarning ? '#fff5f5' : '#fff'
              }}
            />
            {minWarning && (
              <div style={{ fontSize: '12px', color: '#922b21', background: '#fadbd8', padding: '8px 12px', borderRadius: '8px', marginTop: '6px', lineHeight: 1.5 }}>
                {minWarning}
              </div>
            )}
            {calculatedMin && !minWarning && (
              <div style={{ fontSize: '11px', color: '#2d6a4f', marginTop: '4px' }}>
                Required P&I payment based on your balance, rate, and term. You can pay more but not less.
              </div>
            )}
          </div>

        </div>
        <button type="submit" style={{
          width: '100%', padding: '11px',
          background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
          color: '#fff', border: 'none', borderRadius: '10px',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif'
        }}>Add debt</button>
      </form>
    </div>
  );
}