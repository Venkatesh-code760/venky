import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { 
  User, 
  MapPin, 
  Sliders, 
  Heart, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  // Form State matching SRS FR2
  const [homeCity, setHomeCity] = useState('New Delhi');
  const [ageGroup, setAgeGroup] = useState('26-35');
  const [travelStyle, setTravelStyle] = useState('mid-range');
  const [pace, setPace] = useState('moderate');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState('None');
  const [companions, setCompanions] = useState('couple');
  const [interests, setInterests] = useState(['beaches', 'nature', 'food']);
  const [dietaryPreferences, setDietaryPreferences] = useState(['Vegetarian Friendly']);

  // Scoring Weights (FR5)
  const [weights, setWeights] = useState({
    interestRelevance: 40,
    budgetFit: 20,
    ratingPopularity: 15,
    proximityTravelTime: 15,
    weatherSuitability: 10
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      if (res.data?.data) {
        const p = res.data.data;
        setProfile(p);
        if (p.homeCity) setHomeCity(p.homeCity);
        if (p.ageGroup) setAgeGroup(p.ageGroup);
        if (p.travelStyle) setTravelStyle(p.travelStyle);
        if (p.pace) setPace(p.pace);
        if (p.accessibilityNeeds) setAccessibilityNeeds(p.accessibilityNeeds);
        if (p.companions) setCompanions(p.companions);
        if (p.interests) setInterests(p.interests);
        if (p.dietaryPreferences) setDietaryPreferences(p.dietaryPreferences);
        if (p.scoringWeights) setWeights(p.scoringWeights);
      }
    } catch (err) {
      console.warn('Profile fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInterestToggle = (item) => {
    if (interests.includes(item)) {
      if (interests.length > 1) {
        setInterests(interests.filter(i => i !== item));
      }
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleDietaryToggle = (item) => {
    if (dietaryPreferences.includes(item)) {
      setDietaryPreferences(dietaryPreferences.filter(i => i !== item));
    } else {
      setDietaryPreferences([...dietaryPreferences, item]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');

    try {
      const payload = {
        homeCity,
        ageGroup,
        travelStyle,
        pace,
        accessibilityNeeds,
        companions,
        interests,
        dietaryPreferences,
        scoringWeights: weights
      };

      const res = await api.put('/profile', payload);
      if (res.data?.success) {
        setFeedback('Profile and custom AI scoring preferences saved successfully!');
        setTimeout(() => setFeedback(''), 3500);
      }
    } catch (err) {
      setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Loading your traveller profile..." fullScreen />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>FR2 & FR5: Traveller Profile & Scoring Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Traveller Preferences & AI Personalization
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure your travel style, dietary choices, and customize the weights used by our AI recommendation engine.
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Traveler Attributes */}
        <Card className="border-slate-200 space-y-6" hover={false}>
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Personal Details & Companions (FR2)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Home City</label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:border-sky-500 bg-white"
              >
                <option value="18-25">18 - 25 Years</option>
                <option value="26-35">26 - 35 Years</option>
                <option value="36-50">36 - 50 Years</option>
                <option value="50+">50+ Years</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Typical Companions</label>
              <select
                value={companions}
                onChange={(e) => setCompanions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:border-sky-500 bg-white"
              >
                <option value="solo">Solo Explorer</option>
                <option value="couple">Couple / Duo</option>
                <option value="family">Family Trip</option>
                <option value="friends">Group of Friends</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Travel Style</label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:border-sky-500 bg-white"
              >
                <option value="budget">Budget Backpacker</option>
                <option value="mid-range">Mid-Range Comfort</option>
                <option value="luxury">Luxury & Premium</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Preferred Pace</label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:border-sky-500 bg-white"
              >
                <option value="relaxed">Relaxed & Leisurely</option>
                <option value="moderate">Moderate & Balanced</option>
                <option value="packed">Packed & Fast-Paced</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Accessibility Needs</label>
              <input
                type="text"
                value={accessibilityNeeds}
                onChange={(e) => setAccessibilityNeeds(e.target.value)}
                placeholder="e.g. Wheelchair access, Elevator"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Interests Multi-Select */}
          <div className="pt-2">
            <label className="block font-bold text-slate-700 mb-2 text-xs">
              Primary Travel Interests
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {['beaches', 'nature', 'food', 'adventure', 'history', 'culture', 'shopping', 'relaxation'].map((item) => {
                const isSelected = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleInterestToggle(item)}
                    className={`px-3.5 py-1.5 rounded-xl border font-semibold capitalize transition-all ${
                      isSelected
                        ? 'bg-sky-50 text-sky-700 border-sky-300 ring-1 ring-sky-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="pt-2">
            <label className="block font-bold text-slate-700 mb-2 text-xs">
              Dietary Preferences
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Vegetarian Friendly', 'Vegan', 'Halal', 'Seafood Specialist', 'Gluten Free', 'No Restrictions'].map((diet) => {
                const isSelected = dietaryPreferences.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => handleDietaryToggle(diet)}
                    className={`px-3.5 py-1.5 rounded-xl border font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {diet} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* FR5: Custom Scoring Weights Configuration */}
        <Card className="border-slate-200 space-y-6" hover={false}>
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                FR5: AI Match Scoring Weights Customizer
              </h3>
              <p className="text-[11px] text-slate-500">
                Adjust the percentage weight of each factor when calculating match scores (0–100).
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Interest Relevance Weight</span>
                <span>{weights.interestRelevance}% (Default: 40%)</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={weights.interestRelevance}
                onChange={(e) => setWeights({ ...weights, interestRelevance: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Budget Fit Weight</span>
                <span>{weights.budgetFit}% (Default: 20%)</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={weights.budgetFit}
                onChange={(e) => setWeights({ ...weights, budgetFit: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Rating & Popularity Weight</span>
                <span>{weights.ratingPopularity}% (Default: 15%)</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={weights.ratingPopularity}
                onChange={(e) => setWeights({ ...weights, ratingPopularity: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Proximity & Travel Time Weight</span>
                <span>{weights.proximityTravelTime}% (Default: 15%)</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={weights.proximityTravelTime}
                onChange={(e) => setWeights({ ...weights, proximityTravelTime: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Weather Suitability Weight</span>
                <span>{weights.weatherSuitability}% (Default: 10%)</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={weights.weatherSuitability}
                onChange={(e) => setWeights({ ...weights, weatherSuitability: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-sky-600/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <span>Saving Traveller Profile...</span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save Traveller Profile & Scoring Weights (FR2, FR5)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
