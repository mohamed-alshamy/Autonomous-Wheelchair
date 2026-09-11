import React from 'react';
import { Accessibility, LayoutDashboard, Map, Activity, Settings, Bell, BarChart3, Shield } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'SYS_NAV_01' },
  { icon: Map, label: 'Navigation', id: 'SYS_NAV_02' },
  { icon: Activity, label: 'Sensors', id: 'SYS_NAV_03' },
  { icon: BarChart3, label: 'Analytics', id: 'SYS_NAV_04' },
  { icon: Bell, label: 'Alerts', id: 'SYS_NAV_05' },
  { icon: Shield, label: 'Security', id: 'SYS_NAV_06' },
  { icon: Settings, label: 'Settings', id: 'SYS_NAV_07' },
];

const DashboardSidebar: React.FC = () => {
  const [active, setActive] = React.useState('SYS_NAV_01');

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-16 min-h-screen bg-surface flex-col items-center py-6 glow-border">
        <div className="mb-8 p-2 rounded-lg bg-primary/10 glow-cyan">
          <Accessibility size={24} className="text-primary" />
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 ${
                active === item.id
                  ? 'bg-primary/10 text-primary glow-cyan'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
              title={item.label}
            >
              <item.icon size={18} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface glow-border flex items-center justify-around px-2 py-2 safe-bottom">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 ${
              active === item.id
                ? 'bg-primary/10 text-primary glow-cyan'
                : 'text-muted-foreground'
            }`}
            title={item.label}
          >
            <item.icon size={18} />
          </button>
        ))}
      </nav>
    </>
  );
};

export default DashboardSidebar;
