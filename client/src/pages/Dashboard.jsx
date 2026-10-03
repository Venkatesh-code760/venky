import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plus, 
  ArrowRight, 
  Trash2, 
  Copy, 
  Clock, 
  Users, 
  Sparkles,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      if (res.data?.data) {
        setTrips(res.data.data);
      }
    } catch (err) {
      console.warn('Trips fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (e, tripId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this trip plan?')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(trips.filter(t => (t._id || t.id) !== tripId));
      setFeedbackMsg('Trip deleted successfully');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDuplicate = async (e, trip) => {
    e.stopPropagation();
    try {
      const copyData = {
        ...trip,
        destination: `${trip.destination} (Copy)`,
        _id: undefined,
        id: undefined,
        status: 'Planned'
      };
      const res = await api.post('/trips', copyData);
      if (res.data?.data) {
        setTrips([res.data.data, ...trips]);
        setFeedbackMsg('Trip duplicated successfully!');
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch (err) {
      console.error('Duplicate error:', err);
    }
  };

  const filteredTrips = statusFilter === 'All' 
    ? trips 
    : trips.filter(t => t.status === statusFilter);

  const totalDaysPlanned = trips.reduce((acc, t) => acc + (t.days || 0), 0);
  const totalBudgetPlanned = trips.reduce((acc, t) => acc + (t.budget || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Traveler Command Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Explorer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your AI-crafted journeys, view day-by-day itineraries, and monitor trip budgets.
          </p>
        </div>

        <Link
          to="/plan"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Saved Itineraries</p>
            <p className="text-2xl font-black text-slate-800">{trips.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Days Planned</p>
            <p className="text-2xl font-black text-slate-800">{totalDaysPlanned} Days</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Budget Tracked</p>
            <p className="text-2xl font-black text-slate-800">₹{totalBudgetPlanned.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        {['All', 'Planned', 'On-going', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === status
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {status} ({status === 'All' ? trips.length : trips.filter(t => t.status === status).length})
          </button>
        ))}
      </div>

      {/* Saved Trips Grid */}
      {loading ? (
        <Loader message="Loading your personalized travel plans..." />
      ) : filteredTrips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No {statusFilter !== 'All' ? statusFilter : ''} Trips Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Start by entering your dream destination, budget, and travel companions to generate an AI itinerary in seconds.
          </p>
          <Link
            to="/plan"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate First Trip</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const tripId = trip._id || trip.id;
            return (
              <Card
                key={tripId}
                className="flex flex-col justify-between group border-slate-200/90 relative"
                onClick={() => navigate(`/trips/${tripId}`)}
              >
                <div>
                  {/* Status Badge & Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      trip.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : trip.status === 'On-going'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}>
                      {trip.status || 'Planned'}
                    </span>

                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleDuplicate(e, trip)}
                        title="Duplicate Trip (FR8)"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, tripId)}
                        title="Delete Trip"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Destination & Meta */}
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {trip.destination}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.days} Days Itinerary</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.travelers || 2} Travelers</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span>₹{trip.budget?.toLocaleString() || '15,000'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{trip.itineraryDays?.length || trip.days} Days AI Mapped</span>
                    </div>
                  </div>

                  {/* Interests tags */}
                  {trip.interests && trip.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {trip.interests.slice(0, 3).map((int, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium capitalize">
                          {int}
                        </span>
                      ))}
                      {trip.interests.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-[10px] rounded font-medium">
                          +{trip.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer CTA */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
                  <span>View Full Day-by-Day Plan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
