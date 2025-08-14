// resources/js/Pages/Admin/Event/ManageEvents.tsx
import { Head, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent, ChangeEvent } from 'react';
import { router } from '@inertiajs/react';

interface PageProps {
  auth: { user: any };
  events: any[];
}

export default function ManageEvents() {
  
  const { events, auth } = usePage().props as any;

  const { data, setData, post, processing } = useForm({
  title: '',
  description: '',
  type: 'olahraga' as const,
  start_date: '',
  end_date: '',
  sport_categories: [] as string[],          
  team_required_sports: [] as string[],      
  team_size: {} as Record<string, number>, 
  is_published: false,
});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.events.store'));
  };

  const togglePublish = (id: number) => {
    router.patch(route('admin.events.toggle-publish', id));
  };
  
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-900">Kelola Event</h2>}
    >
      <Head title="Kelola Event" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* FORM TAMBAH EVENT */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-8 text-gray-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Buat Event Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900 ">
                {/* Judul */}
                <div>
                  <Label htmlFor="title" >Judul Event</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                    required
                  />
                </div>

                {/* Tipe */}
                <div>
                  <Label htmlFor="type">Tipe</Label>
                  <select
                    id="type"
                    value={data.type}
                    onChange={(e) => setData('type', e.target.value as any)}
                    className="block w-full rounded-md border-gray-300"
                  >
                    <option value="olahraga">Olahraga</option>
                    <option value="non-olahraga">Non-Olahraga</option>
                    <option value="pemberitahuan">Pemberitahuan</option>
                  </select>
                </div>

                {/* Deskripsi */}
                <div className="col-span-2 text-gray-900">
                  <Label htmlFor="description">Deskripsi</Label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    className="block w-full rounded-md border-gray-300 text-gray-900"
                    rows={3}
                  />
                </div>

                {/* Tanggal Mulai */}
                <div>
                  <Label htmlFor="start_date">Mulai</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={data.start_date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setData('start_date', e.target.value)}
                    required
                  />
                </div>

                {/* Tanggal Selesai */}
                <div>
                  <Label htmlFor="end_date">Selesai</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={data.end_date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setData('end_date', e.target.value)}
                    required
                  />
                </div>

                {/* Kategori Olahraga (jika tipe = olahraga) */}
                {data.type === 'olahraga' && (
  <>
    {/* ① Semua cabang */}
    <div className="col-span-2">
      <Label>Cabang Olahraga (pisah koma)</Label> <br />
      <textarea
        placeholder="futsal, badminton, basket, sepak bola"
        rows={2}
        defaultValue={data.sport_categories.join(', ')}
        onBlur={e =>
        setData(
        'sport_categories',
        e.target.value
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
    )
  }
/>
    </div>

    {/* ② Pilih yang wajib tim (checkbox) */}
    <div className="col-span-2">
      <Label>Cabang yg wajib tim</Label>
      <div className="flex flex-col gap-2">
        {data.sport_categories.map(cabang => (
          <label key={cabang} className="flex items-center">
            <input
              type="checkbox"
              checked={data.team_required_sports.includes(cabang)}
              onChange={e =>
                setData(
                  'team_required_sports',
                  e.target.checked
                    ? [...data.team_required_sports, cabang]
                    : data.team_required_sports.filter(x => x !== cabang)
                )
              }
            />
            <span className="ml-2">{cabang}</span>
          </label>
        ))}
      </div>
    </div>

    {/* ③ Jumlah anggota per cabang */}
    <div className="flex flex-col gap-4">
  {data.team_required_sports.map(cabang => (
    <div key={cabang}>
      <Label>Jumlah tim {cabang}</Label>
      <Input
        type="number"
        min="1"
        value={data.team_size[cabang] || ''}
        onChange={e =>
          setData('team_size', {
            ...data.team_size,
            [cabang]: parseInt(e.target.value) || 1,
          })
        }
      />
    </div>
  ))}
</div>

  </>
)}
                
              </div>
              <Button type="submit" disabled={processing}>
                {processing ? 'Menyimpan...' : 'Simpan Event'}
              </Button>
            </form>
          </div>

          {/* DAFTAR EVENT */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Daftar Event</h3>
            {events.length ? (
              <div className="space-y-4">
                {events.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.start_date} s/d {event.end_date}</p>
                    </div>

                    <button
                      onClick={() => togglePublish(event.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        event.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {event.is_published ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => router.delete(route('admin.events.destroy', event.id))}
                      className="text-red-600 hover:underline"
                    >
                    Hapus
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Belum ada event.</p>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}