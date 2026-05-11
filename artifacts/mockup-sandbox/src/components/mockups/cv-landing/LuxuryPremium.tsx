import React, { useEffect, useState } from 'react';
import './_group.css';
import { ArrowRight, ChevronRight, Check, Play } from 'lucide-react';

export function LuxuryPremium() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-navy text-cream font-jakarta overflow-x-hidden selection:bg-gold selection:text-navy">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-navy/90 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="text-2xl font-playfair font-semibold tracking-wide">
            CV<span className="text-gold">Mister.</span>
          </div>
          <div className="hidden md:flex gap-10 text-sm tracking-widest uppercase opacity-80">
            <a href="#" className="hover:text-gold transition-colors">Philosophy</a>
            <a href="#" className="hover:text-gold transition-colors">Templates</a>
            <a href="#" className="hover:text-gold transition-colors">Pricing</a>
          </div>
          <div>
            <button className="text-xs uppercase tracking-widest border border-gold/30 hover:border-gold px-6 py-3 rounded-none transition-all duration-300 hover:bg-gold hover:text-navy">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-navy/50 to-navy z-10" />
          <img 
            src="/__mockup/images/cv-luxury-hero.png" 
            alt="Luxury Resume Background" 
            className="w-full h-full object-cover object-center opacity-40"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8 animate-fade-in">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-xs uppercase tracking-widest text-gold">The Standard in Professional Presentation</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair leading-tight mb-8 animate-fade-up delay-100">
              Your career,<br />
              <span className="italic text-gold/90">masterfully</span><br />
              curated.
            </h1>
            <p className="text-lg md:text-xl font-light opacity-70 leading-relaxed mb-12 max-w-lg animate-fade-up delay-200">
              CV-Mister transforms your trajectory into an ATS-optimized editorial masterpiece. For the ambitious professional who demands distinction.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 animate-fade-up delay-300">
              <button className="group flex items-center justify-center gap-4 bg-gold text-navy px-8 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-white transition-colors duration-500">
                Craft Your Resume
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-4 px-8 py-4 text-sm uppercase tracking-widest font-medium border border-cream/20 hover:border-gold transition-colors duration-500">
                <Play className="w-4 h-4 text-gold" />
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-y border-cream/5 bg-navy">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <p className="text-xs uppercase tracking-widest text-gold/60 mb-12">Trusted by professionals at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale">
            {/* Logos represented by stylized text for mockup purposes */}
            <span className="font-playfair text-2xl font-bold">Goldman Sachs</span>
            <span className="font-playfair text-2xl italic">McKinsey</span>
            <span className="font-sans text-xl font-bold tracking-tighter">VOGUE</span>
            <span className="font-serif text-2xl">Condé Nast</span>
            <span className="font-sans text-xl font-medium tracking-widest">SOTHEBY'S</span>
          </div>
        </div>
      </section>

      {/* Feature 1: The Design */}
      <section className="py-32 bg-cream text-navy relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -left-12 -top-12 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <img 
              src="/__mockup/images/cv-luxury-preview.png" 
              alt="Resume Preview" 
              className="w-full h-[600px] object-cover shadow-2xl relative z-10"
            />
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-gold text-sm tracking-widest uppercase">01 / The Aesthetic</div>
            </div>
            <h2 className="text-4xl md:text-6xl font-playfair mb-8 leading-tight">
              Designed like <br/><span className="italic">fine print.</span>
            </h2>
            <p className="text-lg text-navy/70 leading-relaxed mb-10 max-w-md">
              We studied decades of editorial layout and financial reporting to create templates that command authority. Perfect typography, intentional whitespace, and a grid that naturally guides the eye.
            </p>
            <ul className="space-y-6">
              {[
                "Algorithmically perfectly balanced whitespace",
                "Curated premium serif and sans-serif pairings",
                "ATS-compliant invisible structure"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 bg-navy text-gold p-1 rounded-full"><Check className="w-3 h-3" /></div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature 2: The Intelligence */}
      <section className="py-32 bg-navy relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-gold text-sm tracking-widest uppercase">02 / The Intelligence</div>
            </div>
            <h2 className="text-4xl md:text-6xl font-playfair mb-8 leading-tight">
              Quietly <br/><span className="italic text-gold">brilliant.</span>
            </h2>
            <p className="text-lg text-cream/70 leading-relaxed mb-10 max-w-md">
              Beneath the elegant exterior lies a ruthless ATS optimization engine. Our AI refines your accomplishments, ensuring your brilliance isn't just seen by humans, but understood by algorithms.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors uppercase tracking-widest text-sm font-semibold">
              Explore the technology <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="relative">
            <img 
              src="/__mockup/images/cv-luxury-details.png" 
              alt="Luxury Details" 
              className="w-full aspect-square object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Testimonial / Quote */}
      <section className="py-40 bg-[#0A0D18] relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-gold text-6xl font-playfair mb-8">"</div>
          <h3 className="text-3xl md:text-5xl font-playfair leading-relaxed mb-12 italic">
            I uploaded my standard Word document, and CV-Mister returned an artifact that made me look like the executive I aspire to be. The result felt less like a resume and more like a biography.
          </h3>
          <p className="uppercase tracking-widest text-sm text-cream/60">
            <span className="text-gold font-semibold">Eleanor V.</span> — Managing Director
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-cream text-navy text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-playfair mb-8">
            Begin your <br/>next chapter.
          </h2>
          <p className="text-xl text-navy/70 mb-12 font-light">
            Join the exclusive cadre of professionals presenting their best selves.
          </p>
          <button className="bg-navy text-gold px-12 py-5 text-sm uppercase tracking-widest font-semibold hover:bg-gold hover:text-navy transition-colors duration-500">
            Create Your Profile
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy pt-24 pb-12 px-6 md:px-12 border-t border-cream/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-playfair font-semibold tracking-wide mb-6">
              CV<span className="text-gold">Mister.</span>
            </div>
            <p className="text-cream/50 max-w-sm text-sm leading-relaxed">
              Curating careers for the extraordinary. We believe your professional presentation should reflect the caliber of your work.
            </p>
          </div>
          <div>
            <h4 className="text-gold text-xs uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-cream/70">
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Optimization</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold text-xs uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-cream/70">
              <li><a href="#" className="hover:text-white transition-colors">Philosophy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-cream/10 text-xs text-cream/40 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} CV-Mister. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-gold transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
