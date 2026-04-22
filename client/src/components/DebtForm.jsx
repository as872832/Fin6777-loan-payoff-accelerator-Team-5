import { useState, useEffect } from 'react';

const DEBT_TYPES = ['Credit Card', 'Student Loan', 'Auto Loan', 'Mortgage', 'BNPL', 'Medical', 'Other'];
const TERM_TYPES = ['Auto Loan', 'Mortgage', 'Student Loan'];

const T = { navy: '#0f2340', navyMid: '#1a3a5c', gold: '#c9a84c', goldLight: '#e8c97a', slate: '#4a5568', muted: '#8896a8' };

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
  const r = parseFloat(annualRate) / 100 / 12;
  const p = parseFloat(balance);
  const n = parseInt(termMonths);
  if (!p || !n) return null;
  if (!r || r === 0) return p / n;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function DebtForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '', balance: '', rate: '', minPayment: '',
    type: 'Credit Card', termMonths: '', installmentsRemaining: ''
  });
  const [calculatedMin, setCalculatedMin] = useState(null);
  const [minWarning, setMinWarning] = useState('');

  const showTerm = TERM_TYPES.includes(form.type);
  const isBNPL = form.type === 'BNPL';

  useEffect(() => {
    if (showTerm && form.balance && form.rate && form.termMonths) {
      const required = calcRequiredPayment(form.balance, form.rate, form.termMonths);
      if (required) {
        const rounded = Math.ceil(required * 100) / 100;
        setCalculatedMin(rounded);
        setForm(f => ({ ...f, minPayment: rounded.toFixed(2) }));
        setMinWarning('');
      }
    } else if (isBNPL && form.balance && form.installmentsRemaining) {
      const payment = parseFloat(form.balance) / parseInt(form.installmentsRemaining);
      if (payment) {
        const rounded = Math.ceil(payment * 100) / 100;
        setCalculatedMin(rounded);
        setForm(f => ({ ...f, minPayment: rounded.toFixed(2), rate: f.rate || '0' }));
        setMinWarning('');
      }
    } else {
      setCalculatedMin(null);
    }
  }, [form.balance, form.rate, form.termMonths, form.type, form.installmentsRemaining]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'balance') {
      setForm(f => ({ ...f, balance: Math.max(0, parseFloat(value) || 0) }));
      return;
    }
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'minPayment' && calculatedMin) {
      const entered = parseFloat(value);
      if (entered < calculatedMin) {
        setMinWarning(`Required payment is $${calculatedMin.toFixed(2)} based on your term. Entering less risks default.`);
      } else {
        setMinWarning('');
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.balance || !form.minPayment) return;
    const enteredMin = parseFloat(form.minPayment);
    const finalMin = calculatedMin ? Math.max(enteredMin, calculatedMin) : enteredMin;
    onAdd({ ...form, minPayment: finalMin, rate: form.rate || '0', id: Date.now() });
    setForm({ name: '', balance: '', rate: '', minPayment: '', type: 'Credit Card', termMonths: '', installmentsRemaining: '' });
    setCalculatedMin(null);
    setMinWarning('');
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(15,35,64,0.1)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Debt name</label>
            <input name="name" placeholder="e.g. Affirm — Peloton" value={form.name} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Balance ($)</label>
            <input name="balance" type="number" min="0" placeholder="1,200" value={form.balance} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Debt type</label>
            <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
              {DEBT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {isBNPL && (
            <>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ background: '#ebf3fb', border: '1px solid #b5d4f4', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#185fa5', lineHeight: 1.6 }}>
                  BNPL plans are typically 0% interest. Enter your remaining installments and the app will calculate your monthly payment automatically. If your plan charges deferred interest, enter the APR below.
                </div>
              </div>
              <div>
                <label style={labelStyle}>Payments remaining</label>
                <input name="installmentsRemaining" type="number" min="1" placeholder="e.g. 6" value={form.installmentsRemaining} onChange={handleChange} style={inputStyle} />
                <div style={{ fontSize: '11px', color: T.muted, marginTop: '4px' }}>How many monthly payments are left on this plan</div>
              </div>
              <div>
                <label style={labelStyle}>Interest rate (%) <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— usually 0</span></label>
                <input name="rate" type="number" step="0.01" placeholder="0" value={form.rate} onChange={handleChange} style={inputStyle} />
              </div>
            </>
          )}

          {!isBNPL && (
            <div>
              <label style={labelStyle}>Interest rate (%)</label>
              <input name="rate" type="number" step="0.01" placeholder="24.99" value={form.rate} onChange={handleChange} style={inputStyle} />
            </div>
          )}

          {showTerm && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>
                Remaining term (months)
              </label>
              <input name="termMonths" type="number"
                placeholder={form.type === 'Mortgage' ? '360' : form.type === 'Auto Loan' ? '60' : '120'}
                value={form.termMonths} onChange={handleChange} style={inputStyle} />
              <div style={{ fontSize: '11px', color: T.muted, marginTop: '4px' }}>
                {form.type === 'Mortgage' ? '360 = 30yr · 180 = 15yr' : form.type === 'Auto Loan' ? '60 = 5yr · 72 = 6yr' : '120 = 10yr'}
              </div>
            </div>
          )}

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>
              Monthly payment ($/mo)
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
                {isBNPL ? 'Calculated from balance divided by remaining installments.' : 'Required P&I payment based on your balance, rate, and term.'}
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