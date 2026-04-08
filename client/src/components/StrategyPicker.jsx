const T = { navy: '#0f2340', navyMid: '#1a3a5c', gold: '#c9a84c', goldLight: '#e8c97a', goldPale: '#fdf3dc', slate: '#4a5568', muted: '#8896a8' };

export default function StrategyPicker({ strategy, setStrategy, snowballResult, avalancheResult }) {
  const options = [
    { key: 'snowball', label: 'Snowball', desc: 'Smallest balance first — quick wins build momentum', result: snowballResult },
    { key: 'avalanche', label: 'Avalanche', desc: 'Highest APR first — mathematically saves the most interest', result: avalancheResult, badge: 'saves most' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
      {options.map(({ key, label, desc, result, badge }) => (
        <div key={key} onClick={() => setStrategy(key)} style={{
          background: strategy === key
            ? `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`
            : 'rgba(255,255,255,0.9)',
          borderRadius: '16px', padding: '1.5rem', cursor: 'pointer',
          border: strategy === key ? `1px solid rgba(201,168,76,0.3)` : '1px solid rgba(15,35,64,0.1)',
          transition: 'all 0.2s', backdropFilter: 'blur(8px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '15px', fontFamily: 'DM Serif Display, serif', color: strategy === key ? T.gold : T.navy }}>{label}</span>
            {badge && <span style={{ fontSize: '10px', background: T.gold, color: T.navy, padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>{badge}</span>}
          </div>
          <div style={{ fontSize: '12px', color: strategy === key ? T.muted : T.slate, marginBottom: '1rem', lineHeight: 1.5 }}>{desc}</div>
          {result && (
            <div style={{ borderTop: `1px solid ${strategy === key ? 'rgba(255,255,255,0.1)' : 'rgba(15,35,64,0.08)'}`, paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: strategy === key ? T.muted : T.slate }}>Debt-free in</span>
                <span style={{ fontWeight: 600, color: strategy === key ? T.white : T.navy }}>{result.months} months</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: strategy === key ? T.muted : T.slate }}>Total interest</span>
                <span style={{ fontWeight: 600, color: strategy === key ? T.goldLight : T.navy }}>${Math.round(result.totalInterest).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}