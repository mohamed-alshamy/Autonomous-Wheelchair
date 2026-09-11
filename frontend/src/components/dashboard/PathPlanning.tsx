import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, Ruler, AlertTriangle, CheckCircle } from 'lucide-react';

const locations = ['University Main Area', 
  'Faculty of Pharmacy',
   'Faculty of Applied Arts',
   'Faculty of Engineering',
    'Faculty of Fine Arts', 
    'Old Faculty of Pharmacy', 
    'Faculty of Artificial Intelligence',
     "Faculty of Al-Alsun and Languages",
     "Faculty of Business Administration"];

const PathPlanning: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [fetchedLocations, setFetchedLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching from backend
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/locations');
        const data = await res.json();
        setFetchedLocations(data);
      } catch {
        // Fallback to mock data
        setFetchedLocations(locations);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const locationOptions = fetchedLocations.length > 0 ? fetchedLocations : locations;

  return (
    <div className="bg-surface p-3.5 rounded-xl glow-border h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Navigation size={12} className="text-primary" />
        <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground">PATH_PLANNING & NAVIGATION</h3>
      </div>

      {/* Map Placeholder */}
      <div className="relative flex-1 min-h-[140px] bg-background rounded-lg mb-3 overflow-hidden glow-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full border border-primary/20 flex items-center justify-center">
              <MapPin size={24} className="text-primary animate-pulse-glow" />
            </div>
            <p className="text-[10px] font-mono text-muted-foreground">MAP_INTERFACE</p>
            <p className="text-[8px] font-mono text-primary/50 mt-1">AWAITING_GPS_LOCK</p>
          </div>
        </div>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-[10px] font-mono text-muted-foreground block mb-1">ORIGIN</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full h-8 px-2 bg-background rounded-lg text-xs font-mono text-foreground border-none outline-none glow-border appearance-none cursor-pointer"
            disabled={loading}
          >
            <option value="">{loading ? 'FETCHING_DATA...' : 'Select location'}</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono text-muted-foreground block mb-1">DESTINATION</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full h-8 px-2 bg-background rounded-lg text-xs font-mono text-foreground border-none outline-none glow-border appearance-none cursor-pointer"
            disabled={loading}
          >
            <option value="">{loading ? 'FETCHING_DATA...' : 'Select destination'}</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatCard icon={<Clock size={12} />} label="ETA" value="3 min" />
        <StatCard icon={<Ruler size={12} />} label="DISTANCE" value="0.7 km" />
        <StatCard
          icon={<CheckCircle size={12} />}
          label="PATH"
          value="SAFE"
          valueClass="text-accent"
        />
      </div>

      <button className="w-full py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-[10px] font-mono font-bold hover:bg-primary/20 hover:shadow-glow transition-all duration-150">
        SET_DESTINATION
      </button>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}> = ({ icon, label, value, valueClass = 'text-foreground' }) => (
  <div className="bg-background rounded-lg p-2.5 glow-border text-center">
    <div className="text-primary mb-1 flex justify-center">{icon}</div>
    <p className="text-[8px] font-mono text-muted-foreground">{label}</p>
    <p className={`text-sm font-mono font-bold ${valueClass}`}>{value}</p>
  </div>
);

export default PathPlanning;
