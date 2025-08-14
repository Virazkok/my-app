// resources/js/Pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PageProps, Student } from '@/types';
import QrScannerComponent from '@/components/absensi/QRScanner';
import { router } from '@inertiajs/react'



const Dashboard: React.FC<PageProps> = ({ auth, students = [], kelasList = [] }) => {

  const [scanMode, setScanMode] = useState(false);
  const [lastScanned, setLastScanned] = useState<Student | null>(null);

  const handleScan = async (qrData: string) => {
  try {
    const parsedData = JSON.parse(qrData);

    const response = await fetch('/api/scan-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ qr_data: parsedData }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || 'Absensi berhasil dicatat!');
      setLastScanned(data.student);
    } else {
      throw new Error(data.message || 'Gagal memproses QR Code');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
  }
};
  useEffect(() => {
  console.log("kelasList", kelasList);
  console.log("students", students.map(s => ({ nama: s.nama, class_id: s.class_id })));
  }, []);

  const handleLogout = () => {
  router.post('/logout');
};


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Absensi</h2>}
    >
      <Head title="Dashboard" />
      <ToastContainer position="top-right" autoClose={5000} />

<div className="py-12">
  <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
      <div className="p-6 text-gray-900">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Daftar Siswa</h3>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {!scanMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {students.map((student) => (
                <div key={student.id} className="border p-4 rounded">
                  <p className="font-bold">{student.nama}</p>
                  <p>NIS: {student.nis}</p>
                  <div>Kelas: {student.kelas?.name || 'Tidak diketahui'}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setScanMode(true)}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              Mode Scan QR (Guru)
            </button>
          </>
        ) : (
          <QrScannerComponent 
            onScan={handleScan}
            onClose={() => setScanMode(false)}
          />
        )}

        {/* Last scanned student display */}
        {lastScanned && (
          <div className="mt-8 p-4 border rounded">
            <h3 className="text-lg font-medium mb-2">Data Absensi Terakhir</h3>
            <p>Siswa: {lastScanned.nama}</p>
            <p>Kelas: {lastScanned.kelas?.name || 'Tidak diketahui'}</p>
            <p>Waktu: {new Date().toLocaleTimeString()}</p>
          </div>
        )}

      </div>
    </div>
  </div>
</div>

    </AuthenticatedLayout>
  );
};

export default Dashboard;