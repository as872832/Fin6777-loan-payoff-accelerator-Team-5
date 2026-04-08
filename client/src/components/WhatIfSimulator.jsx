const T = { navy: '#0f2340', navyMid: '#1a3a5c', gold: '#c9a84c', goldLight: '#e8c97a', goldPale: '#fdf3dc', slate: '#4a5568', muted: '#8896a8' };

export default function WhatIfSimulator({ result, extra, setExtra }) {
  const now = new Date();
  const payoffDate = result ? (() => {
    const d = new Date(now.getFullYear(), now.getMonth() + result.acceleratedMonths, 1);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  })() : null;

  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(15,35,64,0.1)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '13px', color: T.slate, minWidth: '170px' }}>Extra monthly payment</label>
        <input type="range" min="0" max="500" step="25" value={extra}
          onChange={e => setExtra(Number(e.target.value))}
          style={{ flex: 1, accentColor: T.gold }} />
        <div style={{
          minWidth: '64px', textAlign: 'center', padding: '4px 10px',
          background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
          borderRadius: '8px', fontSize: '15px', fontWeight: 700, color: T.navy
        }}>${extra}</div>
      </div>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Payoff date', value: payoffDate },
            { label: 'Months saved', value: result.monthsSaved + ' mo' },
            { label: 'Interest saved', value: '$' + Math.round(result.interestSaved).toLocaleString() }
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
              borderRadius: '12px', padding: '1rem', textAlign: 'center',
              border: '1px solid rgba(201,168,76,0.2)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -15, right: -15, width: 50, height: 50, borderRadius: '50%', background: 'rgba(201,168,76,0.08)' }} />
              <div style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</div>
              <div style={{ fontSize: '17px', fontWeight: 600, color: T.gold, fontFamily: 'DM Serif Display, serif' }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}