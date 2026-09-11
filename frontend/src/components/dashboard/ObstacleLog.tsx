import React from 'react';
import { AlertTriangle, Terminal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const obstacleData = [
  { name: 'Pedestrian', value: 35, color: '#22D3EE' },
  { name: 'Static Object', value: 25, color: '#4ADE80' },
  { name: 'Vehicle', value: 20, color: '#F59E0B' },
  { name: 'Unknown', value: 20, color: '#F43F5E' },
];

const logs = [
  { time: '10:23:01', msg: 'WC-01 > Obstacle detected at 2.3m — PEDESTRIAN', level: 'warn' },
  { time: '10:22:45', msg: 'WC-01 > Path recalculated — ROUTE_B active', level: 'info' },
  { time: '10:22:12', msg: 'WC-01 > Proximity alert cleared', level: 'success' },
  { time: '10:21:58', msg: 'WC-01 > Emergency brake triggered at ZONE_A4', level: 'error' },
  { time: '10:21:30', msg: 'WC-01 > System check passed — ALL_CLEAR', level: 'success' },
  { time: '10:21:02', msg: 'WC-01 > Obstacle detected at 1.8m — STATIC_OBJ', level: 'warn' },
];

const levelColors: Record<string, string> = {
  warn: 'text-amber',
  info: 'text-primary',
  success: 'text-accent',
  error: 'text-destructive',
};

const ObstacleLog: React.FC = () => {
  return (
    <div className="bg-surface p-3.5 rounded-xl glow-border h-full flex flex-col">
      {/* Donut Chart */}
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={12} className="text-primary" />
        <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground">OBSTACLE_ANALYSIS</h3>
      </div>

      <div className="h-[110px] mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={obstacleData}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {obstacleData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#171921',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '8px',
                fontSize: '10px',
                fontFamily: 'Geist Mono, monospace',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-1 mb-3">
        {obstacleData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[9px] font-mono text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Emergency Log */}
      <div className="flex items-center gap-2 mb-2">
        <Terminal size={12} className="text-primary" />
        <span className="text-[10px] font-mono text-muted-foreground">EMERGENCY_LOG</span>
      </div>
      <div className="flex-1 bg-background rounded-lg p-2 overflow-hidden glow-border">
        <div className="space-y-1.5">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2 text-[9px] font-mono">
              <span className="text-muted-foreground shrink-0">{log.time}</span>
              <span className={levelColors[log.level]}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ObstacleLog;
