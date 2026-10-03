import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { 
  Compass, 
  MapPin, 
  Heart, 
  Bookmark, 
  EyeOff, 
  Star, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  SlidersHorizontal,
  Info
} from 'lucide-react';

const CATEGORIES = ['All', 'Attraction', 'Hotel', 'Restaurant', 'Activity'];

const Recommendations = () => {
  const [destination, setDestination] = useState('Goa');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // User interactions & FR10 Feedback
  const [likedPlaces, setLikedPlaces] = useState(new Set());
  const [savedPlaces, setSavedPlaces] = useState(new Set());
  const [dismissModalOpen, setDismissModalOpen] = useState(false);
  const [dismissTarget, setDismissTarget] = useState(null);
  const [dismissReason, setDismissReason] = useState('Too expensive');
  const [feedbackToast, setFeedbackToast] = useState('');

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recommendations', {
        params: {
          destination,
          category: selectedCategory === 'All' ? undefined : selectedCategory
        }
      });
      if (res.data?.data) {
        setPlaces(res.data.data);
      }
    } catch (err) {
      console.error('Recommendations fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [destination, selectedCategory]);

  const handleLike = async (place) => {
    const id = place._id || place.id || place.name;
    const isLiked = likedPlaces.has(id);
    const newSet = new Set(likedPlaces);
    if (isLiked) newSet.delete(id);
    else newSet.add(id);
    setLikedPlaces(newSet);

    if (!isLiked) {
      try {
        await api.post('/feedback', {
          placeId: id,
          placeName: place.name,
          action: 'like'
        });
        setFeedbackToast(`Liked "${place.name}". Profile preferences reinforced!`);
        setTimeout(() => setFeedbackToast(''), 3000);
      } catch (e) {}
    }
  };

  const handleSave = async (place) => {
    const id = place._id || place.id || place.name;
    const isSaved = savedPlaces.has(id);
    const newSet = new Set(savedPlaces);
    if (isSaved) newSet.delete(id);
    else newSet.add(id);
    setSavedPlaces(newSet);

    if (!isSaved) {
      try {
        await api.post('/feedback', {
          placeId: id,
          placeName: place.name,
          action: 'save'
        });
        setFeedbackToast(`Saved "${place.name}" to your wishlist!`);
        setTimeout(() => setFeedbackToast(''), 3000);
      } catch (e) {}
    }
  };

  const openDismissModal = (place) => {
    setDismissTarget(place);
    setDismissModalOpen(true);
  };

  const confirmDismiss = async () => {
    if (!dismissTarget) return;
    const id = dismissTarget._id || dismissTarget.id || dismissTarget.name;

    try {
      await api.post('/feedback', {
        placeId: id,
        placeName: dismissTarget.name,
        action: 'dismiss',
        reason: dismissReason
      });

      // Remove from active list
      setPlaces(places.filter(p => (p._id || p.id || p.name) !== id));
      setDismissModalOpen(false);
      setFeedbackToast(`Dismissed "${dismissTarget.name}". Adaptive weights adjusted for: "${dismissReason}"`);
      setTimeout(() => setFeedbackToast(''), 4000);
    } catch (e) {
      setDismissModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>FR4 & FR5: AI Recommendation Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curated Places, Hotels & Dining
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every spot is scored against your traveler profile on a 0–100 scale using interest alignment, budget suitability, and popularity.
          </p>
        </div>

        {/* Destination Quick Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600">Destination:</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 shadow-xs"
          >
            <option value="Goa">Goa</option>
            <option value="Kerala">Kerala</option>
            <option value="Jaipur">Jaipur</option>
          </select>
        </div>
      </div>

      {feedbackToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Advisory Note per SRS 3.6 */}
      <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-sky-900">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p>
          <strong className="font-bold">SRS Note (Section 3.6):</strong> Hotel and dining suggestions are curated AI recommendations designed for trip planning, clearly distinguished from confirmed commercial reservations.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat} {cat === 'All' ? `(${places.length})` : ''}
          </button>
        ))}
      </div>

      {/* Places Grid */}
      {loading ? (
        <Loader message={`Loading scored recommendations for ${destination}...`} />
      ) : places.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500">
          No recommendations found for this category filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, idx) => {
            const pId = place._id || place.id || place.name;
            const isLiked = likedPlaces.has(pId);
            const isSaved = savedPlaces.has(pId);

            return (
              <Card key={idx} className="flex flex-col justify-between group overflow-hidden border-slate-200/90" hover={false}>
                <div className="space-y-3">
                  {/* Image Cover or Fallback Banner */}
                  <div className="relative h-44 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 overflow-hidden bg-slate-900">
                    <img
                      src={place.imageUrl || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop'}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      loading="lazy"
                    />

                    {/* Match Score Badge (FR5: 0-100) */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-emerald-400 font-extrabold text-xs flex items-center space-x-1 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{place.matchScore || 90}% Match</span>
                    </div>

                    {/* Category Label */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 font-bold text-[11px] shadow-sm">
                      {place.category}
                    </div>
                  </div>

                  {/* Header Title & Rating */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <div className="flex items-center space-x-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{place.rating || 4.7} / 5.0</span>
                      </div>
                      <span className="font-semibold text-slate-600">{place.duration || '2 hours'}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {place.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>

                  {/* Location & Price */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-slate-500 truncate max-w-[160px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{place.location}</span>
                    </div>
                    <div className="font-black text-slate-800">
                      {place.price === 0 ? 'Free Entry' : `₹${place.price.toLocaleString()} ${place.category === 'Hotel' ? '/ night' : ''}`}
                    </div>
                  </div>
                </div>

                {/* FR10 User Action Toolbar (Like, Save, Dismiss) */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleLike(place)}
                      title="Like place (FR10)"
                      className={`p-2 rounded-xl transition-colors ${
                        isLiked 
                          ? 'bg-rose-50 text-rose-600' 
                          : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleSave(place)}
                      title="Bookmark place"
                      className={`p-2 rounded-xl transition-colors ${
                        isSaved 
                          ? 'bg-sky-50 text-sky-600' 
                          : 'text-slate-400 hover:text-sky-600 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-sky-600' : ''}`} />
                    </button>
                  </div>

                  <button
                    onClick={() => openDismissModal(place)}
                    title="Dismiss place with reason (FR10 Feedback Learning)"
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-xs flex items-center space-x-1"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dismiss Reason Modal Dialog (FR10) */}
      <Modal
        isOpen={dismissModalOpen}
        onClose={() => setDismissModalOpen(false)}
        title="Dismiss Recommendation (FR10 Feedback Learning)"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Why would you like to dismiss <strong className="text-slate-900">{dismissTarget?.name}</strong>? PathPilot will update its future scoring weights based on your reason:
          </p>

          <div className="space-y-2">
            {[
              'Too expensive for my budget',
              'Not interested in this activity or theme',
              'Already visited recently',
              'Too far from main itinerary path',
              'Dietary or accessibility mismatch'
            ].map((reason) => (
              <label key={reason} className="flex items-center space-x-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="dismiss_reason"
                  value={reason}
                  checked={dismissReason === reason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  className="text-sky-600 focus:ring-sky-500"
                />
                <span className="font-semibold text-slate-700">{reason}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setDismissModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDismiss}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
            >
              Submit Feedback (FR10)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Recommendations;
