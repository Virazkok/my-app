import { usePage, router } from '@inertiajs/react';
import BottomNavbar from '@/components/Murid/BottomNavbar';

interface Event {
  id: number;
  title: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  sport_categories?: string[];
}

interface Registration {
  id: number;
}

interface PageProps {
  event: Event;
  registration?: Registration;
  auth: { user: { id: number } };
  [key: string]: any;
}


export default function EventDetail() {
  const { event, registration, auth } = usePage<PageProps>().props;
  const isRegistered = !!registration;
  const now = new Date();
  const endDate = new Date(event.end_date);
  const isEnded = now > endDate;

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.visit(route('events.index'))}
          className="text-blue-600 mb-4 inline-flex items-center"
        >
          ← Kembali
        </button>

        <h1 className="text-2xl font-bold mb-2 text-gray-900">{event.title}</h1>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-900">
          <div>
            <p className="text-sm text-gray-500">Mulai</p>
            <p>{new Date(event.start_date).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Selesai</p>
            <p>{new Date(event.end_date).toLocaleString()}</p>
          </div>
        </div>

        {isRegistered ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700 font-medium">Anda sudah terdaftar di event ini</p>
            <button
              onClick={() => router.visit(route('events.confirmation', event.id))}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
            >
              Lihat Bukti Pendaftaran
            </button>
          </div>
        ) : (
          !isEnded && event.type !== 'pemberitahuan' && (
            <button
              onClick={() => router.visit(route('events.register', event.id))}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Daftar Sekarang
            </button>
          )
        )}

        {isEnded && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">Event ini sudah berakhir</p>
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
}