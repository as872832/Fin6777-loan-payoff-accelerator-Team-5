export default function WhatIfSimulator({ result, extra, setExtra }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid #d3d1c7', borderRadius: '12px', padding: '1.25rem' }}>
      <div style={{ fontSize: '15px', fontWeight: 600, color: '#2c2c2a', marginBottom: '1rem' }}>What-if simulator</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '13px', color: '#5f5e5a', minWidth: '160px' }}>Extra monthly payment</label>
        <input
          type="range" min="0" max="500" step="25" value={extra}
          onChange={e => setExtra(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a3a5c', minWidth: '48px', textAlign: 'right' }}>${extra}</span>
      </div>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { label: 'Payoff date', value: (() => { const d = new Date(); d.setMonth(d.getMonth() + result.acceleratedMonths); return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); })() },
            { label: 'Months saved', value: result.monthsSaved + ' mo' },
            { label: 'Interest saved', value: '$' + Math.round(result.interestSaved).toLocaleString() }
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#ebf3fb', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#185fa5', marginBottom: '4px', fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a3a5c' }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}