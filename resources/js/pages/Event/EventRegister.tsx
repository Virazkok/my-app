import { usePage, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import BottomNavbar from '@/components/Murid/BottomNavbar';

interface Event {
  id: number;
  title: string;
  type: string;
  sport_categories?: string[];
  team_required_sports?: string[];
}

interface User {
  id: number;
  name: string;
    kelas?: {
      name: string;
    };
}

interface PageProps {
  event: Event;
  auth: { user: User };
  [key: string]: any;
}

export default function EventRegister() {
  const { event, auth } = usePage<PageProps>().props;
  const [sportCategory, setSportCategory] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: any = {};
    if (event.type === 'olahraga') {
      payload.sport_category = sportCategory;
      if (event.team_required_sports?.includes(sportCategory)) {
        payload.team_members = teamMembers.split(',').map(m => m.trim()).filter(Boolean);
      }
    }

    router.post(route('events.register', event.id), payload, {
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => router.visit(route('events.confirmation', { id: event.id })),
    });
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <Head title={`Daftar ${event.title}`} />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">Pendaftaran {event.title}</h1>
        
        {/* Display user info (read-only) */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-medium text-lg mb-3 text-gray-700">Informasi Peserta</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nama</p>
              <p className="font-medium text-gray-700">{auth.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kelas</p>
              <p className="font-medium text-gray-700">{auth.user.kelas?.name || '-'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {event.type === 'olahraga' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cabang Olahraga *
              </label>
              <select
                required
                value={sportCategory}
                onChange={(e) => setSportCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-900"
              >
                <option value="">Pilih Cabang</option>
                {event.sport_categories?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.visit(route('events.event-detail', { id: event.id }))}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>
      </div>

      <BottomNavbar />
    </div>
  );
}