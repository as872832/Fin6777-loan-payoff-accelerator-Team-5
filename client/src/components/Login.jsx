import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const T = {
  navy: '#0f2340', navyMid: '#1a3a5c', navyLight: '#1e4d7a',
  gold: '#c9a84c', goldLight: '#e8c97a', goldPale: '#fdf3dc',
  white: '#ffffff', slate: '#4a5568', muted: '#8896a8',
  danger: '#922b21', dangerBg: '#fadbd8',
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
  .fade-up { animation: fadeUp 0.6s ease both; }
  .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
  .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
  .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
  .fade-up-4 { animation: fadeUp 0.6s 0.4s ease both; }
  .fade-up-5 { animation: fadeUp 0.6s 0.5s ease both; }
  .float { animation: float 4s ease-in-out infinite; }
  .hero-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .hero-btn { transition: all 0.2s; }
  .outline-btn:hover { background: rgba(255,255,255,0.1) !important; }
  .outline-btn { transition: all 0.2s; }
  .feature-card:hover { transform: translateY(-3px); border-color: rgba(201,168,76,0.4) !important; }
  .feature-card { transition: all 0.2s; }
  input:focus { border-color: ${T.gold} !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12) !important; outline: none; }
`;

function AuthModal({ mode, onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(mode === 'register');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      isRegister ? await register(form.email, form.password) : await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,35,64,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease'
      }}>
      <div style={{
        background: T.white, borderRadius: '20px', padding: '2rem',
        width: '100%', maxWidth: '400px',
        border: `1px solid rgba(201,168,76,0.2)`,
        animation: 'fadeUp 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '22px', fontFamily: 'DM Serif Display, serif', color: T.navy }}>
            {isRegister ? 'Create an account' : 'Welcome back'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', color: T.muted, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: T.slate, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
            <input type="email" placeholder="you@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: T.slate, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }} />
          </div>
          {error && <div style={{ fontSize: '13px', color: T.danger, background: T.dangerBg, padding: '10px 14px', borderRadius: '8px' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{
            marginTop: '4px', padding: '12px',
            background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
            color: T.white, border: 'none', borderRadius: '10px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.7 : 1
          }}>{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}</button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '13px', color: T.slate }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{
            background: 'none', border: 'none', color: T.navyMid,
            fontWeight: 600, fontSize: '13px', cursor: 'pointer', marginLeft: '5px',
            fontFamily: 'DM Sans, sans-serif'
          }}>{isRegister ? 'Sign in' : 'Register free'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [modal, setModal] = useState(null);

  const features = [
    { icon: '◎', title: 'Snowball vs avalanche', desc: 'Compare both strategies side by side. See exactly how much interest each one saves and when you become debt-free.' },
    { icon: '◉', title: 'What-if simulator', desc: 'Enter any extra monthly payment amount and watch your payoff date and interest savings update instantly.' },
    { icon: '◈', title: 'Fixed-term loan support', desc: 'Auto-calculates required payments for mortgages and auto loans based on your balance, rate, and remaining term.' },
    { icon: '◇', title: 'BNPL tracking', desc: 'Track Klarna, Affirm, and Afterpay installment plans alongside your other debts in one unified dashboard.' },
    { icon: '▣', title: 'Consolidation comparison', desc: 'See whether consolidating your debts would save you money vs your current payoff strategy — side by side.' },
    { icon: '◬', title: 'No bank link required', desc: 'Enter your numbers manually. We never connect to your bank, access your accounts, or share your data.' },
  ];

  const steps = [
    { num: '1', title: 'Add your debts', desc: 'Enter each debt — balance, interest rate, minimum payment, and type. Takes about 2 minutes.' },
    { num: '2', title: 'Pick a strategy', desc: 'Choose snowball or avalanche. Compare payoff dates and total interest side by side.' },
    { num: '3', title: 'Run the simulator', desc: 'Enter any extra monthly amount and see your new payoff date and interest savings instantly.' },
  ];

  return (
    <>
      <style>{styles}</style>
      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} />}

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(15,35,64,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ width: '16px', height: '16px', border: '2.5px solid #fff', borderRadius: '50%' }} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, color: T.white, fontFamily: 'DM Serif Display, serif' }}>Loan Payoff Accelerator</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="outline-btn" onClick={() => setModal('login')} style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px', padding: '7px 18px',
            color: T.white, fontSize: '13px', fontFamily: 'DM Sans, sans-serif'
          }}>Sign in</button>
          <button className="hero-btn" onClick={() => setModal('register')} style={{
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
            border: 'none', borderRadius: '8px', padding: '8px 18px',
            color: T.navy, fontSize: '13px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif'
          }}>Get started free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: `linear-gradient(160deg, ${T.navy} 0%, ${T.navyMid} 50%, ${T.navyLight} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '7rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(201,168,76,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,168,76,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '15%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '720px', position: 'relative' }}>
          <div className="fade-up" style={{
            display: 'inline-block', fontSize: '11px', fontWeight: 600,
            color: T.gold, textTransform: 'uppercase', letterSpacing: '0.12em',
            background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '20px', padding: '5px 16px', marginBottom: '1.5rem'
          }}>
            FIN 6777 · Team 5 · UCF FinTech Program
          </div>

          <div className="fade-up-1" style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontFamily: 'DM Serif Display, serif',
            color: T.white, lineHeight: 1.15, marginBottom: '1.25rem'
          }}>
            Pay off your debt<br /><em style={{ color: T.gold }}>smarter and faster</em>
          </div>

          <div className="fade-up-2" style={{
            fontSize: '18px', color: '#c8d6e5', lineHeight: 1.7,
            marginBottom: '2.5rem', maxWidth: '520px', margin: '0 auto 2.5rem'
          }}>
            Free debt payoff calculator with snowball vs avalanche strategy comparison, real-time what-if simulator, and BNPL tracking. No bank link required.
          </div>

          <div className="fade-up-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button className="hero-btn" onClick={() => setModal('register')} style={{
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
              border: 'none', borderRadius: '12px', padding: '14px 32px',
              color: T.navy, fontSize: '15px', fontWeight: 700,
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
            }}>Get started free</button>
            <button className="outline-btn" onClick={() => setModal('login')} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px', padding: '14px 32px',
              color: T.white, fontSize: '15px',
              fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
            }}>Sign in</button>
          </div>

          {/* HERO STATS */}
          <div className="fade-up-4" style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { value: '$0', label: 'Cost to use' },
              { value: '2 min', label: 'To get started' },
              { value: '0', label: 'Bank links needed' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontFamily: 'DM Serif Display, serif', color: T.gold, fontWeight: 600 }}>{value}</div>
                <div style={{ fontSize: '12px', color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#faf8f4', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '11px', color: T.gold, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px', fontWeight: 600 }}>How it works</div>
            <div style={{ fontSize: '34px', fontFamily: 'DM Serif Display, serif', color: T.navy }}>Up and running in minutes</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {steps.map(({ num, title, desc }) => (
              <div key={num} style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <div style={{
                  width: '52px', height: '52px', margin: '0 auto 1.25rem',
                  background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: T.navy, fontFamily: 'DM Serif Display, serif' }}>{num}</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: T.navy, marginBottom: '8px' }}>{title}</div>
                <div style={{ fontSize: '14px', color: T.slate, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: T.white, padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '11px', color: T.gold, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px', fontWeight: 600 }}>Features</div>
            <div style={{ fontSize: '34px', fontFamily: 'DM Serif Display, serif', color: T.navy }}>Everything you need to get debt-free</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card" style={{
                background: '#faf8f4', borderRadius: '16px', padding: '1.5rem',
                border: '1px solid rgba(15,35,64,0.08)'
              }}>
                <div style={{ fontSize: '22px', color: T.gold, marginBottom: '12px' }}>{icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: T.navy, marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: T.slate, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
        padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -60, left: '20%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,168,76,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, right: '15%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(201,168,76,0.04)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '36px', fontFamily: 'DM Serif Display, serif', color: T.white, marginBottom: '1rem', lineHeight: 1.2 }}>
            Ready to take control<br />of your debt?
          </div>
          <div style={{ fontSize: '16px', color: '#c8d6e5', marginBottom: '2rem', lineHeight: 1.6 }}>
            Free to use. No bank link. No subscription. Just clear answers in minutes.
          </div>
          <button className="hero-btn" onClick={() => setModal('register')} style={{
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
            border: 'none', borderRadius: '12px', padding: '14px 40px',
            color: T.navy, fontSize: '16px', fontWeight: 700,
            fontFamily: 'DM Sans, sans-serif', cursor: 'pointer'
          }}>Create your free account</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: T.navy, padding: '2rem',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ fontSize: '13px', color: T.muted }}>FIN 6777 · Team 5 · UCF FinTech Program · Spring 2026</div>
        <div style={{ fontSize: '12px', color: T.muted }}>Educational tool only — not licensed financial advice</div>
      </footer>
    </>
  );
}