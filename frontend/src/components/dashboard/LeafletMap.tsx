import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Play, MapPin, Clock, Route, ShieldCheck } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
// @ts-ignore
import 'leaflet/dist/leaflet.css';

// ── Fix default marker icon ──────────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const blueIcon = new L.Icon({
  iconUrl:    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl:  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl:    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
const greenIcon = new L.Icon({
  iconUrl:    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [20, 33], iconAnchor: [10, 33], popupAnchor: [1, -28], shadowSize: [33, 33],
});

// ── الجامعة الروسية - مدينة بدر (بيانات حقيقية من Supabase) ────────────────
interface CampusLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  slam_x: number;
  slam_y: number;
}

const CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: 1, name: 'University Main Area',         lat: 30.1421428142082, lng: 31.7186033681036, slam_x: 0,   slam_y: 0    },
  { id: 2, name: 'Faculty of Pharmacy',          lat: 30.1431169713564, lng: 31.7196687007773, slam_x: 108, slam_y: 110  },
  { id: 3, name: 'Faculty of Applied Arts',      lat: 30.1438220980414, lng: 31.7188823450598, slam_x: 185, slam_y: 25   },
  { id: 4, name: 'Faculty of Engineering',       lat: 30.1437478744172, lng: 31.7171165731271, slam_x: 178, slam_y: -135 },
  { id: 5, name: 'Faculty of Fine Arts',         lat: 30.1424953423363, lng: 31.7188340653420, slam_x: 38,  slam_y: 22   },
  { id: 6, name: 'Old Faculty of Pharmacy',      lat: 30.1431628738832, lng: 31.7166890948833, slam_x: 112, slam_y: -180 },
  { id: 7, name: 'Faculty of Artificial Intelligence', lat: 30.1423184932048, lng: 31.7190506192898, slam_x: 19, slam_y: 42 },
  { id: 8, name: 'Faculty of Al-Alsun and Languages', lat: 30.1437844420701, lng: 31.7199625703625, slam_x: 182, slam_y: 138 },
  { id: 9, name: 'Faculty of Business Administration', lat: 30.1438444693103, lng: 31.7179326355718, slam_x: 188, slam_y: -62 },
];

// مركز الجامعة (المنطقة الرئيسية)
const DEFAULT_CENTER: [number, number] = [30.1431, 31.7186];
const DEFAULT_ZOOM = 17;

// ── SLAM → GPS Calibration (معايرة حقيقية باستخدام نقطتين من الداتابيز) ───────
// نقطة 1: University Main Area → SLAM(0,0) ↔ GPS(30.14214, 31.71860)
// نقطة 2: Faculty of Engineering → SLAM(178,-135) ↔ GPS(30.14374, 31.71712)
const SLAM_ORIGIN = { slam: { x: 0, y: 0 }, gps: { lat: 30.1421428142082, lng: 31.7186033681036 } };
const SLAM_REF2   = { slam: { x: 178, y: -135 }, gps: { lat: 30.1437478744172, lng: 31.7171165731271 } };

const slamScale = {
  latPerX: (SLAM_REF2.gps.lat - SLAM_ORIGIN.gps.lat) / (SLAM_REF2.slam.x - SLAM_ORIGIN.slam.x), // ~0.0000901
  lngPerY: (SLAM_REF2.gps.lng - SLAM_ORIGIN.gps.lng) / (SLAM_REF2.slam.y - SLAM_ORIGIN.slam.y), // ~0.0001101
};

function slamToGps(slam_x: number, slam_y: number): [number, number] {
  const lat = SLAM_ORIGIN.gps.lat + slamScale.latPerX * slam_x;
  const lng = SLAM_ORIGIN.gps.lng + slamScale.lngPerY * slam_y;
  return [lat, lng];
}

// ── Haversine distance (meters) ───────────────────────────────────────────────
function haversineMeters(a: [number, number], b: [number, number]): number {
  const R = 6371000;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2
    + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

// ── Sub-components ────────────────────────────────────────────────────────────
const ClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
};

const FlyTo: React.FC<{ position: [number, number]; zoom?: number }> = ({ position, zoom = 18 }) => {
  const map = useMap();
  useEffect(() => { map.flyTo(position, zoom, { duration: 1.2 }); }, [position]);
  return null;
};

// ── Main Component ────────────────────────────────────────────────────────────
const LeafletMap: React.FC = () => {
  const [wheelchairPos, setWheelchairPos] = useState<[number, number]>(DEFAULT_CENTER);
  const [destination, setDestination]     = useState<[number, number] | null>(null);
  const [originName, setOriginName]       = useState('University Main Area');
  const [destName, setDestName]           = useState('');
  const [isMoving, setIsMoving]           = useState(false);
  const [flyTarget, setFlyTarget]         = useState<[number, number] | null>(null);
  const [pathStatus, setPathStatus]       = useState<'SAFE' | 'RECALCULATING'>('SAFE');
  const [showAllMarkers, setShowAllMarkers] = useState(true);

  const distanceM = destination ? haversineMeters(wheelchairPos, destination) : 0;
  const distanceKm = distanceM / 1000;
  // افتراض سرعة الكرسي 1.2 م/ث
  const etaMinutes = distanceM > 0 ? Math.ceil(distanceM / 1.2 / 60) : 0;

  const handleDestSelect = (name: string) => {
    const loc = CAMPUS_LOCATIONS.find(l => l.name === name);
    if (!loc) { setDestination(null); setDestName(''); return; }
    setDestName(name);
    const pos: [number, number] = [loc.lat, loc.lng];
    setDestination(pos);
    setFlyTarget(pos);
    setPathStatus('SAFE');
  };

  const handleOriginSelect = (name: string) => {
    const loc = CAMPUS_LOCATIONS.find(l => l.name === name);
    if (!loc) return;
    setOriginName(name);
    setWheelchairPos([loc.lat, loc.lng]);
    setFlyTarget([loc.lat, loc.lng]);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (isMoving) return;
    setDestination([lat, lng]);
    setDestName('Custom Point');
    setPathStatus('SAFE');
  };

  const simulateMove = () => {
    if (!destination || isMoving) return;
    setIsMoving(true);
    setPathStatus('RECALCULATING');
    const steps = 80;
    let step = 0;
    const startLat = wheelchairPos[0];
    const startLng = wheelchairPos[1];
    const dLat = (destination[0] - startLat) / steps;
    const dLng = (destination[1] - startLng) / steps;

    const interval = setInterval(() => {
      step++;
      if (step <= steps) {
        setWheelchairPos([startLat + dLat * step, startLng + dLng * step]);
      } else {
        clearInterval(interval);
        setWheelchairPos(destination);
        setDestination(null);
        setDestName('');
        setIsMoving(false);
        setPathStatus('SAFE');
      }
    }, 60);
  };

  // ── Supabase Real-time: استقبال موقع الكرسي من SLAM ─────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('wheelchair-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'wheelchair_status' },
        (payload) => {
          const row = payload.new as { x?: number; y?: number; slam_x?: number; slam_y?: number };
          const sx = row.x ?? row.slam_x ?? 0;
          const sy = row.y ?? row.slam_y ?? 0;
          setWheelchairPos(slamToGps(sx, sy));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="bg-surface p-3.5 rounded-xl glow-border h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Navigation size={12} className="text-primary" />
          <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground">
            PATH_PLANNING — الجامعة الروسية · مدينة بدر
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllMarkers(v => !v)}
            className="text-[9px] font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            {showAllMarkers ? 'HIDE_FACULTIES' : 'SHOW_FACULTIES'}
          </button>
          {destination && (
            <button
              onClick={simulateMove}
              disabled={isMoving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-lg text-primary text-[10px] font-mono font-bold hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              <Play size={10} />
              {isMoving ? 'MOVING...' : 'TEST_MOVE'}
            </button>
          )}
        </div>
      </div>

      {/* Origin / Destination */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-[8px] font-mono text-muted-foreground mb-1 block">ORIGIN</label>
          <select
            value={originName}
            onChange={(e) => handleOriginSelect(e.target.value)}
            className="w-full h-8 px-2 bg-secondary rounded-lg text-[10px] font-mono text-foreground border-none outline-none focus:ring-1 focus:ring-primary/30 appearance-none"
          >
            {CAMPUS_LOCATIONS.map(l => (
              <option key={l.id} value={l.name}>{l.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[8px] font-mono text-muted-foreground mb-1 block">DESTINATION</label>
          <select
            value={destName}
            onChange={(e) => handleDestSelect(e.target.value)}
            className="w-full h-8 px-2 bg-secondary rounded-lg text-[10px] font-mono text-foreground border-none outline-none focus:ring-1 focus:ring-primary/30 appearance-none"
          >
            <option value="">— Select Faculty —</option>
            {CAMPUS_LOCATIONS.map(l => (
              <option key={l.id} value={l.name}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Widgets */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-background rounded-lg p-2 glow-border text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Clock size={9} className="text-primary" />
            <p className="text-[8px] font-mono text-muted-foreground">ETA</p>
          </div>
          <p className="text-sm font-mono text-primary font-bold">
            {etaMinutes > 0 ? `${etaMinutes} min` : '--'}
          </p>
        </div>
        <div className="bg-background rounded-lg p-2 glow-border text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Route size={9} className="text-primary" />
            <p className="text-[8px] font-mono text-muted-foreground">DISTANCE</p>
          </div>
          <p className="text-sm font-mono text-primary font-bold">
            {distanceM > 0
              ? distanceM < 1000 ? `${Math.round(distanceM)} m` : `${distanceKm.toFixed(2)} km`
              : '--'}
          </p>
        </div>
        <div className="bg-background rounded-lg p-2 glow-border text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <ShieldCheck size={9} className={pathStatus === 'SAFE' ? 'text-accent' : 'text-amber-400'} />
            <p className="text-[8px] font-mono text-muted-foreground">PATH</p>
          </div>
          <p className={`text-sm font-mono font-bold ${pathStatus === 'SAFE' ? 'text-accent' : 'text-amber-400'}`}>
            {pathStatus}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 min-h-[280px] rounded-lg overflow-hidden glow-border relative z-0">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {/* Dark tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <ClickHandler onMapClick={handleMapClick} />
          {flyTarget && <FlyTo position={flyTarget} />}

          {/* 🦽 Wheelchair marker */}
          <Marker position={wheelchairPos} icon={blueIcon}>
            <Popup>
              <span className="font-mono text-xs font-bold">🦽 WC-01 (Current Position)</span><br />
              <span className="font-mono text-[10px] text-gray-500">
                {wheelchairPos[0].toFixed(6)}, {wheelchairPos[1].toFixed(6)}
              </span>
            </Popup>
          </Marker>

          {/* 📍 Destination marker */}
          {destination && (
            <Marker position={destination} icon={redIcon}>
              <Popup>
                <span className="font-mono text-xs font-bold">📍 {destName}</span>
              </Popup>
            </Marker>
          )}

          {/* 🟢 All campus faculty markers */}
          {showAllMarkers && CAMPUS_LOCATIONS.map(loc => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={greenIcon}
              eventHandlers={{
                click: () => {
                  setDestName(loc.name);
                  setDestination([loc.lat, loc.lng]);
                  setFlyTarget([loc.lat, loc.lng]);
                  setPathStatus('SAFE');
                }
              }}
            >
              <Popup>
                <div className="font-mono">
                  <p className="text-xs font-bold mb-1">{loc.name}</p>
                  <p className="text-[10px] text-gray-500">
                    SLAM: ({loc.slam_x}, {loc.slam_y})<br />
                    GPS: {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                  </p>
                  <button
                    onClick={() => handleDestSelect(loc.name)}
                    className="mt-2 text-[10px] px-2 py-0.5 bg-blue-100 rounded hover:bg-blue-200"
                  >
                    Set as Destination
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Path line */}
          {destination && (
            <Polyline
              positions={[wheelchairPos, destination]}
              pathOptions={{ color: '#22D3EE', weight: 3, dashArray: '10, 6' }}
            />
          )}

          {/* Radius circle around wheelchair */}
          <Circle
            center={wheelchairPos}
            radius={5}
            pathOptions={{ color: '#22D3EE', fillColor: '#22D3EE', fillOpacity: 0.4, weight: 1 }}
          />
        </MapContainer>
      </div>

      {/* Coordinates footer */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-background rounded-lg p-2 glow-border">
          <p className="text-[8px] font-mono text-muted-foreground mb-0.5">WHEELCHAIR_POS</p>
          <p className="text-[10px] font-mono text-primary font-bold">
            {wheelchairPos[0].toFixed(6)}, {wheelchairPos[1].toFixed(6)}
          </p>
        </div>
        <div className="bg-background rounded-lg p-2 glow-border">
          <p className="text-[8px] font-mono text-muted-foreground mb-0.5">DESTINATION</p>
          <p className="text-[10px] font-mono text-destructive font-bold">
            {destination
              ? `${destination[0].toFixed(6)}, ${destination[1].toFixed(6)}`
              : 'CLICK_MAP_OR_SELECT'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;