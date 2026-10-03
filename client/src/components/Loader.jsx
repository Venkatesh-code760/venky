import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

const Loader = ({ message = 'Generating AI Travel Plan...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 animate-pulse">
          <Compass className="w-8 h-8 animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>
      <div>
        <h4 className="text-base font-bold text-slate-800">{message}</h4>
        <p className="text-xs text-slate-500 mt-1">Analyzing destinations, budget allocations, and weather patterns...</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
