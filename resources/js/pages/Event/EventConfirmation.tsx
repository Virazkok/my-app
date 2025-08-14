import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import BottomNavbar from '@/components/Murid/BottomNavbar';
import axios from 'axios';

interface Event {
  end_date_plain: string;
  start_date_plain: string;
  start_timestamp: number;
  end_timestamp: number;
  id: number;
  title: string;
  type: string;
  start_date: string;
  end_date: string;
}

interface Registration {
  id: number;
  sport_category?: string;
  team_members?: string[];
  user: {
    name: string;
    murid: {
      kelas: {
        name: string;
      };
    };
  };
}

interface PageProps {
  event: Event;
  registration: Registration;
  canGenerateQR: boolean;
  qrMessage?: string;
  auth: { user: { id: number } };
  [key: string]: any;
  // Tambahkan ini untuk respons Inertia
  props?: {
    qr_code?: string;
    error?: boolean;
  };
}

export default function EventConfirmation() {
  const { event, registration, qrMessage } = usePage<PageProps>().props;
  const [qrCode, setQrCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const parseLocalDate = (dateString: string) => {
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
  };

  const startDate = parseLocalDate(event.start_date_plain);
  const endDate = parseLocalDate(event.end_date_plain);
  const now = new Date();
  const canGenerateQR = now >= startDate && now <= endDate;

  const generateQR = async () => {
  if (!canGenerateQR) return;
  setIsGenerating(true);
  
  try {
    const { data } = await axios.post(route('events.qr', event.id));
    setQrCode(data.props?.qr_code || '');
  } catch (err) {
    console.error(err);
  } finally {
    setIsGenerating(false);
  }
};
  return (
    <div className="bg-white min-h-screen p-4">
      <div className="max-w-2xl mx-auto text-gray-900">
        <h1 className="text-2xl font-bold mb-6">Bukti Pendaftaran</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{event.title}</h2>
          <div className="space-y-3">
            <div className="flex">
              <span className="text-gray-600">Nama:</span>
              <span>{registration.user.name}</span>
            </div>
            <div className="flex">
              <span className="text-gray-600">Kelas:</span>
              <span>{registration.user.murid.kelas.name}</span>
            </div>
            {event.type === 'olahraga' && registration.sport_category && (
              <div className="flex">
                <span className="text-gray-600">Cabang Lomba:</span>
                <span>{registration.sport_category}</span>
              </div>
            )}
            <div className="flex">
              <span className="text-gray-600">Tanggal Pendaftaran:</span>
              <span>{new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>

        {qrCode ? (
  <div className="text-center mb-6">
    <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-2 border-dashed border-gray-300 mb-2">
        <div dangerouslySetInnerHTML={{ __html: qrCode }} />
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Scan QR ini saat hadir di event
      </p>
      {/* Tombol selesai di bawah QR */}
      <button
        onClick={() => router.visit(route('events.event-detail', { id: event.id }))}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
      >
        Selesai
      </button>
    </div>
  </div>
) : (
  <div className="space-y-2">
    {!canGenerateQR && (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg">
        {now < startDate
          ? `QR code akan tersedia mulai ${startDate.toLocaleString('id-ID', {
              timeZone: 'Asia/Jakarta',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}`
          : 'Event telah berakhir'}
      </div>
    )}

    {/* Tombol Generate + Selesai sejajar */}
    <div className="flex gap-2">
      <button
        onClick={generateQR}
        disabled={!canGenerateQR || isGenerating}
        className={`flex-1 py-2 px-4 rounded-lg ${
          canGenerateQR
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isGenerating ? 'Membuat QR Code...' : 'Generate QR Code'}
      </button>
      <button
        onClick={() => router.visit(route('events.event-detail', { id: event.id }))}
        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
      >
        Selesai
      </button>
    </div>
  </div>
)}

        <div className="mt-4 text-xs text-gray-500">
          <p>Debug Info:</p>
          <p>Sekarang: {now.toString()}</p>
          <p>Mulai Event: {startDate.toString()}</p>
          <p>Akhir Event: {endDate.toString()}</p>
          <p>canGenerateQR: {canGenerateQR.toString()}</p>
        </div>

        <BottomNavbar />
      </div>
    </div>
  );
}