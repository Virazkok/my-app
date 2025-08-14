import React from 'react';
import { Home, Calendar, Users, Clock, User } from 'lucide-react';

const BottomNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner px-4 py-2 flex justify-between text-xs text-black z-50">
      {/* Beranda */}
      <div className="flex flex-col items-center gap-1 text-blue-600 font-semibold">
        <Home size={20} />
        <span>Beranda</span>
      </div>

      {/* Eskul */}
      <div className="flex flex-col items-center gap-1 text-gray-600">
        <Users size={20} />
        <span>Eskul</span>
      </div>

      {/* Event */}
      <div className="flex flex-col items-center gap-1 text-gray-600">
        <Calendar size={20} />
        <span>Event</span>
      </div>

      {/* Riwayat */}
      <div className="flex flex-col items-center gap-1 text-gray-600">
        <Clock size={20} />
        <span>Riwayat</span>
      </div>

      {/* Profil */}
      <div className="flex flex-col items-center gap-1 text-gray-600">
        <User size={20} />
        <span>Profil</span>
      </div>
    </div>
  );
};

export default BottomNavbar;