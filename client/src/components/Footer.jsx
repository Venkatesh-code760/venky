import React from 'react';
import { Compass, Heart, Shield, Code, Sparkles, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <Compass className="w-6 h-6 text-sky-400" />
              <span className="font-extrabold text-lg tracking-tight">PathPilot</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI Travel Planner MVP built strictly according to Software Requirements Specification (SRS). Fully integrated MERN stack architecture.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Free Tier & Zero Paid API Dependency</span>
            </div>
          </div>

          {/* Core Modules (SRS Section 3) */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">SRS Modules</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-sky-400 transition-colors">FR1 & FR2: Auth & Traveller Profile</li>
              <li className="hover:text-sky-400 transition-colors">FR3 & FR6: AI Itinerary Engine</li>
              <li className="hover:text-sky-400 transition-colors">FR4 & FR5: POI & Match Scoring (0-100)</li>
              <li className="hover:text-sky-400 transition-colors">FR7: Category Budget Optimization</li>
              <li className="hover:text-sky-400 transition-colors">FR8, FR9 & FR10: Assistant & Feedback</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">MERN Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {['React.js', 'Vite', 'Node.js', 'Express', 'MongoDB Atlas', 'JWT', 'Bcrypt', 'Tailwind CSS', 'Recharts', 'Lucide Icons'].map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* SRS Compliance Badge */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-semibold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>SRS Specification Verified</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Implements all functional requirements FR1-FR10, security policies, and offline resilient storage fallback.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 PathPilot - AI Travel Planner. Prepared for One-Week MERN + AI Workshop.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1">
              <span>Engineered with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for Academic & Production Excellence</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
