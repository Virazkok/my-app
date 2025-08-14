import { useEffect, useState } from 'react';
import axios from 'axios';
import BottomNavbar from '@/components/Murid/BottomNavbar';

// --- axios config (dari Dashboard.tsx) -----------------
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';

const HomeSiswa = () => {
  /* ---------- UI STATE ---------- */
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState({ nama: '', kelas: '', avatar: '', email: '' });

  /* ---------- PRESENSI STATE (localStorage) ---------- */
  const [checkInStatus, setCheckInStatus] = useState('--');
  const [checkInTime, setCheckInTime]     = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime]   = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn]     = useState(false);
  const [isCheckedOut, setIsCheckedOut]   = useState(false);
  const jamPulang = 16;

  /* ---------- EFFECT JAM ---------- */
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------- EFFECT PRESENSI ---------- */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser) {
      setUser(storedUser);

      const key = `presensi-${storedUser.email}`;
      const data = JSON.parse(localStorage.getItem(key) || '{}');

      if (data.checkInTime) {
        setIsCheckedIn(true);
        setCheckInTime(data.checkInTime);
        setCheckInStatus(data.status || 'Hadir');
      }
      if (data.checkOutTime) {
        setIsCheckedOut(true);
        setCheckOutTime(data.checkOutTime);
        setCheckInStatus('Pulang');
      }
    }
  }, []);

  /* ---------- RENDER ---------- */
  const today = time.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const currentTime = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCheckIn = () => {
    window.location.href = '/murid/home/qr/checkIn'; // Menggunakan window.location.href untuk redirect
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center pt-8 pb-24 px-4 bg-white">
      {/* Avatar & Info */}
      <div className="flex items-center gap-4 w-full">
        <div>
          <h2 className="text-lg font-semibold text-gray-600">{user.nama || 'Nama Siswa'}</h2>
          <p className="text-gray-600">{user.kelas || 'Kelas'}</p>
        </div>
      </div>

      {/* Jam & Tanggal */}
      <div className="text-center mt-6">
        <h1 className="text-5xl font-bold text-gray-900">{currentTime}</h1>
        <p className="text-lg text-gray-700 capitalize">{today}</p>
      </div>

      {/* Tombol Check */}
      {!isCheckedIn ? (
        <button
          onClick={handleCheckIn}
          className="mt-10 w-56 h-56 rounded-full bg-gray-300 flex items-center justify-center shadow-inner text-lg text-gray-600"
        >
          Tap Check In
        </button>
      ) : !isCheckedOut ? (
        time.getHours() >= jamPulang ? (
          <button
            onClick={() => {/* trigger check-out */}}
            className="mt-6 w-40 h-40 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xl text-lg"
          >
            Tap Check Out
          </button>
        ) : (
          <div className="mt-6 w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-center text-sm text-gray-600 p-2">
            Sudah Check In<br />Tunggu jam pulang
          </div>
        )
      ) : (
        <div className="mt-6 w-40 h-40 rounded-full bg-green-200 flex items-center justify-center text-lg text-gray-700">
          Sudah Pulang
        </div>
      )}

      {/* Ringkasan */}
      <div className="w-full mt-6 text-center">
        <div className="flex justify-around">
          <div>
            <h4 className="text-gray-500">Status</h4>
            <p className="text-xl font-medium text-gray-600">{checkInStatus}</p>
          </div>
          <div>
            <h4 className="text-gray-500">Check In</h4>
            <p className="text-xl font-medium text-gray-600">{checkInTime || '-- : --'}</p>
          </div>
        </div>
        {checkOutTime && (
          <div className="mt-4">
            <h4 className="text-gray-500">Check Out</h4>
            <p className="text-xl font-medium text-gray-600">{checkOutTime}</p>
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default HomeSiswa;