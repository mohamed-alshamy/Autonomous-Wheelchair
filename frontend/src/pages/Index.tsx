import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FaceRecognition from '@/components/auth/FaceRecognition';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserInfo from '@/components/dashboard/UserInfo';
import ControlCommand from '@/components/dashboard/ControlCommand';
import LeafletMap from '@/components/dashboard/LeafletMap';
import SensorData from '@/components/dashboard/SensorData';
import SystemAnalysis from '@/components/dashboard/SystemAnalysis';
import ObstacleLog from '@/components/dashboard/ObstacleLog';
import { api, type UserProfile } from '@/services/api';

const Index: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleAuthenticated = (userData: UserProfile) => {
    setUser(userData);
    setAuthenticated(true);
  };

  const handleLogout = async () => {
  await api.signout(); // بننادي الميثود اللي لسه ضايفينها
  setUser(null); // بنصفر الـ User State
  setAuthenticated(false); // بنرجع لصفحة الـ Face Recognition
};

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!authenticated ? (
          <FaceRecognition key="auth" onAuthenticated={handleAuthenticated} />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen"
          >
            <DashboardHeader user={user} onLogout={handleLogout} />

            <main className="flex-1 p-3 sm:p-4 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 auto-rows-min">
                <div className="lg:col-span-3">
                  <UserInfo user={user} />
                </div>
                <div className="lg:col-span-5">
                  <SensorData />
                </div>
                <div className="lg:col-span-4">
                  <ControlCommand />
                </div>

                <div className="lg:col-span-8">
                  <LeafletMap />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3 sm:gap-4">
                  <SystemAnalysis />
                  <ObstacleLog />
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
