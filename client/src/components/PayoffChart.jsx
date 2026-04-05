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
    <div style={{ position: 'relative', height: '280px', margin: '1rem 0' }}>
      <Line
        data={{
          labels,
          datasets: [
            { label: 'Minimum only', data: baseline, borderColor: '#aaa', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0, tension: 0.3 },
            { label: 'With extra payment', data: accelerated, borderColor: '#1a3a5c', borderWidth: 2, pointRadius: 0, tension: 0.3 }
          ]
        }}
        options={{
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: {
            y: { ticks: { callback: v => '$' + (v / 1000).toFixed(0) + 'k' } }
          }
        }}
      />
    </div>
  );
}