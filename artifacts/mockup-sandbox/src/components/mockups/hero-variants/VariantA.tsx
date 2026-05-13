export function VariantA() {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navbar */}
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 48px' }}>
        <div style={{ maxWidth: 720, width: '100%', textAlign: 'center' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 999, padding: '6px 16px', marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>AI-Powered Resume Builder</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.05, color: '#0f172a', margin: '0 0 24px', letterSpacing: '-2px' }}>
            Land your<br />
            <span style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#c026d3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dream job</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, margin: '0 auto 40px', maxWidth: 520 }}>
            Create a professional, ATS-optimized resume in minutes. Premium templates, full customization, instant PDF export.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 56 }}>
            <a style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 16, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 32px rgba(79,70,229,0.35)' }}>
              ✦ Build your resume — free
            </a>
            <a style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 16, background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#334155', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              View templates →
            </a>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            {['Professional templates','ATS-optimized','Instant PDF export','Arabic & English'].map(f => (
              <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 999, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: 13, fontWeight: 500 }}>
                <span style={{ color: '#4f46e5' }}>✓</span> {f}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'inline-flex', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
            {[['50K+','Resumes built'],['98%','ATS pass rate'],['4.9★','User rating']].map(([v,l],i) => (
              <div key={l} style={{ padding: '20px 36px', textAlign: 'center', borderRight: i < 2 ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ fontSize: 24, fontWeight: 900, background: 'linear-gradient(135deg,#4f46e5,#c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, whiteSpace: 'nowrap' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
