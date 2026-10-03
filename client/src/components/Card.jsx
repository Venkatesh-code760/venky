import React from 'react';

const Card = ({ children, className = '', hover = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
