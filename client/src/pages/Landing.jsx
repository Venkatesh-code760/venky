import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Sliders, 
  Zap,
  Layers
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleInstantDemo = async () => {
    await quickDemoLogin();
    navigate('/plan');
  };

  const features = [
    {
      icon: Sparkles,
      color: 'from-sky-500 to-blue-600',
      title: 'FR3 & FR6: AI Itinerary Engine',
      description: 'Generates day-by-day itineraries with morning-to-night time slots, activities, meal places, and weather backups.'
    },
    {
      icon: Sliders,
      color: 'from-indigo-500 to-purple-600',
      title: 'FR5: Smart Match Scoring (0-100)',
      description: 'Multi-criteria scoring algorithm weighting interests (40%), budget fit (20%), rating (15%), proximity (15%), and weather (10%).'
    },
    {
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      title: 'FR7: Category Budget Optimization',
      description: 'Real-time category breakdown (transport, stay, food, activities) with budget alerts and money-saving alternatives.'
    },
    {
      icon: Bot,
      color: 'from-amber-500 to-orange-600',
      title: 'FR9: Context-Aware Travel Assistant',
      description: 'Natural language AI assistant that answers logistics questions, suggests vegetarian spots, and adapts itinerary pacing.'
    },
    {
      icon: MapPin,
      color: 'from-rose-500 to-pink-600',
      title: 'FR4 & FR8: Places, Maps & Management',
      description: 'Interactive route mapping, open-hours verification, like/dismiss feedback learning, and drag-and-drop itinerary editing.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-400/20 via-indigo-500/20 to-purple-400/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>MERN Stack Architecture • SRS Specification 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Personalized Travel Itineraries <br />
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Engineered with AI Precision
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Eliminate manual trip research. Enter your destination, budget, and travel preferences to generate optimized day-by-day schedules, route maps, and hotel/food recommendations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/plan"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg shadow-sky-600/25 hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create AI Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleInstantDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>One-Click Demo Launch</span>
            </button>
          </div>

          {/* Key Trust Signals */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero API Keys Needed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Free Tier Guaranteed</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>In-Memory & LocalStorage Resilient</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Preview Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700/80 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-sky-950 text-sky-400 border border-sky-800 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Live Itinerary Demonstration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Try a Sample 3-Day Plan for Goa or Kerala
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Test our natural language prompt parsing: <br />
                <span className="text-sky-300 italic">"Plan a 3-day budget trip to Goa for two people under ₹15,000"</span>
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => navigate('/plan?dest=Goa')}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow transition-colors"
                >
                  Explore Goa Plan →
                </button>
                <button
                  onClick={() => navigate('/plan?dest=Kerala')}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  Explore Kerala Plan →
                </button>
              </div>
            </div>

            {/* Mock Schedule Widget Preview */}
            <div className="w-full lg:w-96 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-bold text-sky-400">Day 1: Coastal Heritage & Sun</span>
                <span className="text-slate-400">29°C ☀️</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200">09:00 AM • Baga Golden Beach</p>
                    <p className="text-[10px] text-slate-400">Morning watersports & relaxation</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    96% Match
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200">12:30 PM • Fisherman's Wharf</p>
                    <p className="text-[10px] text-slate-400">Authentic Goan kingfish thali</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-400 border border-sky-800 font-bold">
                    92% Match
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200">03:00 PM • Aguada Portuguese Fort</p>
                    <p className="text-[10px] text-slate-400">Coastal bastion & lighthouse</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold">
                    94% Match
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core SRS Modules Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest">
            Specification Compliance
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
            5 Core SRS Functional Modules
          </p>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Strictly built according to the AI Travel Planner Software Requirements Specification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all space-y-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Landing;
