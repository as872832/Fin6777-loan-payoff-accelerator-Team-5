export default function StrategyPicker({ strategy, setStrategy, snowballResult, avalancheResult }) {
  const options = [
    { key: 'snowball', label: 'Snowball', desc: 'Lowest balance first — quick wins build momentum', result: snowballResult },
    { key: 'avalanche', label: 'Avalanche', desc: 'Highest APR first — saves the most interest', result: avalancheResult, badge: 'saves most' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {options.map(({ key, label, desc, result, badge }) => (
        <div
          key={key}
          onClick={() => setStrategy(key)}
          style={{
            background: '#fff', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer',
            border: strategy === key ? '2px solid #1a3a5c' : '0.5px solid #d3d1c7',
            transition: 'border-color 0.15s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a3a5c' }}>{label}</span>
            {badge && <span style={{ fontSize: '10px', background: '#1a3a5c', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>{badge}</span>}
          </div>
          <div style={{ fontSize: '12px', color: '#5f5e5a', marginBottom: '12px', lineHeight: 1.5 }}>{desc}</div>
          {result && (
            <div style={{ borderTop: '0.5px solid #d3d1c7', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: '#5f5e5a' }}>Debt-free in</span>
                <span style={{ fontWeight: 600, color: '#2c2c2a' }}>{result.months} months</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#5f5e5a' }}>Total interest</span>
                <span style={{ fontWeight: 600, color: '#2c2c2a' }}>${Math.round(result.totalInterest).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}