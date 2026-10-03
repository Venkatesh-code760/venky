import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { BudgetPieChart, BudgetComparisonBarChart } from '../components/Charts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Sliders, 
  Info,
  Car,
  Home,
  Utensils,
  Ticket,
  HelpCircle
} from 'lucide-react';

const BudgetPlanner = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [loading, setLoading] = useState(true);

  // Custom Simulator Parameters
  const [customDays, setCustomDays] = useState(3);
  const [customTravelers, setCustomTravelers] = useState(2);
  const [customBudget, setCustomBudget] = useState(18000);
  const [stayCategory, setStayCategory] = useState('boutique'); // 'hostel', 'boutique', 'luxury'

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      if (res.data?.data && res.data.data.length > 0) {
        setTrips(res.data.data);
        setSelectedTripId(res.data.data[0]._id || res.data.data[0].id);
      }
    } catch (err) {
      console.warn('Trip fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const activeTrip = trips.find(t => (t._id || t.id) === selectedTripId);

  // Dynamic simulation calculator
  const stayCostMap = { hostel: 1100, boutique: 2600, luxury: 12000 };
  const dailyStay = stayCostMap[stayCategory] || 2600;

  const simTransport = Math.round(customDays * 450 * customTravelers);
  const simAccom = Math.round(customDays * dailyStay);
  const simFood = Math.round(customDays * 700 * customTravelers);
  const simActivities = Math.round(customDays * 600 * customTravelers);
  const simMisc = Math.round(customBudget * 0.05);

  const simTotalEstimated = simTransport + simAccom + simFood + simActivities + simMisc;
  const isOverBudget = simTotalEstimated > customBudget;
  const diff = Math.abs(customBudget - simTotalEstimated);

  const budgetSummary = {
    transport: simTransport,
    accommodation: simAccom,
    food: simFood,
    activities: simActivities,
    miscellaneous: simMisc,
    totalEstimated: simTotalEstimated,
    userBudget: customBudget,
    difference: customBudget - simTotalEstimated,
    isOverBudget
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>FR7: Category Budget Estimation & Optimization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Trip Expense Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Breakdown across transport, accommodation, food, and activities with automated over-budget warnings.
          </p>
        </div>

        {/* Existing Trip Selector if available */}
        {trips.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-600">Active Plan:</span>
            <select
              value={selectedTripId}
              onChange={(e) => {
                setSelectedTripId(e.target.value);
                const t = trips.find(item => (item._id || item.id) === e.target.value);
                if (t) {
                  setCustomDays(t.days || 3);
                  setCustomTravelers(t.travelers || 2);
                  setCustomBudget(t.budget || 18000);
                }
              }}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 shadow-xs"
            >
              {trips.map(t => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.destination} ({t.days} Days - ₹{t.budget?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* FR7 Pricing Disclosure Note */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong className="font-bold">SRS Requirement 3.5 & FR7:</strong> Estimated prices are predictive estimates designed for travel budget planning and not verified checkout rates.
        </p>
      </div>

      {/* Budget Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200" hover={false}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Stated Target Budget</span>
            <DollarSign className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">₹{customBudget.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-1">For {customTravelers} Travelers ({customDays} Days)</p>
        </Card>

        <Card className="border-slate-200" hover={false}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Estimated Total Cost</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <p className={`text-2xl font-black ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
            ₹{simTotalEstimated.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">All categories inclusive</p>
        </Card>

        <Card className="border-slate-200" hover={false}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Budget Status</span>
            {isOverBudget ? (
              <TrendingUp className="w-4 h-4 text-rose-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <p className={`text-lg font-black ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isOverBudget ? `Over by ₹${diff.toLocaleString()}` : `Surplus ₹${diff.toLocaleString()}`}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {isOverBudget ? 'Requires optimization' : 'Comfortably within limit'}
          </p>
        </Card>

        <Card className="border-slate-200" hover={false}>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Est. Cost Per Day</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{Math.round(simTotalEstimated / customDays).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">₹{Math.round(simTotalEstimated / (customDays * customTravelers)).toLocaleString()} / traveler / day</p>
        </Card>
      </div>

      {/* FR7 Alert: Over Budget Warning Banner */}
      {isOverBudget ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start space-x-3 text-xs text-rose-900 shadow-sm animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-rose-950">
              Budget Warning (FR7): Estimated Cost Exceeds Stated Budget by ₹{diff.toLocaleString()}
            </h4>
            <p className="text-rose-700 leading-relaxed">
              <strong>Cost-Saving Alternatives:</strong> Switch accommodation tier to "Backpacker Hostel / Homestay" to immediately save ₹{Math.round(simAccom * 0.45).toLocaleString()}, rent a two-wheeler instead of cabs to save ₹{Math.round(simTransport * 0.4).toLocaleString()}, and sample authentic street food thalis for lunch!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3 text-xs text-emerald-900 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Budget Verified:</span> Your trip budget is in healthy standing with a projected surplus of ₹{diff.toLocaleString()}.
          </div>
        </div>
      )}

      {/* Charts & Simulation Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactive Simulation Sliders */}
        <Card className="border-slate-200 space-y-6" hover={false}>
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Interactive Budget Simulator</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Trip Duration</span>
                <span>{customDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={customDays}
                onChange={(e) => setCustomDays(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Travelers</span>
                <span>{customTravelers} People</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={customTravelers}
                onChange={(e) => setCustomTravelers(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Target Budget (₹)</span>
                <span>₹{customBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="80000"
                step="2500"
                value={customBudget}
                onChange={(e) => setCustomBudget(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Accommodation Style</label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                {[
                  { id: 'hostel', label: 'Hostel', rate: '₹1.1k' },
                  { id: 'boutique', label: 'Boutique', rate: '₹2.6k' },
                  { id: 'luxury', label: 'Luxury', rate: '₹12k' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setStayCategory(item.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      stayCategory === item.id
                        ? 'bg-sky-50 text-sky-800 border-sky-400 font-bold ring-1 ring-sky-400/30'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.rate}/nt</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800">Category Allocations:</h4>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5"><Car className="w-3.5 h-3.5 text-sky-600" /> <span>Transport</span></span>
                <span className="font-bold">₹{simTransport.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5"><Home className="w-3.5 h-3.5 text-indigo-600" /> <span>Stay (Hotels)</span></span>
                <span className="font-bold">₹{simAccom.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5"><Utensils className="w-3.5 h-3.5 text-emerald-600" /> <span>Food & Dining</span></span>
                <span className="font-bold">₹{simFood.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5"><Ticket className="w-3.5 h-3.5 text-amber-600" /> <span>Activities</span></span>
                <span className="font-bold">₹{simActivities.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5"><HelpCircle className="w-3.5 h-3.5 text-pink-600" /> <span>Miscellaneous</span></span>
                <span className="font-bold">₹{simMisc.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Columns: Recharts Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200" hover={false}>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Category Expense Distribution (FR7)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Visual proportion of your travel budget across core expenditure sectors.
            </p>
            <BudgetPieChart budgetSummary={budgetSummary} />
          </Card>

          <Card className="border-slate-200" hover={false}>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Target Budget vs. AI Estimated Cost
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Direct comparative analysis against your specified target threshold.
            </p>
            <BudgetComparisonBarChart budgetSummary={budgetSummary} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
