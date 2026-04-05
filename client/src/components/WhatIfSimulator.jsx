export default function WhatIfSimulator({ result, extra, setExtra }) {
  return (
    <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <div style={{ fontWeight: 600, marginBottom: '10px' }}>What-If Simulator</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
        <label style={{ fontSize: '14px', color: '#555' }}>Extra monthly payment</label>
        <input type="range" min="0" max="500" step="25" value={extra} onChange={e => setExtra(Number(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontWeight: 500, minWidth: '48px' }}>${extra}</span>
      </div>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Months saved', value: result.monthsSaved },
            { label: 'Interest saved', value: '$' + Math.round(result.interestSaved).toLocaleString() },
            { label: 'Payoff in', value: result.acceleratedMonths + ' months' }
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#ebf3fb', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a3a5c' }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}