// resources/js/Pages/Eskul/AbsensiEskul.tsx
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent } from 'react';

// Definisikan tipe untuk props
interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface EskulItem {
  id: number;
  nama: string;
}

interface AbsensiItem {
  id: number;
  eskul_id: number;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  kehadiran: {
    user_id: number;
  }[];
}

interface PageProps {
  auth: {
    user: AuthUser;
  };
  eskul: EskulItem[];
  absensiHariIni: AbsensiItem[];
}

export default function AbsensiEskul() {
  // Gunakan tipe casting untuk props
  const page = usePage();
  const props = page.props as any;
  const { auth, eskul, absensiHariIni } = props;
  
  const { data, setData, post, processing, errors } = useForm({
    absensi_eskul_id: '',
    foto: null as File | null
  });

  const handleSubmit = (absensiId: string) => (e: FormEvent) => {
    e.preventDefault();
    setData('absensi_eskul_id', absensiId);
    post(route('eskul.absensi.store'), {
    forceFormData: true,
    onSuccess: () => {
      setData('foto', null);
    // Refresh data di halaman DetailAbsensi (jika admin sedang membuka)
      router.reload({ only: ['absensiHariIni'] });
    },
  });
};

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Absensi Eskul</h2>}
    >
      <Head title="Absensi Eskul" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {eskul.length === 0 ? (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <p>Anda belum terdaftar di eskul apapun.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eskul.map((eskulItem: EskulItem) => (
                <div key={eskulItem.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900">
                  <h3 className="text-lg font-semibold mb-4">{eskulItem.nama}</h3>
                  
                  {absensiHariIni.filter((a: AbsensiItem) => a.eskul_id === eskulItem.id).length > 0 ? (
                    absensiHariIni
                      .filter((a: AbsensiItem) => a.eskul_id === eskulItem.id)
                      .map((absensi: AbsensiItem) => (
                        <div key={absensi.id} className="mb-6">
                          <h4 className="font-medium mb-2">
                            Sesi: {new Date(absensi.tanggal).toLocaleDateString('id-ID', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </h4>
                          <p>Jam: {absensi.jam_mulai} - {absensi.jam_selesai}</p>
                          
                          {absensi.kehadiran.some((k: { user_id: number }) => k.user_id === auth.user.id) ? (
                            <p className="text-green-500 mt-2">Anda sudah absen</p>
                          ) : (
                            <form onSubmit={handleSubmit(absensi.id.toString())} className="mt-4">
                              <div className="grid gap-4">
                                <div>
                                  <Label htmlFor={`foto-${absensi.id}`}>Unggah Foto Kehadiran</Label>
                                  <Input
                                    id={`foto-${absensi.id}`}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files.length > 0) {
                                        setData('foto', e.target.files[0]);
                                      } else {
                                        setData('foto', null);
                                      }
                                    }}
                                    required
                                  />
                                  {errors.foto && <p className="text-red-500 text-sm mt-1">{errors.foto}</p>}
                                </div>
                                
                                <Button type="submit" disabled={processing}>
                                  {processing ? 'Mengirim...' : 'Absen Sekarang'}
                                </Button>
                              </div>
                            </form>
                          )}
                        </div>
                      ))
                  ) : (
                    <p>Tidak ada jadwal absen hari ini.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}