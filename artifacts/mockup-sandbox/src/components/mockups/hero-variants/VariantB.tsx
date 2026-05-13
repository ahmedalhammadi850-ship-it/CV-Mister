export function VariantB() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navbar */}
      <header style={{ borderBottom: '1px solid #f1f5f9', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4f46e5,#c026d3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>CV</div>
          <span style={{ fontWeight: 700, fontSize: 20, color: '#0f172a' }}>Mister</span>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          {['Home','Templates','About'].map(l => <a key={l} style={{ padding: '6px 16px', borderRadius: 8, fontSize: 14, color: l==='Home'?'#4f46e5':'#64748b', background: l==='Home'?'#eef2ff':'transparent', fontWeight: 500, textDecoration: 'none' }}>{l}</a>)}
        </nav>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Log in</a>
          <a style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg,#4f46e5,#c026d3)', borderRadius: 12, padding: '8px 20px', textDecoration: 'none' }}>Get started free</a>
        </div>
      </header>

      {/* Hero - two column layout */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '60px 80px', gap: 80 }}>

        {/* Left: text */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)', border: '1px solid #ddd6fe', borderRadius: 999, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed' }}>✦ AI-Powered Resume Builder</span>
          </div>

          <h1 style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.08, color: '#0f172a', margin: '0 0 20px', letterSpacing: '-1.5px' }}>
            Your best CV<br />
            <span style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 45%,#c026d3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>is waiting for you</span>
          </h1>

          <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 440 }}>
            Join 50,000+ professionals who built their resumes with us and landed their dream jobs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            <a style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 16, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(79,70,229,0.3)', width: 'fit-content' }}>
              <span style={{ fontSize: 18 }}>+</span> Build your resume — free
            </a>
            <a style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px', borderRadius: 16, background: '#fff', border: '1.5px solid #e2e8f0', color: '#334155', fontWeight: 600, fontSize: 16, textDecoration: 'none', width: 'fit-content' }}>
              View templates →
            </a>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Professional templates','ATS-optimized','Instant PDF','Arabic & English'].map(f => (
              <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 999, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: 12, fontWeight: 500 }}>
                ✓ {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right: floating CV card */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {/* Shadow blob */}
          <div style={{ position: 'absolute', width: 380, height: 480, borderRadius: 32, background: 'linear-gradient(135deg,rgba(79,70,229,0.08),rgba(192,38,211,0.08))', filter: 'blur(40px)', transform: 'translate(20px,20px)' }} />

          {/* CV Card */}
          <div style={{ width: 340, background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'relative' }}>
            {/* CV Header */}
            <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', padding: '28px 24px 24px' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff' }}>A</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Ahmed Al-Rashid</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Senior Product Designer</div>
                </div>
              </div>
            </div>
            {/* CV Body */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>Experience</div>
              {[['Google','UX Lead · 2021–Now'],['Meta','Product Designer · 2019–21']].map(([c,r]) => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>{c[0]}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{c}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{r}</div>
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase', marginTop: 12 }}>Skills</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Figma','React','TypeScript','UX Research'].map(s => (
                  <span key={s} style={{ padding: '3px 10px', borderRadius: 999, background: '#eef2ff', color: '#4f46e5', fontSize: 11, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div style={{ position: 'absolute', bottom: 40, right: 10, background: '#fff', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🎉</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Interview booked!</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>2 hours ago</div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats bar */}
      <div style={{ borderTop: '1px solid #f1f5f9', padding: '24px 80px', display: 'flex', gap: 48, justifyContent: 'center' }}>
        {[['50K+','Resumes built'],['98%','ATS pass rate'],['4.9★','User rating']].map(([v,l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#4f46e5,#c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
