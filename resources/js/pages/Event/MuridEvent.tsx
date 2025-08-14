import { usePage, router } from '@inertiajs/react';
import BottomNavbar from '@/components/Murid/BottomNavbar';
import { Key } from 'lucide-react';
import { ArrowUpRight } from "lucide-react";

interface Registration {
  user_id: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  type: 'olahraga' | 'non-olahraga' | 'pemberitahuan';
  start_date: string;
  end_date: string;
  registrations: Registration[];
}

interface PageProps {
  events: Event[];
  auth: { user: { id: number; name: string } };
  [key: string]: any;
}

export default function EventIndex() {
  const { events, auth } = usePage<PageProps>().props;

  const isRegistered = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    return event?.registrations?.some(r => r.user_id === auth.user.id) ?? false;
  };

  const goToDetail = (eventId: number) => {
    router.visit(route('events.event-detail', { id: eventId }));
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daftar Event</h1>

      {events.map(event => {
        const now = new Date();
        const start = new Date(event.start_date);
        const end = new Date(event.end_date);

        const alreadyReg = isRegistered(event.id);
        const canGenerateQr = now >= start && now <= end && alreadyReg;
        const isEnded = now > end;
        const isUpcoming = now < start;
        const isOngoing = now >= start && now <= end;

        return (
          <div
            key={event.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <img
                src={`/storage/event-images/${event.id}.jpg`}
                alt={event.title}
                className="w-full h-40 md:w-40 md:h-28 object-cover rounded-lg border"
                onError={(e: any) => (e.target.style.display = 'none')}
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg text-gray-900">{event.title}</h2>
                <p className="text-sm text-gray-700">{event.description}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {event.start_date} s.d {event.end_date}
                </p>
                <ArrowUpRight className="text-gray-500" />

                {alreadyReg && (
                  <div className="text-sm font-semibold text-green-700 mt-1">
                    ✔ Anda sudah mendaftar
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {/* Tombol untuk event yang sudah berakhir */}
                {isEnded && (
                  <span className="text-xs text-red-600 text-center">
                    Event telah berakhir
                  </span>
                )}

                {/* Tombol untuk event yang masih aktif/belum dimulai */}
                
                  <>
                    {/* Tombol Lihat Detail - muncul jika sudah mendaftar */}
                    {alreadyReg && !isEnded && (
                      <button
                        onClick={() => goToDetail(event.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow-sm"
                      >
                        Lihat Detail
                      </button>
                    )}

                    {alreadyReg && isEnded && (
                      <button
                        onClick={() => goToDetail(event.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow-sm"
                      >
                        Lihat Detail
                        
                      </button>
                    )}

                    {/* Tombol Daftar - muncul jika belum mendaftar dan bukan pemberitahuan */}
                    {!alreadyReg && event.type !== 'pemberitahuan' && !isEnded && (
                      <button
                        onClick={() => goToDetail(event.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm shadow-sm"
                      >
                        Daftar
                      </button>
                    )}

                    
                  </>
                
              </div>
            </div>
          </div>
        );
      })}
      <BottomNavbar />
    </div>
  );
}