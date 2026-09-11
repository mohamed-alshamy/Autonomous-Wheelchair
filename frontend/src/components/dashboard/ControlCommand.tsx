import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

const ControlCommand: React.FC = () => {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');

  return (
    <div className="bg-surface p-3.5 rounded-xl glow-border h-full">
      <div className="flex items-center gap-2 mb-3">
        <Cpu size={12} className="text-primary" />
        <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground">CONTROL_COMMAND</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode('manual')}
          className={`py-2.5 rounded-lg border transition-all duration-150 ${
            mode === 'manual'
              ? 'bg-primary/10 border-primary/40 text-primary shadow-glow'
              : 'bg-secondary border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="text-[9px] font-mono block mb-0.5">MODE_01</span>
          <span className="font-mono font-bold text-xs">MANUAL</span>
        </button>

        <button
          onClick={() => setMode('auto')}
          className={`py-2.5 rounded-lg border transition-all duration-150 ${
            mode === 'auto'
              ? 'bg-accent/10 border-accent/40 text-accent shadow-glow-green'
              : 'bg-secondary border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="text-[9px] font-mono block mb-0.5">MODE_02</span>
          <span className="font-mono font-bold text-xs">AUTONOMOUS</span>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between p-2 bg-background rounded-lg glow-border">
        <span className="text-[9px] font-mono text-muted-foreground">SYSTEM_CHECK</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-accent">OK_READY</span>
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-glow-green" />
        </div>
      </div>
    </div>
  );
};

export default ControlCommand;
