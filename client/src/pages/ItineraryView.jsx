import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import MapView from '../components/MapView';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Sparkles, 
  CloudSun, 
  Umbrella, 
  Share2, 
  Download, 
  Check, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' or 'map'
  const [optimizing, setOptimizing] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trips/${id}`);
      if (res.data?.data) {
        setTrip(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching trip:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  // Status update (Planned -> On-going -> Completed per FR8)
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.put(`/trips/${id}`, { status: newStatus });
      if (res.data?.data) {
        setTrip({ ...trip, status: newStatus });
        setFeedbackMsg(`Trip status updated to ${newStatus}`);
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Re-optimize route & budget per FR8
  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      const res = await api.post(`/trips/${id}/optimize`);
      if (res.data?.data) {
        setTrip(res.data.data);
        setFeedbackMsg('Route & budget successfully re-optimized with minimized transit!');
        setTimeout(() => setFeedbackMsg(''), 3500);
      }
    } catch (err) {
      console.error('Error optimizing trip:', err);
    } finally {
      setOptimizing(false);
    }
  };

  // Move activity up / down
  const handleMoveActivity = async (dayIndex, actIndex, direction) => {
    const updatedDays = [...trip.itineraryDays];
    const targetActivities = [...updatedDays[dayIndex].activities];
    const targetIdx = direction === 'up' ? actIndex - 1 : actIndex + 1;

    if (targetIdx < 0 || targetIdx >= targetActivities.length) return;

    // Swap
    const temp = targetActivities[actIndex];
    targetActivities[actIndex] = targetActivities[targetIdx];
    targetActivities[targetIdx] = temp;

    updatedDays[dayIndex].activities = targetActivities;

    setTrip({ ...trip, itineraryDays: updatedDays });

    // Persist to backend
    try {
      await api.put(`/trips/${id}`, { itineraryDays: updatedDays });
    } catch (err) {
      console.warn('Sync warning:', err);
    }
  };

  // Delete activity
  const handleDeleteActivity = async (dayIndex, actIndex) => {
    if (!window.confirm('Remove this stop from itinerary?')) return;
    const updatedDays = [...trip.itineraryDays];
    updatedDays[dayIndex].activities.splice(actIndex, 1);
    setTrip({ ...trip, itineraryDays: updatedDays });

    try {
      await api.put(`/trips/${id}`, { itineraryDays: updatedDays });
      setFeedbackMsg('Activity removed from schedule');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      console.warn('Sync error:', err);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <Loader message="Fetching customized day-by-day itinerary..." fullScreen />;
  }

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Trip Plan Not Found</h2>
        <p className="text-xs text-slate-500">The requested trip could not be found or was removed.</p>
        <Link to="/plan" className="inline-block px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold">
          Create New Trip Plan
        </Link>
      </div>
    );
  }

  const currentDayData = trip.itineraryDays?.find(d => d.dayNumber === selectedDay) || trip.itineraryDays?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                FR6: AI Itinerary Engine
              </span>
              <select
                value={trip.status || 'Planned'}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-slate-800/90 text-xs font-bold text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 outline-none"
              >
                <option value="Planned">Status: Planned</option>
                <option value="On-going">Status: On-going</option>
                <option value="Completed">Status: Completed</option>
              </select>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {trip.destination} Expedition
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>{trip.days} Days Schedule</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Budget: ₹{trip.budget?.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Pace: {trip.travelPace || 'Moderate'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Export PDF, Share, Re-optimize) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOptimize}
              disabled={optimizing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-colors"
              title="Re-run route & budget optimization"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${optimizing ? 'animate-spin text-sky-400' : ''}`} />
              <span>{optimizing ? 'Optimizing...' : 'Re-Optimize (FR8)'}</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-extrabold shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Trip</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Timeline View (FR6)
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Interactive Map & Route (FR3.8)
            </button>
          </div>

          <Link
            to="/budget"
            className="hidden sm:flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold"
          >
            <span>View Budget Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Day Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {trip.itineraryDays?.map((d) => (
          <button
            key={d.dayNumber}
            onClick={() => setSelectedDay(d.dayNumber)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
              selectedDay === d.dayNumber
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Day {d.dayNumber}</span>
            {d.weatherSummary && (
              <span className="text-[11px] text-amber-400">{d.weatherSummary.temp}</span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {activeTab === 'map' ? (
        <div className="space-y-6">
          <MapView 
            coordinates={trip.routeCoordinates || []} 
            destination={trip.destination} 
            selectedDay={selectedDay}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Day Title & Weather Strip */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {currentDayData?.title || `Day ${selectedDay}: Exploration`}
              </h2>
              <p className="text-xs text-slate-500">
                Optimized sequence based on morning opening hours and travel distances.
              </p>
            </div>

            {/* Weather Widget */}
            {currentDayData?.weatherSummary && (
              <div className="flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                <CloudSun className="w-4 h-4 text-amber-600" />
                <span>{currentDayData.weatherSummary.condition} ({currentDayData.weatherSummary.temp})</span>
              </div>
            )}
          </div>

          {/* Activity Cards List */}
          <div className="space-y-4">
            {currentDayData?.activities?.map((act, index) => {
              const dayIdx = trip.itineraryDays.findIndex(d => d.dayNumber === selectedDay);
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:border-sky-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                            {act.timeSlot}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {act.category}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            {act.matchScore || 88}% Match Score (FR5)
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {act.name}
                        </h3>
                      </div>
                    </div>

                    {/* Cost & Reordering Actions */}
                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Est. Cost</p>
                        <p className="text-sm font-black text-slate-800">₹{act.estimatedCost?.toLocaleString()}</p>
                      </div>

                      {/* Reorder & Delete controls per FR8 */}
                      <div className="flex items-center space-x-1 border-l border-slate-200 pl-3">
                        <button
                          onClick={() => handleMoveActivity(dayIdx, index, 'up')}
                          disabled={index === 0}
                          title="Move Earlier"
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveActivity(dayIdx, index, 'down')}
                          disabled={index === currentDayData.activities.length - 1}
                          title="Move Later"
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(dayIdx, index)}
                          title="Delete Activity"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Rationale & Details */}
                  {act.rationale && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      💡 <span className="font-semibold text-slate-700">AI Rationale:</span> {act.rationale}
                    </p>
                  )}

                  {/* Weather Backup & Alternatives Accordion / Badges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    {act.alternatives && act.alternatives.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-700">Alternative: {act.alternatives[0].name}</p>
                          <p className="text-[11px] text-slate-500">{act.alternatives[0].reason} (~₹{act.alternatives[0].cost})</p>
                        </div>
                      </div>
                    )}

                    {act.weatherBackup && (
                      <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start space-x-2">
                        <Umbrella className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sky-900">Rain/Heat Backup: {act.weatherBackup.suggestedActivity}</p>
                          <p className="text-[11px] text-sky-700">Recommended indoor alternative during rainy intervals.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Share Modal Dialog */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share AI Itinerary (FR8)"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Send this customized trip link to your travel companions. They can view the day-by-day plan, hotel spots, and interactive map!
          </p>

          <div className="flex items-center space-x-2 p-2 bg-slate-100 rounded-xl border border-slate-200">
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="bg-transparent w-full text-xs text-slate-700 outline-none truncate font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shrink-0 transition-colors flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItineraryView;
