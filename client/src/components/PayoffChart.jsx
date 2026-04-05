import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function PayoffChart({ baseline, accelerated }) {
  if (!baseline || baseline.length === 0) return null;

  const now = new Date();
  const labels = baseline.map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });

  return (
    <div style={{ background: '#fff', border: '0.5px solid #d3d1c7', borderRadius: '12px', padding: '1.25rem' }}>
      <div style={{ fontSize: '15px', fontWeight: 600, color: '#2c2c2a', marginBottom: '1rem' }}>Payoff timeline</div>
      <div style={{ position: 'relative', height: '260px' }}>
        <Line
          data={{
            labels,
            datasets: [
              { label: 'Minimum only', data: baseline, borderColor: '#b4b2a9', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
              { label: 'With extra payment', data: accelerated, borderColor: '#1a3a5c', backgroundColor: 'rgba(26,58,92,0.06)', borderWidth: 2, pointRadius: 0, tension: 0.3, fill: true }
            ]
          }}
          options={{
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { font: { size: 12 }, color: '#5f5e5a', boxWidth: 12, padding: 16 } },
              tooltip: { mode: 'index', intersect: false, callbacks: { label: ctx => `${ctx.dataset.label}: $${Math.round(ctx.parsed.y).toLocaleString()}` } }
            },
            scales: {
              x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888780', maxTicksLimit: 12 } },
              y: { grid: { color: 'rgba(136,135,128,0.15)' }, ticks: { font: { size: 11 }, color: '#888780', callback: v => '$' + (v / 1000).toFixed(0) + 'k' } }
            }
          }}
        />
      </div>
    </div>
  );
}