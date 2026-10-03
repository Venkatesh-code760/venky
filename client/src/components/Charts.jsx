import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const COLORS = ['#0284c7', '#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export const BudgetPieChart = ({ budgetSummary }) => {
  if (!budgetSummary) return null;

  const data = [
    { name: 'Transport', value: budgetSummary.transport || 0 },
    { name: 'Stay (Hotels)', value: budgetSummary.accommodation || 0 },
    { name: 'Food & Dining', value: budgetSummary.food || 0 },
    { name: 'Activities', value: budgetSummary.activities || 0 },
    { name: 'Miscellaneous', value: budgetSummary.miscellaneous || 0 }
  ].filter(item => item.value > 0);

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(val) => [`₹${val.toLocaleString()}`, 'Estimated Cost']}
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BudgetComparisonBarChart = ({ budgetSummary }) => {
  if (!budgetSummary) return null;

  const data = [
    {
      name: 'Budget Comparison',
      'Target Budget': budgetSummary.userBudget || 0,
      'AI Estimated Cost': budgetSummary.totalEstimated || 0
    }
  ];

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip 
            formatter={(val) => [`₹${val.toLocaleString()}`, '']}
            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="Target Budget" fill="#0284c7" radius={[6, 6, 0, 0]} />
          <Bar 
            dataKey="AI Estimated Cost" 
            fill={budgetSummary.isOverBudget ? '#ef4444' : '#10b981'} 
            radius={[6, 6, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
