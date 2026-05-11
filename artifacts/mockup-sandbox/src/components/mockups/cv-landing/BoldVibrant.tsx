import React, { useState } from 'react';
import { 
  Zap, Sparkles, Layout, Code2, Globe, ChevronRight, CheckCircle2, 
  ArrowRight, Activity, Play, Star, Shield
} from 'lucide-react';
import './_group_bold.css';

export function BoldVibrant() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-['Outfit',sans-serif]" dir="auto">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">CV-Mister</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-50 transition-colors">Features</a>
            <a href="#templates" className="hover:text-zinc-50 transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-zinc-50 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-medium hover:text-fuchsia-400 transition-colors">
              Log in
            </button>
            <button className="px-5 py-2.5 rounded-full bg-zinc-50 text-zinc-950 text-sm font-bold hover:bg-zinc-200 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bv-grid-pattern">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-fuchsia-400 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
              </span>
              CV-Mister 2.0 is live
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-8 leading-[1.1]">
              STAND OUT IN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 bv-animate-gradient">
                MILLISECONDS
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              The AI-powered, ATS-friendly resume builder for driven professionals. 
              Build a resume that feels alive.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold text-lg hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.5)] transition-all hover:-translate-y-1">
                Build Your Resume Now
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> View Demo
              </button>
            </div>
          </div>

          {/* Builder Mockup */}
          <div className="mt-24 relative max-w-5xl mx-auto bv-animate-float">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-30 bv-glow"></div>
            <div className="relative rounded-2xl bg-zinc-900 border border-white/10 p-2 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-950/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="flex-1 text-center text-xs font-mono text-zinc-500">app.cv-mister.com/editor</div>
              </div>
              <div className="flex flex-col md:flex-row h-[400px] md:h-[600px] bg-zinc-950">
                {/* Editor Sidebar */}
                <div className="w-full md:w-80 border-e border-white/5 p-6 space-y-6 hidden md:block">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                    <div className="h-10 w-full bg-zinc-900 border border-white/10 rounded-lg"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                    <div className="h-24 w-full bg-zinc-900 border border-white/10 rounded-lg"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="h-10 flex-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg flex items-center justify-center text-sm font-medium">Auto-Enhance</div>
                      <div className="h-10 w-10 bg-zinc-900 border border-white/10 rounded-lg"></div>
                    </div>
                  </div>
                </div>
                {/* Live Preview Area */}
                <div className="flex-1 bg-zinc-900/50 p-6 flex items-center justify-center relative overflow-hidden bv-diagonal-stripe">
                  <div className="w-full max-w-lg aspect-[1/1.4] bg-white rounded shadow-xl p-8 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                    <div className="h-8 w-48 bg-zinc-200 rounded mb-4"></div>
                    <div className="h-4 w-full bg-zinc-100 rounded mb-2"></div>
                    <div className="h-4 w-3/4 bg-zinc-100 rounded mb-8"></div>
                    
                    <div className="h-6 w-32 bg-zinc-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-16 w-full bg-zinc-50 border border-zinc-100 rounded"></div>
                      <div className="h-16 w-full bg-zinc-50 border border-zinc-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Marquee */}
      <div className="border-y border-white/10 bg-zinc-900/50 py-6 overflow-hidden flex whitespace-nowrap">
        <div className="flex gap-12 px-6 animate-[marquee_20s_linear_infinite] items-center text-zinc-400 font-display text-xl uppercase tracking-widest font-bold">
          <span className="flex items-center gap-3"><Activity className="text-fuchsia-500" /> 100K+ Resumes Generated</span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center gap-3"><Sparkles className="text-indigo-500" /> AI-Powered Content</span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center gap-3"><Globe className="text-pink-500" /> Full RTL Support</span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center gap-3"><Activity className="text-fuchsia-500" /> 100K+ Resumes Generated</span>
          <span className="text-zinc-700">•</span>
          <span className="flex items-center gap-3"><Sparkles className="text-indigo-500" /> AI-Powered Content</span>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
              ENGINEERED FOR <br />
              <span className="text-fuchsia-400">IMPACT</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-xl">
              We stripped away the complexity and built a kinetic, fast-flowing builder that gets out of your way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Layout, title: 'ATS-Optimized', desc: 'Templates structured specifically for parsing engines without sacrificing modern aesthetics.', color: 'from-blue-500 to-indigo-500' },
              { icon: Zap, title: 'Real-time Preview', desc: 'See every keystroke instantly translated to your final polished PDF document.', color: 'from-fuchsia-500 to-pink-500' },
              { icon: Code2, title: 'Markdown Support', desc: 'Write fast using standard markdown syntax. No clunky WYSIWYG editors required.', color: 'from-emerald-500 to-teal-500' },
              { icon: Globe, title: 'Native RTL', desc: 'Flawless Arabic and RTL language support built into the core, not bolted on.', color: 'from-amber-500 to-orange-500' },
              { icon: Sparkles, title: 'AI Assistant', desc: 'Hit a wall? Our AI helps you phrase bullet points to highlight your actual impact.', color: 'from-violet-500 to-purple-500' },
              { icon: Shield, title: 'Privacy First', desc: 'Your data never trains our models. Export and delete whenever you want.', color: 'from-rose-500 to-red-500' },
            ].map((feature, i) => (
              <div key={i} className="group relative p-8 rounded-2xl bg-zinc-900/50 border border-white/10 hover:bg-zinc-900 transition-colors overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <feature.icon className="w-32 h-32 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 bg-zinc-900 relative border-y border-white/5 bv-radial-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-8">
                THE OLD WAY IS <br/>
                <span className="text-zinc-600 line-through">BROKEN</span>
              </h2>
              <div className="space-y-6">
                {[
                  { old: 'Fiddling with Word tables for hours', new: 'Perfect layout automatically' },
                  { old: 'Generic phrasing that sounds like everyone else', new: 'AI-tailored impact statements' },
                  { old: 'Templates that ATS robots cannot read', new: '100% parseable standard structures' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-white/5">
                    <div className="flex-1 text-zinc-500 line-through">{item.old}</div>
                    <ArrowRight className="hidden sm:block text-zinc-700 w-5 h-5" />
                    <div className="flex-1 text-fuchsia-400 font-medium">{item.new}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-indigo-600 blur-[100px] opacity-20"></div>
              <div className="relative aspect-square rounded-full border border-white/10 flex items-center justify-center p-8 bv-grid-pattern">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white text-zinc-950 mb-4 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                    <Zap className="w-10 h-10 fill-current" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white">Generate<br/>in minutes</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-zinc-950 opacity-40"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-8 text-white">
            READY TO LEVEL UP?
          </h2>
          <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who are landing their dream roles faster. No credit card required to start.
          </p>
          <button className="px-10 py-5 rounded-full bg-white text-zinc-950 font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Create Your Resume Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="font-display font-bold tracking-tight">CV-Mister</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300">Terms</a>
            <a href="#" className="hover:text-zinc-300">Privacy</a>
            <a href="#" className="hover:text-zinc-300">Contact</a>
          </div>
          <p className="text-zinc-600 text-sm">© 2024 CV-Mister. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
