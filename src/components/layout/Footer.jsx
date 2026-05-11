import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                CV
              </div>
              <span className="font-heading font-bold text-xl text-slate-900">
                Mister
              </span>
            </Link>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Build your professional resume in minutes. AI-powered, ATS-friendly, and beautifully designed.
            </p>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-slate-900 mb-4 uppercase tracking-wider text-sm">Features</h3>
            <ul className="space-y-3">
              <li><Link to="/builder" className="text-slate-500 hover:text-primary-600 transition-colors">Resume Builder</Link></li>
              <li><Link to="/templates" className="text-slate-500 hover:text-primary-600 transition-colors">CV Templates</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary-600 transition-colors">ATS Checker</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary-600 transition-colors">Cover Letters</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-slate-900 mb-4 uppercase tracking-wider text-sm">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-slate-500 hover:text-primary-600 transition-colors">Career Blog</Link></li>
              <li><Link to="/about" className="text-slate-500 hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary-600 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-slate-900 mb-4 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-slate-500 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-primary-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CV-Mister. All rights reserved.
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            {/* Social Icons Placeholder */}
            <a href="#" className="text-slate-400 hover:text-primary-600">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-primary-600">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-primary-600">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
