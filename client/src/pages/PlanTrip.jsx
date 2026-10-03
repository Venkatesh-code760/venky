import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Compass, 
  Send, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const INTEREST_OPTIONS = [
  { id: 'beaches', label: 'Beaches & Ocean', icon: '🏖️' },
  { id: 'nature', label: 'Nature & Scenery', icon: '🌲' },
  { id: 'adventure', label: 'Adventure Sports', icon: '🧗' },
  { id: 'food', label: 'Culinary & Dining', icon: '🍲' },
  { id: 'history', label: 'History & Forts', icon: '🏰' },
  { id: 'culture', label: 'Temples & Culture', icon: '🛕' },
  { id: 'shopping', label: 'Bazaars & Shopping', icon: '🛍️' },
  { id: 'relaxation', label: 'Spa & Relaxation', icon: '🧘' }
];

const PlanTrip = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Mode: Form vs Natural Language Prompt
  const [activeTab, setActiveTab] = useState('form');

  // Form State
  const [destination, setDestination] = useState(searchParams.get('dest') || 'Goa');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(18000);
  const [travelers, setTravelers] = useState(2);
  const [travelPace, setTravelPace] = useState('moderate');
  const [selectedInterests, setSelectedInterests] = useState(['beaches', 'nature', 'food']);
  const [naturalPrompt, setNaturalPrompt] = useState('');

  // Execution State
  const [generating, setGenerating] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState(null);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const destParam = searchParams.get('dest');
    if (destParam) {
      setDestination(destParam);
    }
  }, [searchParams]);

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(item => item !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setNaturalPrompt(promptText);
    setActiveTab('prompt');
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSaveSuccess(false);

    if (activeTab === 'form' && (!destination || !days || !budget)) {
      setError('Please provide destination, trip duration, and budget.');
      return;
    }

    if (activeTab === 'prompt' && !naturalPrompt.trim()) {
      setError('Please type your natural language trip request.');
      return;
    }

    try {
      setGenerating(true);
      const payload = activeTab === 'prompt'
        ? { naturalLanguagePrompt: naturalPrompt }
        : {
            destination,
            days: parseInt(days, 10),
            budget: parseInt(budget, 10),
            travelers: parseInt(travelers, 10),
            travelPace,
            interests: selectedInterests
          };

      const res = await api.post('/trips/generate', payload);

      if (res.data?.success) {
        setGeneratedTrip(res.data.data);
      } else {
        setError(res.data?.message || 'Failed to generate itinerary. Please retry.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error communicating with AI engine.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!generatedTrip) return;
    try {
      setGenerating(true);
      const res = await api.post('/trips', generatedTrip);
      if (res.data?.success) {
        setSaveSuccess(true);
        const tripId = res.data.data._id || res.data.data.id;
        setTimeout(() => {
          navigate(`/trips/${tripId}`);
        }, 1200);
      }
    } catch (err) {
      setError('Failed to save trip to database: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FR3 & FR6: AI Travel Itinerary Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Where Do You Want to Journey?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Our rule-based AI engine analyzes opening hours, transit proximity, budget, and interests to compose a tailored itinerary.
        </p>
      </div>

      {/* Input Mode Selector */}
      <div className="flex justify-center">
        <div className="bg-slate-200/80 p-1 rounded-xl flex items-center space-x-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'form'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Structured Parameters
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'prompt'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✨ Natural Language Prompt (FR3)
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center space-x-2 max-w-2xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Configuration Card */}
      {!generatedTrip && (
        <Card className="max-w-3xl mx-auto shadow-md border-slate-200/90" hover={false}>
          {activeTab === 'form' ? (
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Destination & Quick Selects */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Destination Name
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Goa, Kerala, Jaipur, Manali..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-xs text-slate-900 outline-none transition-all font-semibold"
                  />
                </div>
                {/* Quick destination tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">Quick Pick:</span>
                  {['Goa', 'Kerala', 'Jaipur', 'Manali'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDestination(d)}
                      className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors ${
                        destination.toLowerCase() === d.toLowerCase()
                          ? 'bg-sky-100 text-sky-800 border-sky-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Days, Budget, Travelers, Pace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Duration (Days)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      min="1"
                      max="14"
                      required
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Total Budget (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      step="500"
                      min="2000"
                      required
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Travelers Count
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Travel Pace
                  </label>
                  <select
                    value={travelPace}
                    onChange={(e) => setTravelPace(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="relaxed">Relaxed (Slow)</option>
                    <option value="moderate">Moderate</option>
                    <option value="packed">Packed (Action)</option>
                  </select>
                </div>
              </div>

              {/* Interests Multi-Select (FR3.2) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Interests & Themes (SRS 3.2)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INTEREST_OPTIONS.map((item) => {
                    const isSelected = selectedInterests.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleInterest(item.id)}
                        className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-sky-50 text-sky-800 border-sky-300 ring-1 ring-sky-400/40 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={generating}
                className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-sky-600/25 hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {generating ? (
                  <span>Generating AI Itinerary...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Day-by-Day Itinerary (FR6)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Natural Language Query Mode (FR3) */
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Enter Natural Language Travel Prompt
                </label>
                <p className="text-xs text-slate-500">
                  Describe your trip in plain English. The AI extractor will automatically parse destination, duration, budget, and group size!
                </p>
                <textarea
                  rows="4"
                  value={naturalPrompt}
                  onChange={(e) => setNaturalPrompt(e.target.value)}
                  placeholder="e.g. Plan a 3-day budget trip to Goa for two people under ₹18,000 focusing on beaches and local seafood..."
                  className="w-full p-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-xs text-slate-900 outline-none leading-relaxed transition-all"
                />
              </div>

              {/* Quick Prompt Templates */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Or click an example prompt:
                </p>
                <div className="space-y-1 text-xs">
                  {[
                    'Plan a 5-day budget trip to Goa for two people with adventure sports',
                    'Plan a 3-day relaxed cultural trip to Kerala with backwaters for couple',
                    'Plan a 4-day heritage tour to Jaipur for 2 travelers under ₹20,000'
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNaturalPrompt(p)}
                      className="block w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 transition-colors"
                    >
                      " {p} "
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-sky-600/25 hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {generating ? (
                  <span>Extracting & Generating Itinerary...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Submit Natural-Language Request</span>
                  </>
                )}
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Loading Overlay */}
      {generating && (
        <Card className="max-w-xl mx-auto shadow-xl" hover={false}>
          <Loader message="AI Planning Engine Active: Generating Itinerary..." />
        </Card>
      )}

      {/* Generated Itinerary Preview Banner */}
      {generatedTrip && !generating && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Itinerary Ready</span>
              </div>
              <h2 className="text-2xl font-black">{generatedTrip.destination} — {generatedTrip.days} Days Expedition</h2>
              <p className="text-xs text-emerald-100">
                Estimated Cost: ₹{generatedTrip.budgetSummary?.totalEstimated?.toLocaleString()} | Stated Budget: ₹{generatedTrip.budget?.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setGeneratedTrip(null)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors"
              >
                Change Inputs
              </button>

              <button
                onClick={handleSaveTrip}
                disabled={saveSuccess}
                className="px-6 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center space-x-2"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Saved! Redirecting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Save & Open Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Schedule Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedTrip.itineraryDays?.slice(0, 3).map((day) => (
              <Card key={day.dayNumber} className="border-slate-200" hover={false}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold">
                  <span className="text-sky-600">Day {day.dayNumber}</span>
                  <span className="text-slate-500">{day.weatherSummary?.temp || '28°C'} ☀️</span>
                </div>
                <div className="mt-3 space-y-2">
                  {day.activities?.slice(0, 3).map((act, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="font-semibold text-slate-800 truncate">{act.name}</p>
                      <p className="text-[10px] text-slate-400">{act.timeSlot} • ₹{act.estimatedCost}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTrip;
