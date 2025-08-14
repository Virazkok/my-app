import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QrScannerComponent from '@/components/absensi/QRScanner';

interface EventScannerProps {
  eventId: number;
}

export default function EventScanner({ eventId }: EventScannerProps) {
  const [scanMode, setScanMode] = useState(false);
  const [lastScanned, setLastScanned] = useState<any | null>(null);

  const handleScan = async (qrData: string) => {
  try {
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch {
      throw new Error('Format QR tidak valid');
    }

    if (!parsedData.token) {
   throw new Error('QR code tidak valid');
}
    const response = await fetch(`/api/events/scan-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_data: parsedData }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || 'Kehadiran berhasil dicatat!');
      setLastScanned(data.registration);
    } else {
      throw new Error(data.message || 'Gagal memproses QR Code');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
  }
};

  return (
    <div className="p-6 bg-white rounded shadow">
      <ToastContainer position="top-right" autoClose={5000} />

      {!scanMode ? (
        <button
          onClick={() => setScanMode(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Mode Scan QR (Event)
        </button>
      ) : (
        <QrScannerComponent onScan={handleScan} onClose={() => setScanMode(false)} />
      )}

      {lastScanned && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Data Kehadiran Terakhir</h3>
          <p>Peserta: {lastScanned.user?.name}</p>
          <p>Kategori: {lastScanned.sport_category || '-'}</p>
          <p>Waktu: {new Date().toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}
