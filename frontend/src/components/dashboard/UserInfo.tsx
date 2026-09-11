import React from 'react';
import { User, Phone, AlertTriangle, Clock } from 'lucide-react';
import type { UserProfile } from '@/services/api';

interface UserInfoProps {
  user: UserProfile | null;
}

/** ✅ تحويل timestamp بشكل أدق (حل مشكلة الساعة) */
function formatDateTime(iso?: string | null): string {
  if (!iso) return '--';

  try {
    const date = new Date(iso); // 👈 بدون أي تعديل

    if (isNaN(date.getTime())) return '--';

    return date.toLocaleString('en-GB', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

  } catch {
    return '--';
  }
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'XX';

  return (
    <div className="bg-surface p-3.5 rounded-xl glow-border h-full">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        <User size={12} className="text-primary" />
        <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground">
          USER_INFO
        </h3>
      </div>

      {/* AVATAR + NAME */}
      <div className="flex items-center gap-3 mb-3">

        {/* ❌ تم إلغاء الصورة (مسيبها comment) */}
        {/*
        { user?.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover glow-cyan border border-primary/30"
          />
        ) : (
        */}
        
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-mono text-sm font-bold glow-cyan">
          {initials}
        </div>

        {/* )} */}

        <div>
          <p className="text-xs font-mono text-foreground font-semibold">
            {user?.name || 'Unknown'}
          </p>
          <p className="text-[9px] font-mono text-muted-foreground">
            ID: {user?.id ? `WC-${user.id.toString().padStart(4, '0')}` : 'N/A'}
          </p>
        </div>
      </div>

      {/* INFO ROWS */}
      <div className="space-y-1.5 text-[11px] font-mono">

        <InfoRow
          label="AGE"
          value={user?.age ? `${user.age} yrs` : '--'}
        />

        <InfoRow
          label="PHONE"
          value={user?.phone || '--'}
          icon={<Phone size={10} />}
        />


        <InfoRow
          label="STATUS"
          value={user?.status || 'ACTIVE'}
          valueClass={
            user?.status === 'Present' || user?.status === 'ACTIVE'
              ? 'text-green-400'
              : 'text-yellow-400'
          }
        />

        {/* ✅ Last Login */}
        <InfoRow
          label="LAST_LOGIN"
          value={formatDateTime(user?.last_login)}
          icon={<Clock size={10} />}
          valueClass="text-primary"
        />

      </div>
    </div>
  );
};

const InfoRow: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClass?: string;
}> = ({ label, value, icon, valueClass = 'text-foreground' }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-primary/5">
    <span className="text-muted-foreground flex items-center gap-1.5">
      {icon}
      {label}
    </span>
    <span className={`${valueClass} flex items-center gap-1.5`}>
      {value}
    </span>
  </div>
);

export default UserInfo;