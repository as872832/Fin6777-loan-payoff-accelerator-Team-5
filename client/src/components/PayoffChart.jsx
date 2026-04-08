import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

export default function PayoffChart({ baseline, accelerated }) {
  if (!baseline || baseline.length === 0) return null;

  const now = new Date();
  const labels = baseline.map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });

  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(15,35,64,0.1)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
      <div style={{ position: 'relative', height: '280px' }}>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: 'Minimum only',
                data: baseline,
                borderColor: '#b4b2a9',
                borderDash: [5, 4],
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.4,
                fill: false
              },
              {
                label: 'With extra payment',
                data: accelerated,
                borderColor: '#c9a84c',
                backgroundColor: 'rgba(201,168,76,0.08)',
                borderWidth: 2.5,
                pointRadius: 0,
                tension: 0.4,
                fill: true
              }
            ]
          }}
          options={{
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { font: { size: 12, family: 'DM Sans' }, color: '#4a5568', boxWidth: 12, padding: 20 }
              },
              tooltip: {
                mode: 'index', intersect: false,
                backgroundColor: '#0f2340',
                titleColor: '#c9a84c',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(201,168,76,0.3)',
                borderWidth: 1,
                padding: 12,
                callbacks: { label: ctx => `${ctx.dataset.label}: $${Math.round(ctx.parsed.y).toLocaleString()}` }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 11, family: 'DM Sans' }, color: '#8896a8', maxTicksLimit: 14 }
              },
              y: {
                grid: { color: 'rgba(15,35,64,0.06)' },
                ticks: { font: { size: 11, family: 'DM Sans' }, color: '#8896a8', callback: v => '$' + (v / 1000).toFixed(0) + 'k' }
              }
            }
          }}
        />
      </div>
    </div>
  );
}