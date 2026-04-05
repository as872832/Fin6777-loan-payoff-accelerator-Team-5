export default function StrategyPicker({ strategy, setStrategy, snowballResult, avalancheResult }) {
  return (
    <div style={{ display: 'flex', gap: '16px', margin: '1rem 0' }}>
      {['snowball', 'avalanche'].map(s => (
        <div
          key={s}
          onClick={() => setStrategy(s)}
          style={{
            flex: 1, padding: '1rem', cursor: 'pointer', borderRadius: '8px',
            border: strategy === s ? '2px solid #1a3a5c' : '1px solid #ccc',
            background: strategy === s ? '#ebf3fb' : '#fff'
          }}
        >
          <div style={{ fontWeight: 600, textTransform: 'capitalize', marginBottom: '6px' }}>{s}</div>
          <div style={{ fontSize: '13px', color: '#555' }}>
            {s === 'snowball' ? 'Lowest balance first — quick wins' : 'Highest APR first — saves most interest'}
          </div>
          {snowballResult && (
            <div style={{ marginTop: '10px', fontSize: '13px' }}>
              <div>Payoff: <strong>{s === 'snowball' ? snowballResult.months : avalancheResult.months} months</strong></div>
              <div>Interest: <strong>${Math.round(s === 'snowball' ? snowballResult.totalInterest : avalancheResult.totalInterest).toLocaleString()}</strong></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}