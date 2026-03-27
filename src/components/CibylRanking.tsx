import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'BBC', rank2025: 1, rank2024: 3 },
  { name: 'Google', rank2025: 5, rank2024: 1 },
  { name: 'Amazon', rank2025: 6, rank2024: 4 },
  { name: 'Apple', rank2025: 10, rank2024: 15 },
  { name: 'Microsoft', rank2025: 11, rank2024: 2 },
  { name: 'Deloitte', rank2025: 16, rank2024: 12 },
  { name: 'PwC', rank2025: 17, rank2024: 14 },
  { name: 'GSK', rank2025: 23, rank2024: 20 },
  { name: 'HSBC', rank2025: 25, rank2024: 52 },
  { name: 'KPMG', rank2025: 26, rank2024: 25 },
  { name: 'EY', rank2025: 33, rank2024: 23 },
  { name: 'Accenture', rank2025: 85, rank2024: 29 },
  { name: 'P&G', rank2025: 103, rank2024: 106 },
  { name: 'Sage', rank2025: 274, rank2024: 300 },
].reverse();

export function CibylRanking() {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#333" />
          <XAxis 
            type="number" 
            reversed={true} 
            domain={[0, 300]} 
            stroke="#888" 
            label={{ value: 'Ranking Position (lower is better)', position: 'insideBottom', offset: -10, fill: '#888', fontSize: 12 }}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#888" 
            width={80} 
            interval={0}
            tick={{ fontSize: 12, fill: '#ccc' }} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            cursor={{ fill: '#ffffff10' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="rank2025" name="2025 Rank" fill="#3b82f6" radius={[4, 0, 0, 4]}>
            {data.map((entry, index) => (
              <Cell key={`cell-2025-${index}`} fill={entry.name === 'Accenture' ? '#A100FF' : '#3b82f6'} />
            ))}
          </Bar>
          <Bar dataKey="rank2024" name="2024 Rank" fill="#9ca3af" radius={[4, 0, 0, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
