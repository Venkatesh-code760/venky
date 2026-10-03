import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Info, Layers } from 'lucide-react';

const MapView = ({ coordinates = [], destination = 'Goa', selectedDay = null }) => {
  const [activePin, setActivePin] = useState(null);

  // Filter coordinates by day if specified
  const displayPoints = selectedDay 
    ? coordinates.filter(c => !c.day || c.day === selectedDay)
    : coordinates;

  // Fallback points if none provided
  const points = displayPoints.length > 0 ? displayPoints : [
    { name: `${destination} Central Hub`, lat: 15.5553, lng: 73.7517, day: 1, type: 'Attraction' },
    { name: `${destination} Heritage Fort`, lat: 15.4925, lng: 73.7737, day: 1, type: 'Attraction' },
    { name: `${destination} Coastal Dining`, lat: 15.5120, lng: 73.7650, day: 2, type: 'Restaurant' }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative text-white">
      {/* Top Map Header & Controls */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">
            Interactive Route & Location Map: {destination}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-sky-950 text-sky-400 border border-sky-800 rounded-full">
            {points.length} Waypoints
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Vector Route Engine (Free Open Source)</span>
        </div>
      </div>

      {/* Vector Simulated Map Canvas */}
      <div className="relative h-80 sm:h-96 w-full bg-[#0b1329] overflow-hidden flex items-center justify-center p-4">
        {/* Subtle Map Grid lines */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#6366f1 1px, #0b1329 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />

        {/* Ambient Map Glow */}
        <div className="absolute w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* SVG Route Connecting Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            strokeDasharray="6 4"
            points={points.map((p, idx) => {
              const x = 15 + ((idx * 28) % 70);
              const y = 25 + ((idx * 22) % 60);
              return `${x * 8},${y * 4.5}`;
            }).join(' ')}
          />
        </svg>

        {/* Dynamic Markers */}
        <div className="absolute inset-0 p-8 flex flex-wrap items-center justify-around pointer-events-auto">
          {points.map((pt, index) => {
            const isSelected = activePin === index;
            return (
              <div 
                key={index}
                className="relative group m-4"
                onClick={() => setActivePin(index)}
              >
                {/* Marker Button */}
                <button 
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg transition-all transform ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-950 scale-110 ring-4 ring-amber-400/30' 
                      : 'bg-sky-600/90 text-white hover:bg-sky-500 hover:scale-105'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{pt.name}</span>
                  {pt.day && (
                    <span className="text-[10px] bg-slate-950/40 px-1 rounded">D{pt.day}</span>
                  )}
                </button>

                {/* Popover Card */}
                {isSelected && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 text-xs animate-in zoom-in-95 duration-150">
                    <p className="font-bold text-white mb-1">{pt.name}</p>
                    <div className="text-[11px] text-slate-400 space-y-1 mb-2">
                      <p>Coordinates: {pt.lat?.toFixed(4)}, {pt.lng?.toFixed(4)}</p>
                      <p>Day Assignment: Day {pt.day || 1}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pt.name + ' ' + destination)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      <span>Open in Navigation Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend / Info Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Itinerary Stops</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Selected Marker</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-0.5 border-t border-dashed border-sky-400"></span>
            <span>Travel Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
