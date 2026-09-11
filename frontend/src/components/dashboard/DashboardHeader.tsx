import React from 'react';
import { ChevronDown, LogOut, Accessibility } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserProfile } from '@/services/api';

interface DashboardHeaderProps {
  user: UserProfile | null;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'XX';

  return (
    <header className="h-14 flex items-center justify-between px-3 sm:px-6 bg-surface glow-border">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-primary/10 glow-cyan">
          <Accessibility size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xs sm:text-sm font-mono font-bold text-foreground tracking-wide">
            <span className="text-primary">Smart</span> Wheelchair
          </h1>
          <p className="text-[8px] font-mono text-muted-foreground hidden sm:block">WC-01 // DASHBOARD</p>
        </div>
      </div>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 outline-none">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-mono text-xs font-bold">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-mono text-foreground">{user?.name || 'Unknown'}</p>
                <p className="text-[10px] font-mono text-muted-foreground">OPERATOR</p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface border-primary/20">
            <DropdownMenuItem
              onClick={onLogout}
              className="text-xs font-mono text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut size={14} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
