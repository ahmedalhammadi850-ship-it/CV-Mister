import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/50 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-200/50 blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-8 animate-fade-in border border-primary-100">
            <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
            ATS-Friendly Resume Builder
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-slate-900 mb-6 tracking-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Land your dream job with a <br className="hidden md:block"/>
            <span className="heading-gradient">stunning resume</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Create professional, ATS-compliant resumes in minutes. Choose from premium templates, customize colors, and export to PDF.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/builder" className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
              Build Your Resume Now
            </Link>
            <Link to="/templates" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
              View Templates
            </Link>
          </div>
          
          {/* Mockup Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="glass-panel p-4 rounded-2xl">
              <div className="bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 aspect-[16/9] flex items-center justify-center relative">
                {/* Abstract visualization of a resume builder */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200"></div>
                <div className="w-[80%] h-[90%] bg-white shadow-card rounded-lg flex overflow-hidden z-10">
                  <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-4 hidden md:block">
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-white border border-slate-200 rounded mb-2"></div>
                    <div className="h-8 bg-white border border-slate-200 rounded mb-2"></div>
                    <div className="h-8 bg-white border border-slate-200 rounded mb-2"></div>
                  </div>
                  <div className="flex-1 p-8">
                    <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4 mb-8"></div>
                    <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-4/5 mb-8"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="h-16 bg-slate-50 border border-slate-100 rounded w-full mb-4"></div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute top-10 -right-10 w-24 h-24 bg-accent-400 rounded-full blur-2xl opacity-50 animate-float"></div>
                <div className="absolute bottom-10 -left-10 w-32 h-32 bg-primary-400 rounded-full blur-2xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
