import React, { useState, useEffect } from 'react';
import { Gauge, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const usageData = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  usage: 40 + Math.random() * 40,
}));

const SystemAnalysis: React.FC = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setPercent(98), 300);
    return () => clearTimeout(timer);
  }, []);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-surface p-3.5 rounded-xl glow-border h-full">
      <div className="flex items-center gap-2 mb-3">
        <Gauge size={12} className="text-primary" />
        <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground">SYSTEM_ANALYSIS</h3>
      </div>

      {/* Circular Gauge */}
      <div className="flex items-center justify-center mb-3">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="hsl(228, 15%, 15%)" strokeWidth="6" fill="none" />
            <circle
              cx="50" cy="50" r="45"
              stroke="hsl(187, 82%, 53%)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
              style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.4))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-mono font-bold text-primary">{percent}%</span>
            <span className="text-[8px] font-mono text-muted-foreground">EFFICIENCY</span>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="flex items-center gap-2 mb-1.5">
        <TrendingUp size={10} className="text-accent" />
        <span className="text-[9px] font-mono text-muted-foreground">USAGE_STATISTICS</span>
      </div>
      <div className="h-[50px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={usageData}>
            <Line type="monotone" dataKey="usage" stroke="#4ADE80" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemAnalysis;
