// resources/js/Pages/Admin/Eskul/ManageAbsensi.tsx
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';



// Definisikan tipe props dengan jelas
interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface Eskul {
  id: number;
  nama: string;
}

interface AbsensiItem {
  id: number;
  eskul: {
    id: number;
    nama: string;
  };
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  dipublish: boolean;
}

interface PageProps {
  auth: {
    user: AuthUser;
  };
  eskul: Eskul[];
  absensi: AbsensiItem[];
  errors: Record<string, string>;
}

// Tipe untuk data form
type FormDataType = {
  eskul_id: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  dipublish: boolean;
};

export default function ManageAbsensi() {
  // Perbaikan: Gunakan tipe casting langsung tanpa interface tambahan
  const page = usePage();
  const props = page.props as any; // Gunakan any untuk menghindari konflik tipe
  const { auth, eskul, absensi } = props;
  
  // ... kode selanjutnya tetap sama
  
  // Gunakan tipe FormDataType untuk data form
  const { data, setData, post, processing, errors } = useForm<FormDataType>({
    eskul_id: '',
    tanggal: new Date().toISOString().split('T')[0],
    jam_mulai: '15:00',
    jam_selesai: '17:00',
    dipublish: false
  });
  // new state for dropdown
const [openMenuId, setOpenMenuId] = useState<number | null>(null);

// NEW: inline edit helpers
const [editing, setEditing] = useState<AbsensiItem | null>(null);

const editAbsensi = (absensi: AbsensiItem) => setEditing(absensi);

const { data: editData, setData: setEditData, post: postEdit, processing: editProcessing } = useForm<FormDataType>({
  eskul_id: '',
  tanggal: '',
  jam_mulai: '',
  jam_selesai: '',
  dipublish: false,
});

// open edit form & populate
const openEdit = (a: AbsensiItem) => {
  setEditing(a);
  setEditData({
    eskul_id: a.eskul.id.toString(),
    tanggal: a.tanggal,
    jam_mulai: a.jam_mulai,
    jam_selesai: a.jam_selesai,
    dipublish: a.dipublish,
  });
};

const saveEdit = (e: FormEvent) => {
  e.preventDefault();
  postEdit(route('admin.eskul.absensi.update', editing?.id), {
    onSuccess: () => {
      setEditing(null);
    },
  });
};

// delete


const deleteAbsensi = (id: number) => {
  if (confirm('Yakin ingin menghapus absensi ini?')) {
    router.delete(route('admin.eskul.absensi.destroy', id));
  }
};

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('admin.eskul.absensi.store'));
  };

  const togglePublish = (absensiId: number) => {
    post(route('admin.eskul.absensi.toggle-publish', absensiId));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setData('eskul_id', e.target.value);
  };

  // Perbaikan: Batasi field hanya pada key FormDataType
  const handleInputChange = (field: keyof FormDataType) => (e: ChangeEvent<HTMLInputElement>) => {
    // Untuk boolean, gunakan handler khusus
    if (field === 'dipublish') return;
    
    setData(field, e.target.value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setData('dipublish', checked);
  };

  useEffect(() => {
  const close = () => setOpenMenuId(null);
  document.addEventListener('click', close);
  return () => document.removeEventListener('click', close);
}, []);

  return (
    <AuthenticatedLayout
  user={auth.user}
  header={<h2 className="font-semibold text-xl text-gray-900 leading-tight">Kelola Absensi Eskul</h2>}
>
  <Head title="Kelola Absensi Eskul" />

  <div className="py-12">
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Buat Jadwal Absensi Baru</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eskul */}
            <div>
              <Label htmlFor="eskul_id" className="block text-sm font-medium text-gray-900">
                Eskul
              </Label>
              <select
                id="eskul_id"
                value={data.eskul_id}
                onChange={handleSelectChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-white"
                required
              >
                <option value="" className="text-gray-900">Pilih Eskul</option>
                {eskul.map((e: any) => (
                  <option key={e.id} value={e.id} className="text-gray-900">
                    {e.nama}
                  </option>
                ))}
              </select>
              {errors.eskul_id && <p className="text-red-600 text-sm mt-1">{errors.eskul_id}</p>}
            </div>

            {/* Tanggal */}
            <div>
              <Label htmlFor="tanggal" className="block text-sm font-medium text-gray-900">
                Tanggal
              </Label>
              <Input
                id="tanggal"
                type="date"
                value={data.tanggal}
                onChange={handleInputChange('tanggal')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                required
              />
              {errors.tanggal && <p className="text-red-600 text-sm mt-1">{errors.tanggal}</p>}
            </div>

            {/* Jam Mulai */}
            <div>
              <Label htmlFor="jam_mulai" className="block text-sm font-medium text-gray-900">
                Jam Mulai
              </Label>
              <Input
                id="jam_mulai"
                type="time"
                value={data.jam_mulai}
                onChange={handleInputChange('jam_mulai')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                required
              />
              {errors.jam_mulai && <p className="text-red-600 text-sm mt-1">{errors.jam_mulai}</p>}
            </div>

            {/* Jam Selesai */}
            <div>
              <Label htmlFor="jam_selesai" className="block text-sm font-medium text-gray-900">
                Jam Selesai
              </Label>
              <Input
                id="jam_selesai"
                type="time"
                value={data.jam_selesai}
                onChange={handleInputChange('jam_selesai')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                required
              />
              {errors.jam_selesai && <p className="text-red-600 text-sm mt-1">{errors.jam_selesai}</p>}
            </div>

            {/* Publish */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dipublish"
                checked={data.dipublish}
                onChange={(e) => handleSwitchChange(e.target.checked)}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <Label htmlFor="dipublish" className="text-sm font-medium text-gray-900">
                Publish Sekarang
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={processing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {processing ? 'Menyimpan...' : 'Simpan Jadwal'}
          </Button>
        </form>
      </div>

      {/* Tabel Daftar Absensi (warna tidak berubah) */}
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Daftar Absensi</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eskul</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
               <tbody className="bg-white divide-y divide-gray-200">
  {absensi.map((a: any) => (
    <tr key={a.id} className="relative">
      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{a.eskul.nama}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
        {new Date(a.tanggal).toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
        {a.jam_mulai} – {a.jam_selesai}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            a.dipublish
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {a.dipublish ? 'Published' : 'Draft'}
        </span>
      </td>

      {/* Aksi dengan dropdown */}
     <td className="px-6 py-4 whitespace-nowrap text-gray-900">
  {/* 1) flex container */}
  <div className="relative flex items-center space-x-2">
    <input
      type="checkbox"
      checked={a.dipublish}
      onChange={() => togglePublish(a.id)}
      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
    />

    {/* 2) three-dot button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === a.id ? null : a.id);
      }}
      className="text-gray-500 hover:text-gray-700"
    >
      &#8942;
    </button>

    {/* 3) dropdown rendered outside table flow */}
    {openMenuId === a.id && (
      <div
        className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-50"
      >
        <Link
          href={route('admin.eskul.absensi.detail', a.id)}
          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Lihat
        </Link>
        <button
          onClick={() => {
            setOpenMenuId(null);
            deleteAbsensi(a.id);
          }}
          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Hapus
        </button>
      </div>
    )}
  </div>
</td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}