import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Landing from './components/Login';
import DebtForm from './components/DebtForm';
import StrategyPicker from './components/StrategyPicker';
import WhatIfSimulator from './components/WhatIfSimulator';
import PayoffChart from './components/PayoffChart';
import { calcPayoff, calcWhatIf } from './utils/calcEngine';
import api from './api/client';

const T = {
  navy: '#0f2340', navyMid: '#1a3a5c', navyLight: '#224870',
  gold: '#c9a84c', goldLight: '#e8c97a', goldPale: '#fdf3dc',
  cream: '#faf8f4', white: '#ffffff', slate: '#4a5568', muted: '#8896a8',
  border: 'rgba(201,168,76,0.2)', borderLight: 'rgba(15,35,64,0.1)',
  cardBg: 'rgba(255,255,255,0.85)', success: '#2d6a4f', successBg: '#d8f3dc',
  danger: '#922b21', dangerBg: '#fadbd8',
};

const TYPE_COLORS = {
  'Credit Card': { bg: '#fff0e6', color: '#923d1a' },
  'Student Loan': { bg: '#e8f0fc', color: '#1a4ea8' },
  'Auto Loan':   { bg: '#e8f8ee', color: '#1a6b3a' },
  'BNPL':        { bg: '#fdf3dc', color: '#8a5a00' },
  'Mortgage':    { bg: '#f0ebfe', color: '#5a3ab7' },
  'Medical':     { bg: '#e0f7f4', color: '#0a6b5e' },
  'Other':       { bg: '#f0f0f0', color: '#4a4a4a' },
};

const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${T.cream}; color: ${T.navy}; }
  input, select, textarea {
    font-family: 'DM Sans', sans-serif;
    width: 100%; padding: 10px 14px;
    border: 1px solid ${T.borderLight};
    border-radius: 8px; font-size: 14px;
    outline: none; background: ${T.white};
    color: ${T.navy}; transition: border-color 0.15s;
  }
  input:focus, select:focus { border-color: ${T.gold}; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); }
  button { font-family: 'DM Sans', sans-serif; cursor: pointer; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .fade-up-1 { animation: fadeUp 0.4s 0.05s ease both; }
  .fade-up-2 { animation: fadeUp 0.4s 0.1s ease both; }
  .fade-up-3 { animation: fadeUp 0.4s 0.15s ease both; }
  .fade-up-4 { animation: fadeUp 0.4s 0.2s ease both; }
`;

function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ width: '3px', height: '14px', background: T.gold, borderRadius: '2px' }} />
      <span style={{ fontSize: '11px', fontWeight: 600, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{children}</span>
    </div>
  );
}

function Card({ children, style = {}, className = '' }) {
  return (
    <div className={className} style={{
      background: T.cardBg, border: `1px solid ${T.borderLight}`,
      borderRadius: '16px', padding: '1.5rem',
      backdropFilter: 'blur(8px)', ...style
    }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, delay = '' }) {
  return (
    <div className={`fade-up${delay}`} style={{
      background: `linear-gradient(135deg, ${T.navyMid} 0%, ${T.navy} 100%)`,
      borderRadius: '14px', padding: '1.25rem',
      border: `1px solid rgba(201,168,76,0.25)`,
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,168,76,0.08)' }} />
      <div style={{ fontSize: '11px', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 600, color: T.white, fontFamily: 'DM Serif Display, serif' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: T.muted, marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

function NavBar({ page, setPage, email, logout }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
      borderBottom: `1px solid rgba(201,168,76,0.2)`,
      padding: '0 2rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 0' }}>
        <div style={{
          width: '36px', height: '36px',
          background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 100%)`,
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: '18px', height: '18px', border: '2.5px solid #fff', borderRadius: '50%' }} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: T.white, fontFamily: 'DM Serif Display, serif', letterSpacing: '0.01em' }}>Loan Payoff Accelerator</div>
          <div style={{ fontSize: '11px', color: T.gold, opacity: 0.8 }}>FIN 6777 · Team 5</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[['dashboard', 'Dashboard'], ['consolidate', 'Consolidate'], ['about', 'About'], ['faq', 'FAQ & How-To']].map(([key, label]) => (
          <button key={key} onClick={() => setPage(key)} style={{
            background: page === key ? 'rgba(201,168,76,0.15)' : 'none',
            border: page === key ? `1px solid rgba(201,168,76,0.3)` : '1px solid transparent',
            borderRadius: '8px', padding: '6px 16px',
            color: page === key ? T.gold : T.muted,
            fontSize: '13px', fontWeight: page === key ? 600 : 400,
            transition: 'all 0.15s'
          }}>{label}</button>
        ))}
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)', margin: '0 10px' }} />
        <span style={{ fontSize: '12px', color: T.muted, marginRight: '10px' }}>{email}</span>
        <button onClick={logout} style={{
          fontSize: '12px', color: T.gold,
          background: 'rgba(201,168,76,0.1)',
          border: `1px solid rgba(201,168,76,0.3)`,
          borderRadius: '8px', padding: '6px 14px',
          transition: 'all 0.15s'
        }}>Sign out</button>
      </div>
    </div>
  );
}

function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div className="fade-up" style={{
        background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
        borderRadius: '20px', padding: '3rem',
        border: `1px solid rgba(201,168,76,0.2)`,
        marginBottom: '2rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,168,76,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(201,168,76,0.04)' }} />
        <div style={{ fontSize: '11px', color: T.gold, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>About this project</div>
        <div style={{ fontSize: '36px', fontFamily: 'DM Serif Display, serif', color: T.white, lineHeight: 1.2, marginBottom: '1rem' }}>
          Built to help you<br /><em>get out of debt faster</em>
        </div>
        <p style={{ fontSize: '15px', color: T.muted, lineHeight: 1.8, maxWidth: '540px' }}>
          The Loan Payoff Accelerator is a free financial education tool built for everyday borrowers who want to understand their debt and take control — without linking a bank account or paying a subscription.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '2rem' }}>
        {[
          { icon: '◎', title: 'No bank link required', desc: 'Enter your loan details manually. We never touch your accounts.' },
          { icon: '◈', title: 'All math in your browser', desc: 'Calculations run client-side. Nothing is sent to a server except your saved data.' },
          { icon: '◇', title: 'Two proven strategies', desc: 'Snowball and avalanche — compare them side by side instantly.' },
          { icon: '◉', title: 'Real-time what-if simulator', desc: 'Type in an extra monthly amount and see exactly how much faster you pay off debt.' },
        ].map(({ icon, title, desc }, i) => (
          <Card key={title} className={`fade-up-${i % 4}`} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '20px', color: T.gold, flexShrink: 0, marginTop: '2px' }}>{icon}</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: T.navy, marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: T.slate, lineHeight: 1.6 }}>{desc}</div>
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>The team</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '2rem' }}>
        {[
          { name: 'Team Member 1', role: 'Frontend & UI' },
          { name: 'Team Member 2', role: 'Backend & Database' },
          { name: 'Team Member 3', role: 'Calculation Engine' },
          { name: 'Team Member 4', role: 'Security & Auth' },
          { name: 'Team Member 5', role: 'Project Lead' },
        ].map(({ name, role }, i) => (
          <Card key={name} className={`fade-up-${i % 4}`} style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{
              width: '44px', height: '44px', margin: '0 auto 10px',
              background: `linear-gradient(135deg, ${T.navyMid}, ${T.navy})`,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid rgba(201,168,76,0.3)`
            }}>
              <div style={{ width: '18px', height: '18px', border: `2px solid ${T.gold}`, borderRadius: '50%' }} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: T.navy }}>{name}</div>
            <div style={{ fontSize: '12px', color: T.slate, marginTop: '3px' }}>{role}</div>
          </Card>
        ))}
      </div>

      <SectionLabel>Built with</SectionLabel>
      <Card>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['React 18', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Chart.js', 'Vite', 'Vercel', 'Render', 'JWT + bcrypt'].map(t => (
            <span key={t} style={{
              fontSize: '12px', padding: '4px 12px', borderRadius: '20px',
              background: T.goldPale, color: '#7a5a00',
              border: `1px solid rgba(201,168,76,0.3)`, fontWeight: 500
            }}>{t}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FAQ({ setPage }) {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'What is the difference between snowball and avalanche?', a: 'Snowball pays off your smallest balance first, giving you quick wins and momentum. Avalanche pays off your highest interest rate first, which saves the most money overall. Both strategies roll the freed-up payment into the next debt once one is paid off.' },
    { q: 'Do I need to link my bank account?', a: 'No. The Loan Payoff Accelerator uses only data you enter manually. We never connect to your bank, access your accounts, or store any sensitive financial credentials.' },
    { q: 'How do I find my loan details?', a: "For federal student loans, log into studentaid.gov. For credit cards, check your monthly statement's Interest Charge Calculation box. For auto loans and mortgages, check your original loan agreement. For BNPL (Klarna, Affirm, Afterpay), open the provider's app and view your active payment plans." },
    { q: 'What does the what-if simulator do?', a: 'Enter an extra monthly payment amount and the app instantly recalculates your payoff date, how many months you save, and how much total interest you avoid paying. The chart updates in real time.' },
    { q: 'How do I track BNPL debt like Klarna or Affirm?', a: 'Select BNPL as the debt type. Enter your remaining balance and the number of payments left — the app will auto-calculate your monthly payment. Interest rate is usually 0% for BNPL plans.' },
    { q: 'Can I edit a debt after adding it?', a: "Yes — click the Edit button on any debt in your list. You can update the balance, rate, term, and payment. For fixed-term loans the minimum payment will auto-recalculate when you change the term." },
    { q: 'What is the consolidation comparison tool?', a: 'The Consolidate tab lets you enter a proposed consolidation loan rate and term. It calculates your new monthly payment and compares total interest and payoff time against your current avalanche strategy side by side.' },
    { q: 'Is my data private?', a: 'Yes. Your debt data is stored in a MongoDB Atlas database encrypted at rest with AES-256. All data in transit is encrypted via HTTPS. We never share your data with third parties.' },
    { q: 'How accurate are the calculations?', a: 'The calculations use standard amortization formulas: monthly interest = balance x (annual rate / 12). Results assume fixed interest rates and consistent minimum payments. Actual results may vary.' },
    { q: 'What happens if I refresh the page?', a: 'Your debts are saved to your account in the database and persist across sessions. As long as you are logged in, your data will be there when you come back.' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div className="fade-up" style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '11px', color: T.gold, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Help center</div>
        <div style={{ fontSize: '32px', fontFamily: 'DM Serif Display, serif', color: T.navy, marginBottom: '8px' }}>FAQ & How-To Guide</div>
        <div style={{ fontSize: '15px', color: T.slate }}>Everything you need to get started and make the most of the app.</div>
      </div>

      <SectionLabel>Getting started</SectionLabel>
      <Card className="fade-up-1" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden' }}>
        {[
          { num: '1', title: 'Create an account', detail: 'Click Register on the login screen and enter your email and a password.' },
          { num: '2', title: 'Add your debts', detail: "Enter each debt — name, balance, interest rate, minimum payment, and type. For BNPL, enter remaining installments instead." },
          { num: '3', title: 'Pick a strategy', detail: 'Choose Snowball or Avalanche. The app shows payoff timeline and total interest for each side by side.' },
          { num: '4', title: 'Use the what-if simulator', detail: 'Enter an extra monthly payment to see how much faster you pay off debt and how much interest you save.' },
          { num: '5', title: 'Compare consolidation', detail: 'Go to the Consolidate tab to see if a consolidation loan would save you money vs your current strategy.' },
        ].map(({ num, title, detail }, i, arr) => (
          <div key={num} style={{
            display: 'flex', gap: '16px', padding: '16px 20px',
            borderBottom: i < arr.length - 1 ? `1px solid ${T.borderLight}` : 'none',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '30px', height: '30px', flexShrink: 0,
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: T.navy }}>{num}</span>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: T.navy, marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: T.slate, lineHeight: 1.6 }}>{detail}</div>
            </div>
          </div>
        ))}
      </Card>

      <SectionLabel>Frequently asked questions</SectionLabel>
      <Card className="fade-up-2" style={{ padding: 0, overflow: 'hidden' }}>
        {faqs.map(({ q, a }, i) => (
          <div key={i} style={{ borderBottom: i < faqs.length - 1 ? `1px solid ${T.borderLight}` : 'none' }}>
            <div onClick={() => setOpen(open === i ? null : i)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', cursor: 'pointer',
              background: open === i ? 'rgba(201,168,76,0.04)' : 'transparent',
              transition: 'background 0.15s'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: T.navy, paddingRight: '1rem' }}>{q}</span>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: open === i ? T.gold : 'transparent',
                border: `1px solid ${open === i ? T.gold : T.borderLight}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s'
              }}>
                <span style={{ fontSize: '16px', color: open === i ? T.navy : T.muted, lineHeight: 1 }}>{open === i ? '−' : '+'}</span>
              </div>
            </div>
            {open === i && (
              <div style={{ padding: '0 20px 16px 56px', fontSize: '13px', color: T.slate, lineHeight: 1.8 }}>{a}</div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

function Consolidate({ debts }) {
  const [consolidation, setConsolidation] = useState({ rate: '', termMonths: '' });

  const totalBalance = debts.reduce((sum, d) => sum + parseFloat(d.balance || 0), 0);

  function calcConsolidated() {
    const r = parseFloat(consolidation.rate) / 100 / 12;
    const n = parseInt(consolidation.termMonths);
    const p = totalBalance;
    if (!r || !n || !p) return null;
    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = payment * n;
    const totalInterest = totalPaid - p;
    return { payment, totalPaid, totalInterest, months: n };
  }

  const consolidated = calcConsolidated();
  const currentAvalanche = debts.length ? calcPayoff(debts, 'avalanche') : null;
  const interestSaved = consolidated && currentAvalanche ? currentAvalanche.totalInterest - consolidated.totalInterest : null;
  const monthsDiff = consolidated && currentAvalanche ? currentAvalanche.months - consolidated.months : null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div className="fade-up" style={{
        background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
        borderRadius: '20px', padding: '2rem',
        border: `1px solid rgba(201,168,76,0.2)`,
        marginBottom: '2rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,168,76,0.06)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '11px', color: T.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Decision tool</div>
        <div style={{ fontSize: '28px', fontFamily: 'DM Serif Display, serif', color: T.white, marginBottom: '8px' }}>Debt consolidation comparison</div>
        <div style={{ fontSize: '14px', color: '#c8d6e5', lineHeight: 1.7 }}>
          Enter a proposed consolidation loan rate and term. The app will calculate your new monthly payment and compare total interest and payoff time against your current avalanche strategy.
        </div>
        <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '13px', color: T.muted }}>
          Total balance to consolidate: <span style={{ color: T.gold, fontWeight: 600 }}>${Math.round(totalBalance).toLocaleString()}</span>
        </div>
      </div>

      {debts.length === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e2e2', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: T.slate, fontSize: '14px' }}>
          Add debts on the Dashboard first to use the consolidation comparison.
        </div>
      )}

      {debts.length > 0 && (
        <>
          <SectionLabel>Proposed consolidation terms</SectionLabel>
          <Card style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: T.slate, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Consolidation interest rate (%)</label>
                <input type="number" step="0.01" placeholder="e.g. 9.99" value={consolidation.rate}
                  onChange={e => setConsolidation({ ...consolidation, rate: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e2e2', borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: T.slate, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Loan term (months)</label>
                <input type="number" placeholder="e.g. 60" value={consolidation.termMonths}
                  onChange={e => setConsolidation({ ...consolidation, termMonths: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e2e2', borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
                <div style={{ fontSize: '11px', color: T.muted, marginTop: '4px' }}>36 = 3yr · 60 = 5yr · 84 = 7yr</div>
              </div>
            </div>
          </Card>

          {consolidated && currentAvalanche && (
            <>
              <SectionLabel>Side-by-side comparison</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(15,35,64,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Current strategy (avalanche)</div>
                  {[
                    { label: 'Payoff time', value: currentAvalanche.months + ' months' },
                    { label: 'Total interest', value: '$' + Math.round(currentAvalanche.totalInterest).toLocaleString() },
                    { label: 'Number of debts', value: debts.length + ' separate debts' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(15,35,64,0.06)', fontSize: '14px' }}>
                      <span style={{ color: T.slate }}>{label}</span>
                      <span style={{ fontWeight: 600, color: T.navy }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>Consolidation loan</div>
                  {[
                    { label: 'Monthly payment', value: '$' + Math.round(consolidated.payment).toLocaleString() },
                    { label: 'Payoff time', value: consolidated.months + ' months' },
                    { label: 'Total interest', value: '$' + Math.round(consolidated.totalInterest).toLocaleString() },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '14px' }}>
                      <span style={{ color: '#c8d6e5' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: T.white }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <SectionLabel>Verdict</SectionLabel>
              <Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ background: interestSaved > 0 ? '#d8f3dc' : '#fadbd8', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: interestSaved > 0 ? '#1a5c36' : '#922b21', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Interest {interestSaved > 0 ? 'saved' : 'added'} by consolidating
                    </div>
                    <div style={{ fontSize: '26px', fontFamily: 'DM Serif Display, serif', fontWeight: 600, color: interestSaved > 0 ? '#1a5c36' : '#922b21' }}>
                      {interestSaved > 0 ? '-' : '+'}${Math.abs(Math.round(interestSaved)).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ background: monthsDiff > 0 ? '#d8f3dc' : '#fadbd8', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: monthsDiff > 0 ? '#1a5c36' : '#922b21', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Time {monthsDiff > 0 ? 'saved' : 'added'} by consolidating
                    </div>
                    <div style={{ fontSize: '26px', fontFamily: 'DM Serif Display, serif', fontWeight: 600, color: monthsDiff > 0 ? '#1a5c36' : '#922b21' }}>
                      {monthsDiff > 0 ? '-' : '+'}{Math.abs(monthsDiff)} months
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '12px', color: T.muted, lineHeight: 1.6 }}>
                  Disclaimer: This comparison assumes a fixed consolidation rate and does not account for origination fees, prepayment penalties, or changes to your credit profile. Consult a licensed financial advisor before making consolidation decisions.
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Dashboard({ debts, addDebt, removeDebt, updateDebt, strategy, setStrategy, extra, setExtra, setPage }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const snowball = debts.length ? calcPayoff(debts, 'snowball') : null;
  const avalanche = debts.length ? calcPayoff(debts, 'avalanche') : null;
  const whatIf = debts.length ? calcWhatIf(debts, strategy, extra) : null;

  const totalBalance = debts.reduce((sum, d) => sum + parseFloat(d.balance || 0), 0);
  const highestRate = debts.length ? Math.max(...debts.map(d => parseFloat(d.rate || 0))) : 0;
  const totalMin = debts.reduce((sum, d) => sum + parseFloat(d.minPayment || 0), 0);

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e2e2e2', borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { fontSize: '11px', fontWeight: 600, color: T.slate, display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {debts.length === 0 && (
        <div style={{
          background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
          borderRadius: '16px', padding: '2rem',
          border: `1px solid rgba(201,168,76,0.2)`,
          marginBottom: '2rem', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,168,76,0.06)', pointerEvents: 'none' }} />
          <div style={{ fontSize: '11px', color: T.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Getting started</div>
          <div style={{ fontSize: '22px', fontFamily: 'DM Serif Display, serif', color: T.white, marginBottom: '10px' }}>Welcome to your debt dashboard</div>
          <div style={{ fontSize: '14px', color: '#c8d6e5', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Add each of your debts below — credit cards, student loans, auto loans, mortgages, or BNPL balances. Once you have at least one debt entered, the app will show you a personalized payoff strategy and timeline.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { step: '1', text: 'Add your debts below' },
              { step: '2', text: 'Pick snowball or avalanche' },
              { step: '3', text: 'Use the what-if simulator' },
            ].map(({ step, text }) => (
              <div key={step} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: T.navy }}>{step}</span>
                </div>
                <span style={{ fontSize: '13px', color: '#c8d6e5' }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', fontSize: '12px', color: T.muted }}>
            Not sure where to find your loan details?{' '}
            <span style={{ color: T.gold, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setPage('faq')}>Check the FAQ page</span> for a guide by debt type.
          </div>
        </div>
      )}

      {debts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '2rem' }}>
          <StatCard label="Total balance" value={'$' + Math.round(totalBalance).toLocaleString()} sub={`${debts.length} active debt${debts.length !== 1 ? 's' : ''}`} />
          <StatCard label="Monthly minimums" value={'$' + Math.round(totalMin).toLocaleString()} sub="across all accounts" delay="-1" />
          <StatCard label="Highest APR" value={highestRate + '%'} sub="annual interest rate" delay="-2" />
        </div>
      )}

      <SectionLabel>Add a debt</SectionLabel>
      <div className="fade-up" style={{ marginBottom: '2rem' }}>
        <DebtForm onAdd={addDebt} />
      </div>

      {debts.length > 0 && (
        <>
          <SectionLabel>Your debts</SectionLabel>
          <div className="fade-up-1" style={{ background: T.cardBg, border: `1px solid ${T.borderLight}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem', backdropFilter: 'blur(8px)' }}>
            {debts.map((d, i) => {
              const tc = TYPE_COLORS[d.type] || TYPE_COLORS['Other'];
              const isEditing = editingId === d._id;

              return (
                <div key={d._id}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '13px 18px',
                    borderBottom: isEditing ? `1px solid ${T.gold}` : i < debts.length - 1 ? `1px solid ${T.borderLight}` : 'none',
                    background: isEditing ? 'rgba(201,168,76,0.04)' : 'transparent'
                  }}>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: tc.bg, color: tc.color, flexShrink: 0, whiteSpace: 'nowrap' }}>{d.type}</span>
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: T.navy }}>{d.name}</span>
                    <span style={{ fontSize: '13px', color: T.slate, minWidth: '80px', textAlign: 'right' }}>${parseFloat(d.balance).toLocaleString()}</span>
                    {d.type === 'BNPL'
                      ? <span style={{ fontSize: '13px', color: T.muted, minWidth: '110px', textAlign: 'right' }}>{d.installmentsRemaining ? `${d.installmentsRemaining} payments left` : '0% APR'}</span>
                      : <span style={{ fontSize: '13px', color: T.muted, minWidth: '70px', textAlign: 'right' }}>{d.rate}% APR</span>
                    }
                    {d.termMonths && <span style={{ fontSize: '12px', color: T.muted, minWidth: '50px', textAlign: 'right' }}>{d.termMonths}mo</span>}
                    <button
                      onClick={() => {
                        setEditingId(isEditing ? null : d._id);
                        setEditForm({ name: d.name, balance: d.balance, rate: d.rate, minPayment: d.minPayment, type: d.type, termMonths: d.termMonths || '', installmentsRemaining: d.installmentsRemaining || '' });
                      }}
                      style={{ background: 'none', border: `1px solid ${isEditing ? T.gold : 'rgba(15,35,64,0.2)'}`, borderRadius: '6px', color: isEditing ? T.gold : T.slate, fontSize: '12px', padding: '3px 10px' }}>
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    <button onClick={() => removeDebt(d._id)} style={{ background: 'none', border: `1px solid rgba(146,43,33,0.2)`, borderRadius: '6px', color: T.danger, fontSize: '12px', padding: '3px 10px' }}>Remove</button>
                  </div>

                  {isEditing && (
                    <div style={{ padding: '1.25rem', borderBottom: i < debts.length - 1 ? `1px solid ${T.borderLight}` : 'none', background: 'rgba(201,168,76,0.03)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Debt name</label>
                          <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Balance ($)</label>
                          <input type="number" min="0" value={editForm.balance}
                            onChange={e => setEditForm({ ...editForm, balance: Math.max(0, parseFloat(e.target.value) || 0) })}
                            style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Interest rate (%)</label>
                          <input type="number" step="0.01" value={editForm.rate}
                            onChange={e => setEditForm({ ...editForm, rate: e.target.value })}
                            style={inputStyle} />
                        </div>
                        {editForm.type === 'BNPL' && (
                          <div>
                            <label style={labelStyle}>Payments remaining</label>
                            <input type="number" min="1" value={editForm.installmentsRemaining || ''}
                              onChange={e => {
                                const remaining = parseInt(e.target.value) || '';
                                const newMin = remaining && editForm.balance
                                  ? (parseFloat(editForm.balance) / remaining).toFixed(2)
                                  : editForm.minPayment;
                                setEditForm({ ...editForm, installmentsRemaining: remaining, minPayment: newMin });
                              }}
                              style={inputStyle} />
                          </div>
                        )}
                        {editForm.termMonths !== undefined && editForm.type !== 'BNPL' && (
                          <div>
                            <label style={labelStyle}>Remaining term (months)</label>
                            <input type="number" value={editForm.termMonths}
                              onChange={e => {
                                const term = parseInt(e.target.value) || '';
                                const rate = parseFloat(editForm.rate) / 100;
                                const bal = parseFloat(editForm.balance);
                                let newMin = editForm.minPayment;
                                if (term && rate && bal) {
                                  const r = rate / 12;
                                  newMin = ((bal * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1)).toFixed(2);
                                }
                                setEditForm({ ...editForm, termMonths: term, minPayment: newMin });
                              }}
                              style={inputStyle} />
                          </div>
                        )}
                        <div>
                          <label style={labelStyle}>Min. payment ($/mo)</label>
                          <input type="number" value={editForm.minPayment}
                            onChange={e => setEditForm({ ...editForm, minPayment: e.target.value })}
                            style={{ ...inputStyle, background: '#f0faf4' }} />
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await updateDebt(d._id, editForm);
                          setEditingId(null);
                        }}
                        style={{
                          width: '100%', padding: '10px',
                          background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
                          color: '#fff', border: 'none', borderRadius: '10px',
                          fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                        }}>Save changes</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <SectionLabel>Choose a strategy</SectionLabel>
          <div className="fade-up-2" style={{ marginBottom: '2rem' }}>
            <StrategyPicker strategy={strategy} setStrategy={setStrategy} snowballResult={snowball} avalancheResult={avalanche} />
          </div>

          <SectionLabel>What-if simulator</SectionLabel>
          <div className="fade-up-3" style={{ marginBottom: '2rem' }}>
            <WhatIfSimulator result={whatIf} extra={extra} setExtra={setExtra} />
          </div>

          <SectionLabel>Payoff timeline</SectionLabel>
          <div className="fade-up-4">
            <PayoffChart baseline={whatIf?.baselineBalances} accelerated={whatIf?.acceleratedBalances} />
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const { token, email, logout } = useAuth();
  const [debts, setDebts] = useState([]);
  const [strategy, setStrategy] = useState('avalanche');
  const [extra, setExtra] = useState(0);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    if (token) api.get('/api/debts').then(res => setDebts(res.data));
  }, [token]);

  async function addDebt(debt) {
    const res = await api.post('/api/debts', debt);
    setDebts(res.data);
  }

  async function removeDebt(id) {
    const res = await api.delete(`/api/debts/${id}`);
    setDebts(res.data);
  }

  async function updateDebt(id, data) {
    const res = await api.put(`/api/debts/${id}`, data);
    setDebts(res.data);
  }

  if (!token) return <Landing />;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: '100vh', background: T.cream }}>
        <NavBar page={page} setPage={setPage} email={email} logout={logout} />
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at 20% 20%, rgba(201,168,76,0.04) 0%, transparent 60%),
                       radial-gradient(ellipse at 80% 80%, rgba(15,35,64,0.06) 0%, transparent 60%)`,
          pointerEvents: 'none', zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {page === 'dashboard' && <Dashboard debts={debts} addDebt={addDebt} removeDebt={removeDebt} updateDebt={updateDebt} strategy={strategy} setStrategy={setStrategy} extra={extra} setExtra={setExtra} setPage={setPage} />}
          {page === 'consolidate' && <Consolidate debts={debts} />}
          {page === 'about' && <About />}
          {page === 'faq' && <FAQ setPage={setPage} />}
        </div>
      </div>
    </>
  );
}